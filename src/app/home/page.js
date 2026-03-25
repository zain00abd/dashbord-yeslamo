"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
    const [userName, setUserName] = useState("");
    const [loaded, setLoaded] = useState(false);
    const router = useRouter();

    useEffect(() => {
        try {
            const userData = localStorage.getItem("yaslamo_user");
            if (!userData) {
                router.replace("/login");
                return;
            }
            const parsed = JSON.parse(userData);
            setUserName(parsed.name || "");
        } catch (e) {
            router.replace("/login");
            return;
        }
        setLoaded(true);
    }, []);

    if (!loaded) return null;

    const quickActions = [
        {
            href: "/create-order",
            label: "طلب جديد",
            desc: "اطلب توصيل الآن",
            icon: "M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z",
        },
        {
            href: "/track-order",
            label: "طلباتي",
            desc: "تتبع طلباتك الحالية",
            icon: "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",
        },
        {
            href: "/account",
            label: "حسابي",
            desc: "إعدادات الحساب",
            icon: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
        },
    ];

    const features = [
        {
            label: "توصيل سريع",
            desc: "30 دقيقة متوسط التوصيل",
            icon: "M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z",
        },
        {
            label: "دفع عند الاستلام",
            desc: "لا حاجة للدفع مسبقاً",
            icon: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z",
        },
        {
            label: "تتبع مباشر",
            desc: "تعرف أين طلبك لحظياً",
            icon: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
        },
    ];

    function getGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return "صباح الخير";
        if (hour < 18) return "مساء الخير";
        return "مساء الخير";
    }

    return (
        <div className="page-wrapper">
            {/* Header */}
            <div className="home-header">
                <div className="home-header-content">
                    <div className="home-greeting">
                        <div className="home-greeting-icon">
                            <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                        </div>
                        <div>
                            <div className="home-greeting-text">{getGreeting()}</div>
                            <div className="home-greeting-name">{userName}</div>
                        </div>
                    </div>
                    <Link href="/" className="home-logo-link">
                        <Image src="/logo1.jpg" alt="يسلمو" width={42} height={42} className="home-logo-img" priority />
                    </Link>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="home-content">
                {/* CTA */}
                <div className="home-cta-wrapper">
                    <div className="home-cta-phrase">
                        <svg viewBox="0 0 24 24"><path d="M18 18.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zM19.5 9.5L21 12h-5V6.5h2.67L19.5 9.5zM6 18.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zM20 8l3 4v5h-2c0 1.66-1.34 3-3 3s-3-1.34-3-3H9c0 1.66-1.34 3-3 3s-3-1.34-3-3H1V6c0-1.11.89-2 2-2h14v4h3zM3 12h5V6H3v6z" /></svg>
                        جاهز تطلب؟ نوصلك لباب بيتك!
                    </div>
                    <Link href="/create-order" className="home-cta-btn">
                        <svg viewBox="0 0 24 24"><path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z" /></svg>
                        اطلب الآن
                    </Link>
                </div>

                <div className="home-section-label" style={{ marginTop: "24px" }}>
                    <svg viewBox="0 0 24 24"><path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" /></svg>
                    إجراءات سريعة
                </div>
                <div className="home-actions-grid">
                    {quickActions.map((action, i) => (
                        <Link href={action.href} key={i} className="home-action-card" style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className="home-action-icon">
                                <svg viewBox="0 0 24 24"><path d={action.icon} /></svg>
                            </div>
                            <div className="home-action-label">{action.label}</div>
                            <div className="home-action-desc">{action.desc}</div>
                        </Link>
                    ))}
                </div>

                {/* Features */}
                <div className="home-section-label" style={{ marginTop: "28px" }}>
                    <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                    لماذا يسلمو؟
                </div>
                <div className="home-features-list">
                    {features.map((f, i) => (
                        <div key={i} className="home-feature-row" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                            <div className="home-feature-icon">
                                <svg viewBox="0 0 24 24"><path d={f.icon} /></svg>
                            </div>
                            <div className="home-feature-info">
                                <div className="home-feature-label">{f.label}</div>
                                <div className="home-feature-desc">{f.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
