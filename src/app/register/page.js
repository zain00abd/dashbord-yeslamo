"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SvgBackground from "../components/SvgBackground";

export default function Register() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        try {
            const userData = localStorage.getItem("yaslamo_user");
            if (userData) {
                const parsed = JSON.parse(userData);
                setName(parsed.name || "");
                setPhone(parsed.phone || "");
                setAddress(parsed.address || "");
                setIsEditing(true);
            }
        } catch (e) { }
    }, []);

    function handleSubmit(e) {
        e.preventDefault();

        if (!name.trim()) {
            alert("الرجاء إدخال الاسم الكامل");
            return;
        }
        if (!phone.trim()) {
            alert("الرجاء إدخال رقم الهاتف");
            return;
        }
        if (!address.trim()) {
            alert("الرجاء إدخال العنوان");
            return;
        }

        const userData = {
            name: name.trim(),
            phone: phone.trim(),
            address: address.trim(),
            createdAt: new Date().toISOString(),
        };

        localStorage.setItem("yaslamo_user", JSON.stringify(userData));
        setSaved(true);

        setTimeout(() => {
            router.push("/");
        }, 1500);
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
                    <Image
                        src="/logo1.jpg"
                        alt="يسلمو"
                        width={100}
                        height={100}
                        className="logo-image"
                        style={{ width: "80px", height: "80px", margin: "0 auto 10px" }}
                        priority
                    />
                    <h1 style={{ fontSize: "clamp(1.8rem, 8vw, 2.5rem)" }}>
                        {isEditing ? "تعديل الحساب" : "إنشاء حساب"}
                    </h1>
                    <Link href="/" className="back-link">
                        ← الرجوع للرئيسية
                    </Link>
                </div>

                {/* Registration Card */}
                <div className="card">
                    {saved ? (
                        <div style={{ textAlign: "center", padding: "40px 20px" }}>
                            <div className="modal-icon" style={{ margin: "0 auto 20px" }}>
                                <svg viewBox="0 0 24 24">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                </svg>
                            </div>
                            <div
                                style={{
                                    fontSize: "1.5rem",
                                    fontWeight: "700",
                                    color: "#333",
                                    marginBottom: "10px",
                                }}
                            >
                                {isEditing ? "تم تحديث الحساب بنجاح! ✅" : "تم إنشاء الحساب بنجاح! ✅"}
                            </div>
                            <div style={{ color: "#666", marginBottom: "10px" }}>
                                مرحباً {name}، جاري تحويلك...
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            {/* Name */}
                            <div className="form-group">
                                <div className="section-title">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                    </svg>
                                    <span>الاسم الكامل</span>
                                </div>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="أدخل اسمك الكامل"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoComplete="name"
                                />
                            </div>

                            {/* Phone */}
                            <div className="form-group">
                                <div className="section-title">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                                    </svg>
                                    <span>رقم الهاتف</span>
                                </div>
                                <input
                                    type="tel"
                                    className="form-input"
                                    placeholder="مثال: 0912345678"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    autoComplete="tel"
                                    dir="ltr"
                                    style={{ textAlign: "right" }}
                                />
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
                                    placeholder="أدخل عنوانك بالتفصيل (المنطقة، الشارع، رقم المبنى)"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    autoComplete="street-address"
                                />
                            </div>

                            {/* Submit */}
                            <div className="actions-row" style={{ marginTop: "30px" }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: "1" }}>
                                    <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                    </svg>
                                    {isEditing ? "حفظ التعديلات" : "إنشاء حساب"}
                                </button>
                            </div>

                            <div className="form-hint" style={{ marginTop: "15px" }}>
                                <svg viewBox="0 0 24 24">
                                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                                </svg>
                                <div>
                                    <span>ملاحظة:</span> بياناتك محفوظة بشكل آمن على جهازك فقط ولن يتم مشاركتها مع أي طرف ثالث
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
}
