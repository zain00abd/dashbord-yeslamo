"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

/** أيقونات خطّية بلون موحّد (currentColor) */
function IconStroke({ children, className = "" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            width="1em"
            height="1em"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
        >
            {children}
        </svg>
    );
}

const STATUS_LABEL = {
    pending: "قيد الانتظار",
    accepted: "تم قبول الطلب",
    on_the_way: "في الطريق",
    delivered: "تم التوصيل",
    cancelled: "ملغى",
};

/** بيانات موقع التوصيل من الحساب */
function parseDeliveryLocation(parsed) {
    const city = typeof parsed.city === "string" ? parsed.city.trim() : "";
    const detail = typeof parsed.locationDesc === "string" ? parsed.locationDesc.trim() : "";
    const fallback = typeof parsed.address === "string" ? parsed.address.trim() : "";
    const line2 = detail || fallback;
    if (!city && !line2) return null;
    return { city, detail: line2 };
}

function formatLocationLine(loc) {
    if (!loc) return "";
    if (loc.city && loc.detail && loc.detail !== loc.city) return `${loc.city} · ${loc.detail}`;
    return loc.city || loc.detail || "";
}

function formatRecentWhen(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / 864e5);
    if (diffDays < 0) return d.toLocaleDateString("ar-EG", { day: "numeric", month: "short" });
    if (diffDays === 0) return "اليوم";
    if (diffDays === 1) return "أمس";
    if (diffDays < 7) return `منذ ${diffDays} أيام`;
    return d.toLocaleDateString("ar-EG", { day: "numeric", month: "short", year: "numeric" });
}

export default function HomePage() {
    const [userName, setUserName] = useState("");
    const [userUid, setUserUid] = useState("");
    const [deliveryLocation, setDeliveryLocation] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [lastOrder, setLastOrder] = useState(null);
    const router = useRouter();

    useEffect(() => {
        try {
            const userData = localStorage.getItem("yaslamo_user");
            if (!userData) {
                router.replace("/login");
                return;
            }
            const parsed = JSON.parse(userData);
            if (parsed === null || typeof parsed !== "object") {
                router.replace("/login");
                return;
            }
            const name =
                typeof parsed.name === "string"
                    ? parsed.name
                    : parsed.name != null
                      ? String(parsed.name)
                      : "";
            const uid = typeof parsed.id === "string" ? parsed.id : "";
            const loc = parseDeliveryLocation(parsed);
            queueMicrotask(() => {
                setUserName(name);
                setUserUid(uid);
                setDeliveryLocation(loc);
                setLoaded(true);
            });
        } catch (e) {
            router.replace("/login");
        }
    }, [router]);

    useEffect(() => {
        if (!loaded || !userUid) return;
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(`/api/orders/recent?uid=${encodeURIComponent(userUid)}`);
                const data = await res.json();
                if (!cancelled && data.order) setLastOrder(data.order);
            } catch {
                /* ignore */
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [loaded, userUid]);

    if (!loaded) return null;

    function getGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return "صباح الخير";
        if (hour < 18) return "مساء الخير";
        return "مساء الخير";
    }

    return (
        <div className="page-wrapper home-page home-v2">
            <header className="home-v2-topbar">
                <div className="home-v2-topbar-row">
                    <div className="home-v2-user">
                        <div className="home-v2-avatar">
                            <IconStroke className="home-v2-avatar-svg">
                                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </IconStroke>
                        </div>
                        <div className="home-v2-user-text">
                            <span className="home-v2-greet">{getGreeting()}</span>
                            <span className="home-v2-name">{userName}</span>
                        </div>
                    </div>
                    <Link href="/" className="home-v2-brand">
                        <Image src="/logo1.jpg" alt="يسلمو" width={48} height={48} className="home-v2-logo" priority />
                    </Link>
                </div>
                {deliveryLocation ? (
                    <div className="home-v2-location" role="region" aria-label="موقع التوصيل">
                        <IconStroke className="home-v2-location-icon">
                            <path d="M12 22s7-4.5 7-10a7 7 0 10-14 0c0 5.5 7 10 7 10z" />
                            <path d="M12 13a3 3 0 100-6 3 3 0 000 6z" />
                        </IconStroke>
                        <span className="home-v2-location-text" title={formatLocationLine(deliveryLocation)}>
                            {formatLocationLine(deliveryLocation)}
                        </span>
                    </div>
                ) : null}
            </header>

            <main className="home-v2-main">
                <div className="home-v2-shell">
                    <section className="home-v2-hero" aria-labelledby="home-v2-title">
                        <div className="home-v2-hero-inner">
                            <p className="home-v2-eyebrow">توصيل من البقالة</p>
                            <h1 id="home-v2-title" className="home-v2-title">
                                طلبك يبدأ من هنا
                            </h1>
                            <Link href="/create-order" className="home-v2-cta">
                                <span className="home-v2-cta-inner">
                                    <IconStroke className="home-v2-cta-icon">
                                        <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </IconStroke>
                                    ابدأ الطلب
                                </span>
                                <IconStroke className="home-v2-cta-chevron">
                                    <path d="M15 18l-6-6 6-6" />
                                </IconStroke>
                            </Link>
                        </div>
                    </section>

                    {lastOrder ? (
                        <Link
                            href="/track-order"
                            className={`home-v2-last${lastOrder.status === "delivered" ? " home-v2-last--delivered" : ""}`}
                        >
                            <div className="home-v2-last-media">
                                {lastOrder.status === "delivered" ? (
                                    <IconStroke className="home-v2-last-ico">
                                        <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </IconStroke>
                                ) : (
                                    <IconStroke className="home-v2-last-ico">
                                        <path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                    </IconStroke>
                                )}
                            </div>
                            <div className="home-v2-last-body">
                                <div className="home-v2-last-top">
                                    <span className="home-v2-last-label">آخر طلب</span>
                                    <span className="home-v2-last-num">#{lastOrder.orderNumber}</span>
                                </div>
                                <div className="home-v2-last-meta">
                                    <span className="home-v2-last-pill">{STATUS_LABEL[lastOrder.status] || lastOrder.status}</span>
                                    <span className="home-v2-last-when">{formatRecentWhen(lastOrder.createdAt)}</span>
                                </div>
                                {lastOrder.itemsPreview ? (
                                    <p className="home-v2-last-preview">{lastOrder.itemsPreview}</p>
                                ) : lastOrder.itemsCount > 0 ? (
                                    <p className="home-v2-last-preview">{lastOrder.itemsCount} أصناف</p>
                                ) : null}
                            </div>
                            <IconStroke className="home-v2-last-arrow">
                                <path d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </IconStroke>
                        </Link>
                    ) : null}

                    <p className="home-v2-foot">
                        <IconStroke className="home-v2-foot-icon">
                            <path d="M12 16v-4m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </IconStroke>
                        يمكنك متابعة الطلبات من «طلباتي» في الشريط السفلي.
                    </p>
                </div>
            </main>
        </div>
    );
}
