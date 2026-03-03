"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Footer from "./components/Footer";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const userData = localStorage.getItem("yaslamo_user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (e) { }
    setLoaded(true);
  }, []);

  function handleLogout() {
    if (confirm("هل تريد تسجيل الخروج؟")) {
      localStorage.removeItem("yaslamo_user");
      setUser(null);
    }
  }

  return (
    <div className="page-wrapper">
      {/* Hero Section */}
      <div className="hero-section">
        {/* Welcome Bar */}
        {loaded && user && (
          <div className="welcome-bar">
            <div className="welcome-avatar">
              <svg viewBox="0 0 24 24" fill="white">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <span className="welcome-name">مرحباً، {user.name} 👋</span>
            <div className="welcome-actions">
              <Link href="/register">تعديل</Link>
              <button onClick={handleLogout}>خروج</button>
            </div>
          </div>
        )}

        <Image
          src="/logo1.jpg"
          alt="يسلمو"
          width={130}
          height={130}
          className="hero-logo"
          priority
        />
        <h1 className="hero-title">توصيل كافة الطلبيات إلى المنازل</h1>
        <p className="hero-desc">
          نوصلك كل ما تحتاجه من متاجرك المفضلة إلى باب منزلك بسرعة وأمان
        </p>
      </div>

      {/* Features */}
      <div className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24">
                <path d="M18 18.5C18 19.6 17.1 20.5 16 20.5C14.9 20.5 14 19.6 14 18.5C14 17.4 14.9 16.5 16 16.5C17.1 16.5 18 17.4 18 18.5ZM6 18.5C6 19.6 5.1 20.5 4 20.5C2.9 20.5 2 19.6 2 18.5C2 17.4 2.9 16.5 4 16.5C5.1 16.5 6 17.4 6 18.5ZM20 4V6H22V8H20V10H18V8H16V6H18V4H20ZM6.5 7H10.5V9H8V13H6.5V7Z" />
              </svg>
            </div>
            <div className="feature-text">توصيل سريع</div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 11.99H19C18.47 16.11 15.72 19.78 12 20.93V12H5V6.3L12 3.19V11.99Z" />
              </svg>
            </div>
            <div className="feature-text">الدفع عند الاستلام</div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" />
              </svg>
            </div>
            <div className="feature-text">تتبع الطلب</div>
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="cta-section">
        <Link href="/create-order">
          <button className="btn-cta">
            <svg viewBox="0 0 24 24" fill="white">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            إنشاء طلب جديد
          </button>
        </Link>

        {loaded && !user && (
          <>
            <Link href="/login">
              <button className="btn-cta btn-cta-outline">
                <svg viewBox="0 0 24 24" fill="#ff6b35">
                  <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12H12v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z" />
                </svg>
                تسجيل الدخول
              </button>
            </Link>
            <Link href="/register">
              <button className="btn-cta btn-cta-outline" style={{ animationDelay: "0.7s" }}>
                <svg viewBox="0 0 24 24" fill="#ff6b35">
                  <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                إنشاء حساب جديد
              </button>
            </Link>
          </>
        )}

        <Link href="/track-order">
          <button className="btn-cta btn-cta-outline" style={{ animationDelay: "0.8s" }}>
            <svg viewBox="0 0 24 24" fill="#ff6b35">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            تتبع طلب
          </button>
        </Link>
      </div>

      <Footer />
    </div>
  );
}
