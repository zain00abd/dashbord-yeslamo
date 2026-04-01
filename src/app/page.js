"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Footer from "./components/Footer";
import { Truck, CreditCard, MapPin } from "lucide-react";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const userData = localStorage.getItem("yaslamo_user");
      if (userData) {
        router.replace("/home");
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

        <Image src="/logo3.png" alt="يسلمو" width={130} height={130} className="hero-logo" priority />
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

      {/* Stats removed */}

      {/* Features */}
      <div className="features-section">
        <div className="features-grid">
          {[
            { Icon: Truck, text: "توصيل سريع" },
            { Icon: CreditCard, text: "الدفع عند الاستلام" },
            { Icon: MapPin, text: "تتبع الطلب" },
          ].map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon"><f.Icon aria-hidden="true" /></div>
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
