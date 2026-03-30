"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function BottomNav() {
    const pathname = usePathname();
    const [user, setUser] = useState(null);

    function readStoredUser() {
        try {
            const stored = localStorage.getItem("yaslamo_user");
            setUser(stored ? JSON.parse(stored) : null);
        } catch (e) {
            setUser(null);
        }
    }

    useEffect(() => {
        readStoredUser();

        const onStorage = () => {
            try {
                const stored = localStorage.getItem("yaslamo_user");
                setUser(stored ? JSON.parse(stored) : null);
            } catch (e) {}
        };
        window.addEventListener("storage", onStorage);
        window.addEventListener("yaslamo_auth", onStorage);
        return () => {
            window.removeEventListener("storage", onStorage);
            window.removeEventListener("yaslamo_auth", onStorage);
        };
    }, []);

    // المهم: "storage" لا ينشغّل داخل نفس التبويب غالباً.
    // عند تسجيل الدخول عادةً يتم تغيير الـ pathname، فنُعيد قراءة localStorage لتحديث الـ navbar فوراً.
    useEffect(() => {
        readStoredUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    const hiddenRoutes = ["/driver", "/login", "/register", "/terms", "/privacy"];
    if (!user || hiddenRoutes.some((r) => pathname.startsWith(r))) return null;

    const tabs = [
        {
            href: "/home",
            label: "الرئيسية",
            icon: <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>,
        },
        {
            href: "/track-order",
            label: "طلباتي",
            icon: <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>,
        },
        {
            href: "/create-order",
            label: "طلب جديد",
            icon: <svg viewBox="0 0 24 24"><path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z" /></svg>,
        },
        {
            href: "/account",
            label: "حسابي",
            icon: <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>,
        },
    ];

    return (
        <nav className="bottom-nav">
            {tabs.map((tab) => {
                const isActive = pathname.startsWith(tab.href);
                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className="bottom-nav-item"
                        style={{
                            color: isActive ? "var(--primary)" : "#bbb",
                            transition: "color 0.2s ease",
                        }}
                    >
                        <span style={{
                            display: "flex", alignItems: "center", justifyContent: "center",
                            width: 40, height: 40, borderRadius: "50%",
                            background: isActive ? "rgba(255,107,53,0.1)" : "transparent",
                            transition: "background 0.2s ease",
                        }}>
                            {tab.icon}
                        </span>
                        {tab.label}
                    </Link>
                );
            })}
        </nav>
    );
}
