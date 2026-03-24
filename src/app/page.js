"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Footer from "./components/Footer";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const userData = localStorage.getItem("yaslamo_user");
      if (userData) {
        router.replace("/create-order");
        return;
      }
    } catch (e) {}
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  return (
    <div className="page-wrapper">
      {/* Hero */}
      <div className="hero-section">
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "180px", height: "180px", borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10px", left: "-30px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

        <Image src="/logo1.jpg" alt="يسلمو" width={130} height={130} className="hero-logo" priority />
        <h1 className="hero-title">توصيل كافة الطلبيات إلى المنازل</h1>
        <p className="hero-desc">نوصلك كل ما تحتاجه من متاجرك المفضلة إلى باب منزلك بسرعة وأمان</p>

        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "rgba(255,255,255,0.18)", backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.3)", borderRadius: "50px",
          padding: "8px 20px", marginTop: "18px",
          color: "white", fontWeight: 700, fontSize: "0.9rem",
          animation: "slideUp 0.8s ease-out 0.6s both",
        }}>
          🚀 توصيل سريع وآمن في منطقتك
        </div>
      </div>

      {/* Stats */}
      <div style={{ width: "100%", maxWidth: "600px", padding: "0 16px", marginTop: "28px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", animation: "slideUp 0.6s ease-out 0.3s both" }}>
        {[
          { value: "30+", label: "دقيقة متوسط التوصيل", icon: "⚡" },
          { value: "100%", label: "دفع عند الاستلام", icon: "💳" },
          { value: "★ 4.9", label: "تقييم العملاء", icon: "😊" },
        ].map((stat, i) => (
          <div key={i} style={{ background: "white", borderRadius: "16px", padding: "16px 10px", textAlign: "center", border: "1px solid #f0f0f0", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: "1.4rem", marginBottom: "4px" }}>{stat.icon}</div>
            <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "#ff6b35" }}>{stat.value}</div>
            <div style={{ fontSize: "0.73rem", color: "#888", lineHeight: 1.4, marginTop: "3px" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="features-section">
        <div className="features-grid">
          {[
            { icon: "M18 18.5C18 19.6 17.1 20.5 16 20.5C14.9 20.5 14 19.6 14 18.5C14 17.4 14.9 16.5 16 16.5C17.1 16.5 18 17.4 18 18.5ZM6 18.5C6 19.6 5.1 20.5 4 20.5C2.9 20.5 2 19.6 2 18.5C2 17.4 2.9 16.5 4 16.5C5.1 16.5 6 17.4 6 18.5ZM20 4V6H22V8H20V10H18V8H16V6H18V4H20ZM6.5 7H10.5V9H8V13H6.5V7Z", text: "توصيل سريع" },
            { icon: "M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 11.99H19C18.47 16.11 15.72 19.78 12 20.93V12H5V6.3L12 3.19V11.99Z", text: "الدفع عند الاستلام" },
            { icon: "M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z", text: "تتبع الطلب" },
          ].map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon"><svg viewBox="0 0 24 24"><path d={f.icon} /></svg></div>
              <div className="feature-text">{f.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Guest CTAs */}
      <div className="cta-section">
        <Link href="/login">
          <button className="btn-cta btn-cta-outline">
            <svg viewBox="0 0 24 24" fill="#ff6b35"><path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12H12v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z" /></svg>
            تسجيل الدخول
          </button>
        </Link>
        <Link href="/register">
          <button className="btn-cta btn-cta-outline" style={{ animationDelay: "0.1s" }}>
            <svg viewBox="0 0 24 24" fill="#ff6b35"><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
            إنشاء حساب جديد
          </button>
        </Link>
      </div>

      <Footer />
    </div>
  );
}
