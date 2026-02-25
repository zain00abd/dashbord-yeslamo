"use client";

import { useState } from "react";
import Link from "next/link";
import SvgBackground from "../components/SvgBackground";

const DEMO_ORDERS = {
    "12345": {
        status: 2,
        address: "الرياض - حي النرجس - شارع ابن سينا",
        items: ["بيتزا عائلية × 2", "مشروب غازي × 3", "بطاطس مقلية × 1"],
        time: "منذ 25 دقيقة",
    },
    "67890": {
        status: 3,
        address: "جدة - حي الحمراء - شارع فلسطين",
        items: ["شاورما × 4", "عصير برتقال × 2"],
        time: "منذ 45 دقيقة",
    },
};

const STEPS = [
    {
        title: "تم استلام الطلب",
        desc: "تم استلام طلبك بنجاح وجاري مراجعته",
        icon: (
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
        ),
    },
    {
        title: "جاري التحضير",
        desc: "يتم تحضير طلبك الآن",
        icon: (
            <path d="M8.1 13.34l2.83-2.83L3.91 3.5a4.008 4.008 0 000 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" />
        ),
    },
    {
        title: "في الطريق إليك",
        desc: "المندوب في طريقه إلى عنوانك",
        icon: (
            <path d="M18 18.5C18 19.6 17.1 20.5 16 20.5C14.9 20.5 14 19.6 14 18.5C14 17.4 14.9 16.5 16 16.5C17.1 16.5 18 17.4 18 18.5ZM6 18.5C6 19.6 5.1 20.5 4 20.5C2.9 20.5 2 19.6 2 18.5C2 17.4 2.9 16.5 4 16.5C5.1 16.5 6 17.4 6 18.5Z" />
        ),
    },
    {
        title: "تم التوصيل",
        desc: "تم توصيل طلبك بنجاح! شكراً لاستخدامك يسلمو",
        icon: (
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        ),
    },
];

export default function TrackOrder() {
    const [orderNum, setOrderNum] = useState("");
    const [result, setResult] = useState(null);
    const [notFound, setNotFound] = useState(false);

    function handleTrack() {
        if (!orderNum.trim()) {
            alert("الرجاء إدخال رقم الطلب");
            return;
        }

        const order = DEMO_ORDERS[orderNum.trim()];
        if (order) {
            setResult(order);
            setNotFound(false);
        } else {
            setResult(null);
            setNotFound(true);
        }
    }

    return (
        <>
            <SvgBackground />
            <div className="page-wrapper" style={{ paddingTop: "30px", paddingBottom: "30px" }}>
                <div className="page-header">
                    <h1>تتبع الطلب</h1>
                    <Link href="/" className="back-link">
                        ← الرجوع للرئيسية
                    </Link>
                </div>

                <div className="card">
                    {/* Search */}
                    <div className="form-group">
                        <div className="section-title">
                            <svg viewBox="0 0 24 24">
                                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                            </svg>
                            <span>أدخل رقم الطلب</span>
                        </div>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="مثال: 12345"
                                value={orderNum}
                                onChange={(e) => setOrderNum(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                                style={{ flex: 1 }}
                            />
                            <button
                                className="btn btn-primary"
                                onClick={handleTrack}
                                style={{ minWidth: "auto", padding: "12px 25px" }}
                            >
                                <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
                                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                                </svg>
                                بحث
                            </button>
                        </div>
                        <div className="form-hint" style={{ marginTop: "12px" }}>
                            <svg viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                            </svg>
                            <div>
                                <span>للتجربة:</span> استخدم الرقم 12345 أو 67890
                            </div>
                        </div>
                    </div>

                    {/* Not Found */}
                    {notFound && (
                        <div
                            style={{
                                textAlign: "center",
                                padding: "30px 20px",
                                color: "#999",
                                animation: "slideUp 0.3s ease",
                            }}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                width="60"
                                height="60"
                                fill="#ddd"
                                style={{ marginBottom: "15px" }}
                            >
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                            </svg>
                            <div style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "5px" }}>
                                لم يتم العثور على الطلب
                            </div>
                            <div style={{ fontSize: "0.9rem" }}>
                                تأكد من رقم الطلب وأعد المحاولة
                            </div>
                        </div>
                    )}

                    {/* Result */}
                    {result && (
                        <div style={{ animation: "slideUp 0.4s ease" }}>
                            {/* Order Info */}
                            <div className="quick-summary" style={{ marginTop: "10px" }}>
                                <div>
                                    <div style={{ fontWeight: "700", color: "#333", marginBottom: "4px" }}>
                                        طلب #{orderNum}
                                    </div>
                                    <div style={{ fontSize: "0.85rem", color: "#999" }}>{result.time}</div>
                                </div>
                                <span className="items-badge">
                                    {result.status === 3 ? "✅ تم التوصيل" : "🚚 جاري التوصيل"}
                                </span>
                            </div>

                            {/* Address */}
                            <div
                                style={{
                                    background: "#f8f8f8",
                                    padding: "12px 18px",
                                    borderRadius: "15px",
                                    marginBottom: "20px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                }}
                            >
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="#ff6b35">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                </svg>
                                <span style={{ color: "#555" }}>{result.address}</span>
                            </div>

                            {/* Items */}
                            <div style={{ marginBottom: "20px" }}>
                                <div className="form-label">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 7h10v2H7V7zm0 4h10v2H7v-2z" />
                                    </svg>
                                    الطلبات:
                                </div>
                                {result.items.map((item, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            padding: "8px 15px",
                                            background: i % 2 === 0 ? "#fafafa" : "white",
                                            borderRadius: "10px",
                                            marginBottom: "5px",
                                            color: "#555",
                                        }}
                                    >
                                        • {item}
                                    </div>
                                ))}
                            </div>

                            {/* Tracking Steps */}
                            <div className="section-title">
                                <svg viewBox="0 0 24 24">
                                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                </svg>
                                <span>حالة الطلب</span>
                            </div>
                            <div className="tracking-steps">
                                {STEPS.map((step, i) => {
                                    const isCompleted = i < result.status;
                                    const isActive = i === result.status;
                                    const isLast = i === STEPS.length - 1;

                                    return (
                                        <div
                                            key={i}
                                            className={`track-step ${isCompleted ? "completed" : ""} ${isActive ? "active" : ""}`}
                                        >
                                            <div className="step-indicator">
                                                <div className="step-circle">
                                                    <svg viewBox="0 0 24 24">{step.icon}</svg>
                                                </div>
                                                {!isLast && <div className="step-line" />}
                                            </div>
                                            <div className="step-content">
                                                <div className="step-title">{step.title}</div>
                                                <div className="step-desc">{step.desc}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
