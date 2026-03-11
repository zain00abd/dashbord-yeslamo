"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, collection, query, where, limit, getDocs } from "firebase/firestore";

export default function CreateOrder() {
    const [userName, setUserName] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [address, setAddress] = useState("");
    const [orders, setOrders] = useState("");
    const [notes, setNotes] = useState("");
    const [itemsCount, setItemsCount] = useState(0);
    const [hasAccount, setHasAccount] = useState(false);

    // Account location
    const [acctCoords, setAcctCoords] = useState(null);
    const [acctCity, setAcctCity] = useState("");
    const [acctLocationDesc, setAcctLocationDesc] = useState("");

    // Different-location modal
    const [showLocModal, setShowLocModal] = useState(false);
    const [useCustomLoc, setUseCustomLoc] = useState(false);
    const [modalCoords, setModalCoords] = useState(null);
    const [modalCity, setModalCity] = useState("");
    const [modalDesc, setModalDesc] = useState("");
    const [modalGpsLoading, setModalGpsLoading] = useState(false);
    const [modalGpsError, setModalGpsError] = useState("");
    const [modalGpsDone, setModalGpsDone] = useState(false);

    // ── Real-time tracking state ─────────────────────────────
    // "idle" | "pending" | "accepted"
    const [trackingStatus, setTrackingStatus] = useState("idle");
    const [orderNumber, setOrderNumber] = useState("");
    const [orderId, setOrderId] = useState("");       // Firestore doc ID
    const [orderItems, setOrderItems] = useState([]); // for summary display
    const [driverInfo, setDriverInfo] = useState(null); // { name, phone }
    const unsubscribeRef = useRef(null);

    useEffect(() => {
        try {
            const userData = localStorage.getItem("yaslamo_user");
            if (userData) {
                const parsed = JSON.parse(userData);
                setUserName(parsed.name || "");
                setUserPhone(parsed.phone || "");
                setAddress(parsed.address || "");
                setAcctCoords(parsed.locationCoords || null);
                setAcctCity(parsed.city || "");
                setAcctLocationDesc(parsed.locationDesc || "");
                setHasAccount(true);
            }
        } catch (e) { }
    }, []);

    // Cleanup listener on unmount
    useEffect(() => () => { if (unsubscribeRef.current) unsubscribeRef.current(); }, []);

    useEffect(() => {
        const lines = orders.split("\n").filter((line) => line.trim() !== "");
        setItemsCount(lines.length);
    }, [orders]);

    function getItemsCountText() {
        if (itemsCount === 0) return "لا توجد أصناف";
        if (itemsCount === 1) return "صنف واحد";
        if (itemsCount === 2) return "صنفان";
        return `${itemsCount} أصناف`;
    }

    function parseOrders(text) {
        const lines = text.split("\n").filter((line) => line.trim() !== "");
        return lines.map((line) => {
            let itemName = line.trim();
            let quantity = 1;
            const separators = ["-", "—", ":", "،", ","];
            for (const sep of separators) {
                const idx = line.indexOf(sep);
                if (idx > 0 && idx < line.length - 1) {
                    const name = line.substring(0, idx).trim();
                    const qtyStr = line.substring(idx + 1).trim();
                    const parsed = parseInt(qtyStr);
                    if (!isNaN(parsed) && parsed > 0) { itemName = name; quantity = parsed; }
                    break;
                }
            }
            return { name: itemName || "صنف غير مسمى", quantity };
        });
    }

    function getModalLocation() {
        setModalGpsError("");
        if (!navigator.geolocation) { setModalGpsError("متصفحك لا يدعم تحديد الموقع"); return; }
        setModalGpsLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => { setModalCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setModalGpsDone(true); setModalGpsLoading(false); },
            () => { setModalGpsError("تعذّر الحصول على موقعك. تأكد من منح الإذن للمتصفح."); setModalGpsLoading(false); },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }

    function confirmCustomLocation() {
        if (!modalGpsDone) { setModalGpsError("يرجى تحديد الموقع أولاً"); return; }
        if (!modalCity.trim()) { setModalGpsError("يرجى إدخال المدينة"); return; }
        if (!modalDesc.trim()) { setModalGpsError("يرجى إدخال العنوان التفصيلي"); return; }
        setUseCustomLoc(true);
        setShowLocModal(false);
    }

    // Start listening to the order doc in real-time
    function startTracking(docId) {
        const orderRef = doc(db, "orders", docId);
        const unsub = onSnapshot(orderRef, async (snap) => {
            if (!snap.exists()) return;
            const data = snap.data();

            if (data.status === "pending") {
                setTrackingStatus("pending");
            } else if (data.status === "accepted" && data.driverId) {
                // Fetch driver profile from users collection
                let driver = { name: "المندوب", phone: "" };
                try {
                    const driverDoc = await getDocs(
                        query(collection(db, "users"), where("__name__", "==", data.driverId), limit(1))
                    );
                    // If stored by uid as doc ID, try direct approach
                    const { getDoc } = await import("firebase/firestore");
                    const dRef = doc(db, "users", data.driverId);
                    const dSnap = await getDoc(dRef);
                    if (dSnap.exists()) {
                        driver = { name: dSnap.data().name || "المندوب", phone: dSnap.data().phone || "" };
                    }
                } catch (e) { }
                setDriverInfo(driver);
                setTrackingStatus("accepted");
            }
        });
        unsubscribeRef.current = unsub;
    }

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    async function submitOrder() {
        if (!userName.trim()) { alert("الرجاء تسجيل الدخول أولاً أو إنشاء حساب"); return; }
        if (!orders.trim()) { alert("الرجاء إدخال الطلبات المطلوبة"); return; }
        const items = parseOrders(orders);
        if (items.length === 0) { alert("الرجاء إدخال صنف واحد على الأقل"); return; }

        setIsSubmitting(true);
        setSubmitError("");

        try {
            const activeCoords = useCustomLoc ? modalCoords : acctCoords;
            const activeCity = useCustomLoc ? modalCity : acctCity;
            const activeDesc = useCustomLoc ? modalDesc : acctLocationDesc;

            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerName: userName.trim(),
                    customerPhone: userPhone.trim(),
                    customerAddress: activeCity ? `${activeCity}، ${activeDesc}` : address.trim(),
                    items,
                    notes: notes.trim(),
                    locationCoords: activeCoords || null,
                    locationDesc: activeDesc,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setSubmitError(data.error || "حدث خطأ في تقديم الطلب");
                setIsSubmitting(false);
                return;
            }

            const newOrderId = data.order.id;
            const newOrderNumber = data.order.orderNumber;
            setOrderNumber(newOrderNumber);
            setOrderId(newOrderId);
            setOrderItems(items);
            setTrackingStatus("pending");
            startTracking(newOrderId);
        } catch (error) {
            setSubmitError("تعذر الاتصال بالخادم. تأكد من اتصالك بالإنترنت.");
        } finally {
            setIsSubmitting(false);
        }
    }

    function clearForm() {
        if (confirm("هل أنت متأكد من تفريغ جميع الحقول؟")) {
            setOrders("");
            setNotes("");
        }
    }

    return (
        <>
            <div className="page-wrapper">
                {/* Top Bar */}
                <div className="top-bar">
                    <Link href="/" className="top-bar-logo">
                        <Image src="/logo1.jpg" alt="يسلمو" width={36} height={36} />
                        <span>يسلمو</span>
                    </Link>
                    <Link href="/" className="top-bar-back">
                        ← الرئيسية
                    </Link>
                </div>

                {/* Form Content */}
                <div className="content-area" style={{ paddingTop: "20px", paddingBottom: "30px" }}>



                    {/* Location — two options */}
                    <div className="form-section">
                        <div className="section-title">
                            <svg viewBox="0 0 24 24">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                            <span>موقع التوصيل</span>
                        </div>

                        {/* Current active location display */}
                        <div style={{
                            background: "#f0fdf4", borderRadius: "12px", padding: "14px",
                            border: "1.5px solid #a7f3d0", marginBottom: "12px",
                        }}>
                            <div style={{ fontSize: "0.78rem", color: "#059669", fontWeight: 700, marginBottom: "6px" }}>
                                {useCustomLoc ? "📍 موقع مختلف محدد" : "📍 موقع حسابك"}
                            </div>
                            <div style={{ fontWeight: 600, color: "#1a1a2e", fontSize: "0.95rem" }}>
                                {useCustomLoc
                                    ? `${modalCity}، ${modalDesc}`
                                    : (acctCity ? `${acctCity}، ${acctLocationDesc}` : address || "—")}
                            </div>
                        </div>

                        {/* Change location button */}
                        <button
                            type="button"
                            onClick={() => setShowLocModal(true)}
                            style={{
                                width: "100%", padding: "12px", borderRadius: "12px",
                                border: "1.5px solid #ff6b35", background: "white",
                                color: "#ff6b35", fontFamily: "inherit", fontWeight: 700,
                                fontSize: "0.95rem", cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                            }}
                        >
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                            تحديد موقع مختلف
                        </button>
                    </div>

                    {/* Location modal overlay */}
                    {showLocModal && (
                        <div style={{
                            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
                            display: "flex", alignItems: "flex-end", justifyContent: "center",
                            zIndex: 1000,
                        }}
                            onClick={() => setShowLocModal(false)}
                        >
                            <div style={{
                                background: "white", borderRadius: "24px 24px 0 0",
                                padding: "24px 20px 40px", width: "100%", maxWidth: "480px",
                                maxHeight: "85vh", overflowY: "auto",
                            }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: "20px", textAlign: "center" }}>
                                    تحديد موقع مختلف
                                </div>

                                {/* GPS button */}
                                <button
                                    type="button"
                                    onClick={getModalLocation}
                                    disabled={modalGpsLoading}
                                    style={{
                                        width: "100%", display: "flex", alignItems: "center",
                                        justifyContent: "center", gap: "10px", padding: "14px",
                                        borderRadius: "12px", border: "2px dashed",
                                        borderColor: modalGpsDone ? "#10b981" : "#ff6b35",
                                        background: modalGpsDone ? "#f0fdf4" : "#fff8f6",
                                        color: modalGpsDone ? "#065f46" : "#c2410c",
                                        fontFamily: "inherit", fontWeight: 700, fontSize: "1rem",
                                        cursor: modalGpsLoading ? "wait" : "pointer",
                                        marginBottom: "12px",
                                    }}
                                >
                                    {modalGpsDone ? "✅" : "📍"}
                                    {modalGpsLoading
                                        ? "جاري تحديد موقعك..."
                                        : modalGpsDone
                                            ? `تم (${modalCoords.lat.toFixed(4)}, ${modalCoords.lng.toFixed(4)})`
                                            : "تحديد موقعي تلقائياً أولاً"}
                                </button>

                                {modalGpsError && (
                                    <div style={{ color: "#c62828", fontSize: "0.85rem", marginBottom: "10px", padding: "8px 12px", background: "#fff0f0", borderRadius: "8px" }}>
                                        {modalGpsError}
                                    </div>
                                )}

                                {/* Fields — shown only after GPS */}
                                {modalGpsDone && (
                                    <>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="المدينة"
                                            value={modalCity}
                                            onChange={(e) => setModalCity(e.target.value)}
                                            style={{ marginBottom: "12px" }}
                                        />
                                        <textarea
                                            className="form-input"
                                            style={{ minHeight: "80px", resize: "vertical" }}
                                            placeholder="عنوان تفصيلي: الحي، الشارع، بجانب أي معلم، رقم البناء..."
                                            value={modalDesc}
                                            onChange={(e) => setModalDesc(e.target.value)}
                                        />
                                    </>
                                )}

                                <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowLocModal(false)}
                                        style={{
                                            flex: 1, padding: "12px", borderRadius: "12px",
                                            border: "1.5px solid #e2e8f0", background: "white",
                                            fontFamily: "inherit", fontWeight: 600, cursor: "pointer", color: "#64748b",
                                        }}
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        type="button"
                                        onClick={confirmCustomLocation}
                                        style={{
                                            flex: 2, padding: "12px", borderRadius: "12px",
                                            border: "none", background: "#ff6b35", color: "white",
                                            fontFamily: "inherit", fontWeight: 700, cursor: "pointer",
                                        }}
                                    >
                                        تأكيد الموقع
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Orders */}
                    <div className="form-section">
                        <div className="section-title">
                            <svg viewBox="0 0 24 24">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h10v2H7v-2z" />
                            </svg>
                            <span>الطلبات المرادة</span>
                        </div>

                        <div className="form-label">
                            <svg viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                            </svg>
                            اكتب طلباتك هنا (لكل طلب سطر منفصل)
                        </div>

                        <textarea
                            className="form-textarea"
                            placeholder={`مثال:\nبيتزا عائلية - 2\nمشروب غازي - 3\nبطاطس مقلية كبيرة - 1`}
                            value={orders}
                            onChange={(e) => setOrders(e.target.value)}
                        />

                        <div className="form-hint">
                            <svg viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                            </svg>
                            <div>
                                <span>نصيحة:</span> استخدم شرطة (-) للفصل بين اسم الصنف والكمية
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="form-section">
                        <div className="section-title">
                            <svg viewBox="0 0 24 24">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                            </svg>
                            <span>ملاحظات إضافية</span>
                        </div>
                        <textarea
                            className="form-input"
                            style={{ minHeight: "70px", resize: "vertical" }}
                            placeholder="يرجى الاتصال قبل الوصول... (اختياري)"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    {/* Quick Summary */}
                    <div className="quick-summary">
                        <span className="summary-text">عدد الأصناف</span>
                        <span className="items-badge">{getItemsCountText()}</span>
                    </div>

                    {submitError && (
                        <div style={{
                            background: "#fff0f0", border: "1px solid #ffcdd2", borderRadius: "12px",
                            padding: "12px 16px", marginBottom: "20px", color: "#c62828", fontSize: "0.9rem",
                            display: "flex", alignItems: "center", gap: "8px",
                        }}>
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="#c62828">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                            </svg>
                            {submitError}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="actions-row">
                        <button className="btn btn-secondary" onClick={clearForm} disabled={isSubmitting}>
                            <svg viewBox="0 0 24 24" fill="#ff6b35">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                            </svg>
                            تفريغ
                        </button>
                        <button className="btn btn-primary" onClick={submitOrder} disabled={isSubmitting} style={{ opacity: isSubmitting ? 0.7 : 1 }}>
                            {isSubmitting ? "جاري الإرسال..." : (
                                <>
                                    <svg viewBox="0 0 24 24" fill="white">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                    </svg>
                                    تأكيد الطلب
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── TRACKING SCREEN — Pending ───────────────────────── */}
            {trackingStatus === "pending" && (
                <div style={{
                    position: "fixed", inset: 0, background: "linear-gradient(135deg,#fff8f6 0%,#fff 100%)",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    zIndex: 2000, padding: "24px", textAlign: "center",
                }}>
                    <style>{`
                        @keyframes pulse-ring {
                            0% { transform: scale(0.9); opacity: 1; }
                            100% { transform: scale(1.6); opacity: 0; }
                        }
                        @keyframes spin-dot {
                            to { stroke-dashoffset: 0; }
                        }
                        .pulse-wrap { position:relative; width:120px; height:120px; display:flex; align-items:center; justify-content:center; }
                        .pulse-ring {
                            position:absolute; inset:0; border-radius:50%;
                            border: 3px solid #ff6b35; animation: pulse-ring 1.5s ease-out infinite;
                        }
                        .pulse-ring:nth-child(2) { animation-delay:0.5s; }
                    `}</style>

                    <div className="pulse-wrap">
                        <div className="pulse-ring"></div>
                        <div className="pulse-ring"></div>
                        <div style={{
                            width: 72, height: 72, borderRadius: "50%",
                            background: "linear-gradient(135deg,#ff6b35,#ff8c5a)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: "0 8px 24px rgba(255,107,53,0.4)",
                        }}>
                            <svg viewBox="0 0 24 24" width="36" height="36" fill="white">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                        </div>
                    </div>

                    <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1a1a2e", marginTop: "32px", marginBottom: "8px" }}>
                        جاري البحث عن مندوب...
                    </h2>
                    <p style={{ color: "#64748b", fontSize: "0.95rem", marginBottom: "32px" }}>
                        طلبك في الانتظار، سيتم إشعارك فور قبول مندوب لطلبك
                    </p>

                    <div style={{
                        background: "white", borderRadius: "16px", padding: "20px 24px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.08)", width: "100%", maxWidth: "380px",
                        textAlign: "right",
                    }}>
                        <div style={{ fontSize: "0.75rem", color: "#ff6b35", fontWeight: 700, marginBottom: "12px", letterSpacing: "0.05em" }}>
                            ملخص طلبك
                        </div>
                        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1a1a2e", marginBottom: "12px" }}>
                            #{orderNumber}
                        </div>
                        {orderItems.map((item, i) => (
                            <div key={i} style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                padding: "8px 0", borderBottom: i < orderItems.length - 1 ? "1px solid #f1f5f9" : "none",
                                fontSize: "0.92rem", color: "#334155",
                            }}>
                                <span style={{ background: "#fff0eb", color: "#ff6b35", borderRadius: "6px", padding: "2px 8px", fontSize: "0.8rem", fontWeight: 700 }}>
                                    × {item.quantity}
                                </span>
                                <span>{item.name}</span>
                            </div>
                        ))}
                    </div>

                    <p style={{ marginTop: "24px", color: "#94a3b8", fontSize: "0.82rem" }}>
                        لا تغلق هذه الشاشة حتى يقبل المندوب طلبك
                    </p>
                </div>
            )}

            {/* ── TRACKING SCREEN — Accepted ──────────────────────── */}
            {trackingStatus === "accepted" && driverInfo && (
                <div style={{
                    position: "fixed", inset: 0, background: "linear-gradient(135deg,#f0fdf4 0%,#fff 100%)",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    zIndex: 2000, padding: "24px", textAlign: "center", overflowY: "auto",
                }}>
                    <style>{`
                        @keyframes pop-in {
                            0% { transform: scale(0.5); opacity: 0; }
                            70% { transform: scale(1.1); }
                            100% { transform: scale(1); opacity: 1; }
                        }
                        .accepted-icon { animation: pop-in 0.5s ease-out forwards; }
                    `}</style>

                    <div className="accepted-icon" style={{
                        width: 80, height: 80, borderRadius: "50%",
                        background: "linear-gradient(135deg,#10b981,#059669)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 8px 28px rgba(16,185,129,0.4)", marginBottom: "20px",
                    }}>
                        <svg viewBox="0 0 24 24" width="42" height="42" fill="white">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                    </div>

                    <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#065f46", marginBottom: "4px" }}>
                        تم قبول طلبك! 🎉
                    </h2>
                    <p style={{ color: "#6b7280", fontSize: "0.92rem", marginBottom: "28px" }}>
                        مندوب في طريقه إليك الآن
                    </p>

                    {/* Driver card */}
                    <div style={{
                        background: "white", borderRadius: "20px", padding: "24px",
                        boxShadow: "0 4px 24px rgba(0,0,0,0.1)", width: "100%", maxWidth: "380px",
                        textAlign: "right", marginBottom: "16px",
                    }}>
                        <div style={{ fontSize: "0.72rem", color: "#10b981", fontWeight: 700, marginBottom: "14px", letterSpacing: "0.05em" }}>
                            معلومات المندوب
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                            <div style={{
                                width: 52, height: 52, borderRadius: "50%",
                                background: "linear-gradient(135deg,#ff6b35,#ff8c5a)",
                                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                            }}>
                                <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                            </div>
                            <div>
                                <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "#1a1a2e" }}>{driverInfo.name}</div>
                                {driverInfo.phone && (
                                    <div style={{ color: "#64748b", fontSize: "0.87rem", marginTop: "2px" }} dir="ltr">{driverInfo.phone}</div>
                                )}
                            </div>
                        </div>
                        {driverInfo.phone && (
                            <a href={`tel:${driverInfo.phone}`} style={{
                                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                                marginTop: "16px", padding: "13px", borderRadius: "12px",
                                background: "linear-gradient(135deg,#10b981,#059669)", color: "white",
                                textDecoration: "none", fontWeight: 700, fontSize: "0.95rem",
                            }}>
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
                                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                                </svg>
                                اتصل بالمندوب
                            </a>
                        )}
                    </div>

                    {/* Order summary */}
                    <div style={{
                        background: "white", borderRadius: "16px", padding: "20px 24px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.06)", width: "100%", maxWidth: "380px",
                        textAlign: "right", marginBottom: "20px",
                    }}>
                        <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, marginBottom: "10px" }}>
                            تفاصيل طلبك — #{orderNumber}
                        </div>
                        {orderItems.map((item, i) => (
                            <div key={i} style={{
                                display: "flex", justifyContent: "space-between",
                                padding: "8px 0", borderBottom: i < orderItems.length - 1 ? "1px solid #f1f5f9" : "none",
                                fontSize: "0.92rem", color: "#334155",
                            }}>
                                <span style={{ background: "#f0fdf4", color: "#059669", borderRadius: "6px", padding: "2px 8px", fontSize: "0.8rem", fontWeight: 700 }}>
                                    × {item.quantity}
                                </span>
                                <span>{item.name}</span>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => { setTrackingStatus("idle"); setOrderItems([]); setOrders(""); setNotes(""); }}
                        style={{
                            padding: "13px 32px", borderRadius: "12px", border: "1.5px solid #e2e8f0",
                            background: "white", color: "#64748b", fontFamily: "inherit",
                            fontWeight: 600, fontSize: "0.95rem", cursor: "pointer",
                        }}
                    >
                        إنشاء طلب جديد
                    </button>
                </div>
            )}
        </>
    );
}
