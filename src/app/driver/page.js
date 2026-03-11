"use client";

import { useState, useEffect, useCallback } from "react";
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    runTransaction,
    doc,
    serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import SwipeToAccept from "./SwipeToAccept";
import "./driver.css";

// ─── Config ───────────────────────────────────────────────────────────────
// Driver's area. In a real app this comes from the driver's Firestore profile.
const DRIVER_AREA_ID = "default";

// ─── Order Details Modal ──────────────────────────────────────────────────
function OrderModal({ order, onClose, onAccept, isAccepting }) {
    if (!order) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title">تفاصيل الطلب {order.orderNumber}</div>
                    <button className="close-btn" onClick={onClose}>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="var(--driver-text-muted)">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    </button>
                </div>

                <div className="detail-row">
                    <div className="detail-label">العميل</div>
                    <div className="detail-value">{order.customerName}</div>
                </div>

                <div className="detail-row">
                    <div className="detail-label">رقم الهاتف</div>
                    <div className="detail-value" dir="ltr" style={{ textAlign: "right", color: "var(--driver-primary)" }}>
                        <a href={`tel:${order.customerPhone}`} style={{ color: "inherit", textDecoration: "none" }}>
                            {order.customerPhone} 📞
                        </a>
                    </div>
                </div>

                <div className="detail-row">
                    <div className="detail-label">عنوان التوصيل</div>
                    <div className="detail-value">{order.customerAddress}</div>
                </div>

                {/* Location: GPS map link + description */}
                {(order.locationCoords || order.locationDesc) && (
                    <div style={{ background: "#f0fdf4", borderRadius: "12px", padding: "14px", marginTop: "4px", marginBottom: "4px" }}>
                        <div style={{ color: "#065f46", fontWeight: 700, fontSize: "0.85rem", marginBottom: "10px" }}>
                            📍 موقع التوصيل
                        </div>
                        {order.locationCoords && (
                            <a
                                href={`https://www.google.com/maps?q=${order.locationCoords.lat},${order.locationCoords.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px",
                                    background: "#10b981", color: "white", borderRadius: "10px",
                                    textDecoration: "none", fontWeight: 700, fontSize: "0.95rem",
                                    marginBottom: order.locationDesc ? "10px" : "0",
                                }}
                            >
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                </svg>
                                فتح الموقع في الخرائط
                            </a>
                        )}
                        {order.locationDesc && (
                            <div style={{ fontSize: "0.92rem", color: "#065f46", lineHeight: "1.6" }}>
                                {order.locationDesc}
                            </div>
                        )}
                    </div>
                )}

                <div className="detail-row" style={{ marginTop: "24px" }}>
                    <div className="detail-label" style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>الطلبات</span>
                        <span style={{ background: "var(--driver-primary)", color: "white", padding: "2px 8px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: "bold" }}>
                            {order.items?.length || 0} أصناف
                        </span>
                    </div>
                    <div className="items-list">
                        {order.items?.map((item, idx) => (
                            <div key={idx} className="item-row">
                                <span style={{ fontWeight: 600 }}>{item.name}</span>
                                <span style={{ color: "var(--driver-text-muted)" }}>× {item.quantity}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {order.notes && (
                    <div className="detail-row" style={{ marginTop: "20px" }}>
                        <div className="detail-label">ملاحظات العميل</div>
                        <div style={{ background: "#fef3c7", padding: "12px", borderRadius: "8px", fontSize: "0.95rem", color: "#92400e" }}>
                            {order.notes}
                        </div>
                    </div>
                )}

                <div style={{ marginTop: "32px" }}>
                    <SwipeToAccept isLoading={isAccepting} onAccept={() => onAccept(order.id)} />
                </div>
            </div>
        </div>
    );
}

// ─── Driver Login Screen ──────────────────────────────────────────────────
function DriverLogin({ onLogin }) {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!phone || !password) { setError("أدخل رقم الهاتف وكلمة السر"); return; }

        setLoading(true);
        setError("");

        try {
            // Derive the pseudo-email used during registration
            const email = `${phone.trim().replace(/\s/g, "")}@yaslamo.app`;
            const cred = await signInWithEmailAndPassword(auth, email, password);
            onLogin(cred.user);
        } catch (err) {
            console.error(err);
            setError("رقم الهاتف أو كلمة السر غير صحيحة");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="driver-layout" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "24px" }}>
            <svg viewBox="0 0 24 24" width="56" height="56" fill="var(--driver-primary)" style={{ marginBottom: "16px" }}>
                <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4z" />
            </svg>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "8px", color: "var(--driver-text)" }}>بوابة المندوبين</h1>
            <p style={{ color: "var(--driver-text-muted)", marginBottom: "32px", fontSize: "0.95rem" }}>يسلمو للتوصيل</p>

            <form onSubmit={handleLogin} style={{ width: "100%", maxWidth: "360px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <input
                    type="tel"
                    placeholder="رقم الهاتف"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    dir="ltr"
                    style={{ padding: "14px 16px", borderRadius: "12px", border: "1.5px solid var(--driver-border)", fontFamily: "inherit", fontSize: "1rem", outline: "none", textAlign: "right" }}
                />
                <input
                    type="password"
                    placeholder="كلمة السر"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ padding: "14px 16px", borderRadius: "12px", border: "1.5px solid var(--driver-border)", fontFamily: "inherit", fontSize: "1rem", outline: "none" }}
                />
                {error && (
                    <div style={{ color: "#c62828", background: "#fff0f0", borderRadius: "8px", padding: "10px 14px", fontSize: "0.9rem" }}>{error}</div>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    style={{ padding: "14px", background: "var(--driver-primary)", color: "white", border: "none", borderRadius: "12px", fontFamily: "inherit", fontWeight: 700, fontSize: "1rem", cursor: "pointer", opacity: loading ? 0.7 : 1 }}
                >
                    {loading ? "جاري الدخول..." : "دخول"}
                </button>
            </form>
        </div>
    );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────
export default function DriverDashboard() {
    const [user, setUser] = useState(null);          // Firebase Auth user
    const [authChecked, setAuthChecked] = useState(false);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isAccepting, setIsAccepting] = useState(false);

    // Restore auth state on page load
    useEffect(() => {
        document.body.classList.add("driver-app");
        const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
            setUser(firebaseUser);
            setAuthChecked(true);
        });
        return () => {
            document.body.classList.remove("driver-app");
            unsubscribe();
        };
    }, []);

    // Real-time listener: only fires when user is logged in
    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "orders"),
            where("status", "==", "pending"),
            where("areaId", "==", DRIVER_AREA_ID),
            orderBy("createdAt", "desc")
        );

        // onSnapshot — auto-updates the UI whenever Firestore changes
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const liveOrders = snapshot.docs.map((docSnap) => {
                const data = docSnap.data();
                return {
                    id: docSnap.id,
                    ...data,
                    createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
                };
            });
            setOrders(liveOrders);
        }, (error) => {
            console.error("onSnapshot error:", error);
        });

        return () => unsubscribe();
    }, [user]);

    // Accept order via Firestore Transaction (prevents race conditions)
    const handleAcceptOrder = useCallback(async (orderId) => {
        if (!user) return;
        setIsAccepting(true);

        try {
            const orderRef = doc(db, "orders", orderId);

            await runTransaction(db, async (transaction) => {
                const orderDoc = await transaction.get(orderRef);

                if (!orderDoc.exists()) throw new Error("الطلب غير موجود");
                if (orderDoc.data().status !== "pending") {
                    throw new Error("عذراً، قام مندوب آخر بقبول هذا الطلب");
                }

                transaction.update(orderRef, {
                    status: "accepted",
                    driverId: user.uid,
                    updatedAt: serverTimestamp(),
                });
            });

            setSelectedOrder(null);
            // The onSnapshot listener will automatically remove the order from the list
        } catch (err) {
            console.error("Accept order error:", err);
            alert(err.message || "حدث خطأ في قبول الطلب");
        } finally {
            setIsAccepting(false);
        }
    }, [user]);

    // ── Render ────────────────────────────────────────────────────────────
    if (!authChecked) {
        return (
            <div className="driver-layout" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
                <div style={{ color: "var(--driver-text-muted)" }}>...</div>
            </div>
        );
    }

    if (!user) {
        return <DriverLogin onLogin={setUser} />;
    }

    return (
        <div className="driver-layout">
            <header className="driver-header">
                <div className="driver-title">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
                        <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                    </svg>
                    بوابة المندوبين
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div className="driver-status-badge">متصل 🟢</div>
                    <button
                        onClick={() => auth.signOut().then(() => setUser(null))}
                        style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "white", padding: "4px 10px", borderRadius: "16px", cursor: "pointer", fontFamily: "inherit", fontSize: "0.8rem" }}
                    >
                        خروج
                    </button>
                </div>
            </header>

            <main className="driver-content">
                <div className="section-heading">
                    الطلبات المتاحة ({orders.length})
                    <span style={{ fontSize: "0.75rem", color: "var(--driver-primary)", marginRight: "8px", fontWeight: 600 }}>● مباشر</span>
                </div>

                {orders.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: "16px", border: "1px dashed #cbd5e1" }}>
                        <svg viewBox="0 0 24 24" width="48" height="48" fill="#e2e8f0" style={{ marginBottom: "16px" }}>
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v-6H11v6zm0-8h2V7h-2v2z" />
                        </svg>
                        <div style={{ fontWeight: 600, color: "#64748b", fontSize: "1.1rem" }}>لا توجد طلبات جديدة حالياً</div>
                        <div style={{ fontSize: "0.9rem", color: "#94a3b8", marginTop: "8px" }}>ستظهر الطلبات الجديدة هنا تلقائياً</div>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order.id} className="order-card">
                            <div className="order-card-header">
                                <span className="order-time">
                                    {order.createdAt
                                        ? new Date(order.createdAt).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })
                                        : ""}
                                </span>
                                <span className="order-id">{order.orderNumber}</span>
                            </div>

                            <div className="order-customer">
                                <div className="customer-name">{order.customerName}</div>
                                <div className="customer-address">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="var(--driver-primary)" style={{ flexShrink: 0, marginTop: "2px" }}>
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                    </svg>
                                    {order.customerAddress}
                                </div>
                            </div>

                            <button className="order-details-btn" onClick={() => setSelectedOrder(order)}>
                                عرض التفاصيل وقبول الطلب
                            </button>
                        </div>
                    ))
                )}
            </main>

            <OrderModal
                order={selectedOrder}
                onClose={() => !isAccepting && setSelectedOrder(null)}
                onAccept={handleAcceptOrder}
                isAccepting={isAccepting}
            />
        </div>
    );
}
