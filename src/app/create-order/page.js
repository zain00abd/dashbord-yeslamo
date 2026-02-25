"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SvgBackground from "../components/SvgBackground";

export default function CreateOrder() {
    const [userName, setUserName] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [address, setAddress] = useState("");
    const [orders, setOrders] = useState("");
    const [notes, setNotes] = useState("");
    const [itemsCount, setItemsCount] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const [orderNumber, setOrderNumber] = useState("");
    const [hasAccount, setHasAccount] = useState(false);

    // Load saved user data
    useEffect(() => {
        try {
            const userData = localStorage.getItem("yaslamo_user");
            if (userData) {
                const parsed = JSON.parse(userData);
                setUserName(parsed.name || "");
                setUserPhone(parsed.phone || "");
                setAddress(parsed.address || "");
                setHasAccount(true);
            }
        } catch (e) { }
    }, []);

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
                    if (!isNaN(parsed) && parsed > 0) {
                        itemName = name;
                        quantity = parsed;
                    }
                    break;
                }
            }

            return { name: itemName || "صنف غير مسمى", quantity };
        });
    }

    function submitOrder() {
        if (!userName.trim()) {
            alert("الرجاء إدخال اسمك");
            return;
        }
        if (!userPhone.trim()) {
            alert("الرجاء إدخال رقم الهاتف");
            return;
        }
        if (!address.trim()) {
            alert("الرجاء إدخال عنوان التوصيل");
            return;
        }
        if (!orders.trim()) {
            alert("الرجاء إدخال الطلبات المطلوبة");
            return;
        }

        const items = parseOrders(orders);
        if (items.length === 0) {
            alert("الرجاء إدخال صنف واحد على الأقل");
            return;
        }

        const num = Math.floor(Math.random() * 90000) + 10000;
        setOrderNumber(num.toString());
        setShowSuccess(true);
    }

    function sendWhatsApp() {
        const items = parseOrders(orders);
        let message = `🛒 *طلب جديد من يسلمو*\n\n`;
        message += `👤 *الاسم:* ${userName}\n`;
        message += `📱 *الهاتف:* ${userPhone}\n`;
        message += `📍 *العنوان:* ${address}\n\n`;
        message += `📋 *الطلبات:*\n`;
        items.forEach((item) => {
            message += `  • ${item.name} × ${item.quantity}\n`;
        });
        if (notes.trim()) {
            message += `\n📝 *ملاحظات:* ${notes}\n`;
        }
        message += `\n📞 رقم الطلب: #${orderNumber}`;

        const encoded = encodeURIComponent(message);
        window.open(`https://wa.me/?text=${encoded}`, "_blank");
    }

    function clearForm() {
        if (confirm("هل أنت متأكد من تفريغ جميع الحقول؟")) {
            setOrders("");
            setNotes("");
            if (!hasAccount) {
                setUserName("");
                setUserPhone("");
                setAddress("");
            }
        }
    }

    return (
        <>
            <SvgBackground />
            <div
                className="page-wrapper"
                style={{ paddingTop: "30px", paddingBottom: "30px" }}
            >
                {/* Header */}
                <div className="page-header">
                    <h1>يسلمو</h1>
                    <Link href="/" className="back-link">
                        ← الرجوع للرئيسية
                    </Link>
                </div>

                {/* Order Form Card */}
                <div className="card">
                    {/* Customer Info Section */}
                    <div className="form-group">
                        <div className="section-title">
                            <svg viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                            <span>معلومات الزبون</span>
                        </div>

                        {hasAccount && (
                            <div
                                style={{
                                    background: "#f0f9f0",
                                    border: "1px solid #c8e6c9",
                                    borderRadius: "15px",
                                    padding: "12px 18px",
                                    marginBottom: "15px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    flexWrap: "wrap",
                                }}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    width="20"
                                    height="20"
                                    fill="#4caf50"
                                >
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                </svg>
                                <span style={{ color: "#2e7d32", fontSize: "0.9rem", fontWeight: "600" }}>
                                    تم تعبئة البيانات من حسابك
                                </span>
                                <Link
                                    href="/register"
                                    style={{
                                        color: "#ff6b35",
                                        fontSize: "0.85rem",
                                        fontWeight: "600",
                                        marginRight: "auto",
                                    }}
                                >
                                    تعديل →
                                </Link>
                            </div>
                        )}

                        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="الاسم الكامل"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                style={{ flex: "1", minWidth: "180px" }}
                            />
                            <input
                                type="tel"
                                className="form-input"
                                placeholder="رقم الهاتف"
                                value={userPhone}
                                onChange={(e) => setUserPhone(e.target.value)}
                                dir="ltr"
                                style={{ flex: "1", minWidth: "180px", textAlign: "right" }}
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div className="form-group">
                        <div className="section-title">
                            <svg viewBox="0 0 24 24">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                            <span>عنوان التوصيل</span>
                        </div>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="أدخل عنوان التوصيل بالتفصيل (المنطقة، الشارع، رقم المبنى)"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>

                    {/* Orders */}
                    <div className="form-group">
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
                            placeholder={`مثال:\nبيتزا عائلية - 2\nمشروب غازي - 3\nبطاطس مقلية كبيرة - 1\nسلطة سيزر - 1\nخبز ثوم - 2`}
                            value={orders}
                            onChange={(e) => setOrders(e.target.value)}
                        />

                        <div className="form-hint">
                            <svg viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                            </svg>
                            <div>
                                <span>نصيحة:</span> اكتب كل طلب في سطر منفصل، واستخدم شرطة
                                (-) أو فاصلة (،) للفصل بين اسم الصنف والكمية
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="form-group">
                        <div className="section-title">
                            <svg viewBox="0 0 24 24">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                            </svg>
                            <span>ملاحظات إضافية</span>
                        </div>
                        <textarea
                            className="form-input"
                            style={{ minHeight: "80px", resize: "vertical" }}
                            placeholder="أي ملاحظات إضافية (اختياري) مثل: يرجى الاتصال قبل الوصول..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    {/* Quick Summary */}
                    <div className="quick-summary">
                        <span className="summary-text">عدد الأصناف المكتوبة</span>
                        <span className="items-badge">{getItemsCountText()}</span>
                    </div>

                    {/* Actions */}
                    <div className="actions-row">
                        <button className="btn btn-secondary" onClick={clearForm}>
                            <svg viewBox="0 0 24 24" fill="#ff6b35">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                            </svg>
                            تفريغ الحقول
                        </button>
                        <button className="btn btn-primary" onClick={submitOrder}>
                            <svg viewBox="0 0 24 24" fill="white">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                            </svg>
                            تأكيد الطلب
                        </button>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccess && (
                <div className="modal-overlay" onClick={() => setShowSuccess(false)}>
                    <div
                        className="modal-box"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-icon">
                            <svg viewBox="0 0 24 24">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                            </svg>
                        </div>
                        <div className="modal-title">تم تأكيد الطلب بنجاح! ✅</div>
                        <div className="modal-text">
                            شكراً {userName}، سيتم التواصل معك على الرقم {userPhone} لتأكيد التوصيل
                        </div>
                        <div className="modal-order-number">#{orderNumber}</div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                            }}
                        >
                            <button
                                className="btn btn-whatsapp"
                                onClick={sendWhatsApp}
                                style={{ minWidth: "auto" }}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    width="20"
                                    height="20"
                                    fill="white"
                                >
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                                إرسال عبر واتساب
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowSuccess(false)}
                                style={{ minWidth: "auto" }}
                            >
                                إغلاق
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
