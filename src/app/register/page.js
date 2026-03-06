"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Register() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [address, setAddress] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [userId, setUserId] = useState("");

    useEffect(() => {
        try {
            const userData = localStorage.getItem("yaslamo_user");
            if (userData) {
                const parsed = JSON.parse(userData);
                setName(parsed.name || "");
                setPhone(parsed.phone || "");
                setAddress(parsed.address || "");
                setUserId(parsed.id || "");
                setIsEditing(true);
            }
        } catch (e) { }
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!name.trim()) { setError("الرجاء إدخال الاسم"); return; }
        if (!phone.trim()) { setError("الرجاء إدخال رقم الهاتف"); return; }
        if (!address.trim()) { setError("الرجاء إدخال العنوان"); return; }

        if (!isEditing) {
            if (!password) { setError("الرجاء إدخال كلمة السر"); return; }
            if (password.length < 6) { setError("كلمة السر يجب أن تكون 6 أحرف على الأقل"); return; }
            if (password !== confirmPassword) { setError("كلمة السر غير متطابقة"); return; }
        }

        setLoading(true);

        try {
            if (isEditing) {
                // Update existing account
                const res = await fetch("/api/auth/update", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id: userId,
                        name: name.trim(),
                        phone: phone.trim(),
                        address: address.trim(),
                    }),
                });
                const data = await res.json();
                if (!res.ok) { setError(data.error || "حدث خطأ"); setLoading(false); return; }
                localStorage.setItem("yaslamo_user", JSON.stringify(data.user));
            } else {
                // Create new account
                const res = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: name.trim(),
                        phone: phone.trim(),
                        password,
                        address: address.trim(),
                    }),
                });
                const data = await res.json();
                if (!res.ok) { setError(data.error || "حدث خطأ"); setLoading(false); return; }
                localStorage.setItem("yaslamo_user", JSON.stringify(data.user));
            }

            router.push("/");
        } catch (err) {
            setError("حدث خطأ في الاتصال بالخادم");
            setLoading(false);
        }
    }

    return (
        <div className="page-wrapper">
            <div className="top-bar">
                <Link href="/" className="top-bar-logo">
                    <Image src="/logo1.jpg" alt="يسلمو" width={36} height={36} />
                    <span>{isEditing ? "تعديل الحساب" : "إنشاء حساب"}</span>
                </Link>
                <Link href="/" className="top-bar-back">← الرئيسية</Link>
            </div>

            <div className="content-area" style={{ paddingTop: "20px", paddingBottom: "30px" }}>
                {error && (
                    <div style={{
                        background: "#fff0f0", border: "1px solid #ffcdd2", borderRadius: "12px",
                        padding: "12px 16px", marginBottom: "20px", color: "#c62828", fontSize: "0.9rem",
                        display: "flex", alignItems: "center", gap: "8px",
                    }}>
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="#c62828">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                        </svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="form-section">
                        <div className="section-title">
                            <svg viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                            <span>الاسم الكامل</span>
                        </div>
                        <input type="text" className="form-input" placeholder="أدخل اسمك الكامل"
                            value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                    </div>

                    {/* Phone */}
                    <div className="form-section">
                        <div className="section-title">
                            <svg viewBox="0 0 24 24">
                                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                            </svg>
                            <span>رقم الهاتف</span>
                        </div>
                        <input type="tel" className="form-input" placeholder="مثال: 0912345678"
                            value={phone} onChange={(e) => setPhone(e.target.value)}
                            dir="ltr" style={{ textAlign: "right" }} autoComplete="tel"
                            disabled={isEditing} />
                        {isEditing && (
                            <p style={{ color: "#999", fontSize: "0.8rem", marginTop: "6px" }}>
                                لا يمكن تغيير رقم الهاتف
                            </p>
                        )}
                    </div>

                    {/* Password (only for new registration) */}
                    {!isEditing && (
                        <>
                            <div className="form-section">
                                <div className="section-title">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z" />
                                    </svg>
                                    <span>كلمة السر</span>
                                </div>
                                <input type="password" className="form-input" placeholder="كلمة السر (6 أحرف على الأقل)"
                                    value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
                            </div>

                            <div className="form-section">
                                <div className="section-title">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z" />
                                    </svg>
                                    <span>تأكيد كلمة السر</span>
                                </div>
                                <input type="password" className="form-input" placeholder="أعد كتابة كلمة السر"
                                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" />
                            </div>
                        </>
                    )}

                    {/* Address */}
                    <div className="form-section">
                        <div className="section-title">
                            <svg viewBox="0 0 24 24">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                            <span>عنوان التوصيل</span>
                        </div>
                        <input type="text" className="form-input" placeholder="المنطقة، الشارع، رقم المبنى"
                            value={address} onChange={(e) => setAddress(e.target.value)} autoComplete="street-address" />
                    </div>

                    <div style={{ paddingTop: "20px" }}>
                        <button type="submit" className="btn btn-primary"
                            style={{ width: "100%", opacity: loading ? 0.7 : 1 }} disabled={loading}>
                            {loading ? "جاري الحفظ..." : (
                                <>
                                    <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                    </svg>
                                    {isEditing ? "حفظ التعديلات" : "إنشاء حساب"}
                                </>
                            )}
                        </button>
                    </div>

                    {!isEditing && (
                        <div style={{ textAlign: "center", marginTop: "20px" }}>
                            <span style={{ color: "#777", fontSize: "0.9rem" }}>لديك حساب بالفعل؟ </span>
                            <Link href="/login" style={{ color: "#ff6b35", fontWeight: "600", fontSize: "0.9rem" }}>
                                تسجيل الدخول
                            </Link>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
