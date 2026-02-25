"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import SvgBackground from "./components/SvgBackground";
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
    <>
      <SvgBackground />
      <div className="page-wrapper center-content">
        <div style={{ textAlign: "center", maxWidth: "1200px", width: "100%" }}>
          {/* User Welcome Bar */}
          {loaded && user && (
            <div className="user-welcome-bar" style={{
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              borderRadius: "50px",
              padding: "10px 24px",
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "20px",
              animation: "slideDown 0.6s ease-out",
              border: "1px solid rgba(255,255,255,0.2)",
              flexWrap: "wrap",
              justifyContent: "center",
            }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%",
                background: "rgba(255,255,255,0.3)", display: "flex",
                alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <span style={{ color: "white", fontWeight: "600", fontSize: "0.95rem" }}>
                مرحباً، {user.name} 👋
              </span>
              <Link href="/register" style={{
                color: "white", fontSize: "0.8rem", opacity: 0.8,
                borderBottom: "1px solid rgba(255,255,255,0.3)",
              }}>
                تعديل
              </Link>
              <button onClick={handleLogout} style={{
                background: "none", border: "none", color: "white",
                fontSize: "0.8rem", opacity: 0.7, cursor: "pointer",
                fontFamily: "inherit",
              }}>
                خروج
              </button>
            </div>
          )}

          {/* Logo */}
          <div className="logo-container">
            <Image
              src="/logo1.jpg"
              alt="يسلمو"
              width={180}
              height={180}
              className="logo-image"
              priority
            />
          </div>

          {/* Slogan */}
          <h2 className="slogan">توصيل كافة الطلبيات إلى المنازل</h2>

          {/* Description */}
          <p className="description">
            نوصلك كل ما تحتاجه من متاجرك المفضلة إلى باب منزلك بسرعة وأمان.
            سواء كانت وجبات طعام، مستلزمات منزلية، أو أي شيء آخر!
          </p>

          {/* Features */}
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="white">
                  <path d="M18 18.5C18 19.6 17.1 20.5 16 20.5C14.9 20.5 14 19.6 14 18.5C14 17.4 14.9 16.5 16 16.5C17.1 16.5 18 17.4 18 18.5ZM6 18.5C6 19.6 5.1 20.5 4 20.5C2.9 20.5 2 19.6 2 18.5C2 17.4 2.9 16.5 4 16.5C5.1 16.5 6 17.4 6 18.5ZM20 4V6H22V8H20V10H18V8H16V6H18V4H20ZM6.5 7H10.5V9H8V13H6.5V7Z" />
                </svg>
              </div>
              <div className="feature-text">توصيل سريع</div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="white">
                  <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 11.99H19C18.47 16.11 15.72 19.78 12 20.93V12H5V6.3L12 3.19V11.99Z" />
                </svg>
              </div>
              <div className="feature-text">الدفع عند الاستلام</div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" />
                </svg>
              </div>
              <div className="feature-text">تتبع الطلب</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div style={{
            marginBottom: "clamp(15px, 4vh, 30px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "15px",
          }}>
            <Link href="/create-order">
              <button className="btn-cta">
                <svg viewBox="0 0 24 24" fill="#ff6b35">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
                إنشاء طلب جديد
              </button>
            </Link>

            {loaded && !user && (
              <Link href="/register" style={{ animation: "fadeIn 0.8s ease-out 1s both" }}>
                <button className="btn-cta" style={{
                  background: "transparent",
                  color: "white",
                  border: "2px solid white",
                  fontSize: "clamp(0.9rem, 4vw, 1.3rem)",
                  padding: "clamp(10px, 2.5vh, 16px) clamp(25px, 6vw, 50px)",
                  boxShadow: "none",
                }}>
                  <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
                    <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  إنشاء حساب
                </button>
              </Link>
            )}
          </div>

          <Footer />
        </div>
      </div>
    </>
  );
}
