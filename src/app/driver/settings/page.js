"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import "../driver.css";

const DRIVER_AREA_ID = "default";
const DRIVER_SETTINGS_DEFAULT = {
    name: "",
    phone: "",
    vehicleType: "",
    area: DRIVER_AREA_ID,
    isAvailable: true,
    soundAlerts: true,
    vibrationAlerts: true,
};

export default function DriverSettingsPage() {
    const [user, setUser] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);
    const [isDriver, setIsDriver] = useState(false);
    const [roleChecked, setRoleChecked] = useState(false);
    const [settings, setSettings] = useState(DRIVER_SETTINGS_DEFAULT);
    const [isSaving, setIsSaving] = useState(false);

    const settingsStorageKey = user ? `yaslamo_driver_settings_${user.uid}` : null;

    useEffect(() => {
        document.body.classList.add("driver-app");
        const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
            setUser(firebaseUser);
            setAuthChecked(true);
        });
        return () => {
            document.body.classList.remove("driver-app");
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        const loadSettings = async () => {
            if (!user || !settingsStorageKey) return;

            let base = {
                ...DRIVER_SETTINGS_DEFAULT,
                name: user.displayName || "",
                phone: user.phoneNumber || "",
            };

            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const profile = userDoc.data();
                    setIsDriver(profile?.role === "driver");
                    base = {
                        ...base,
                        name: profile?.name || base.name,
                        phone: profile?.phone || base.phone,
                        vehicleType: profile?.vehicleType || "",
                        area: profile?.area || profile?.city || base.area,
                    };
                }
            } catch (err) {
                console.error("load driver profile error:", err);
                setIsDriver(false);
            } finally {
                setRoleChecked(true);
            }

            try {
                const raw = localStorage.getItem(settingsStorageKey);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    setSettings({ ...base, ...parsed });
                    return;
                }
                setSettings(base);
                localStorage.setItem(settingsStorageKey, JSON.stringify(base));
            } catch (err) {
                console.error("load local driver settings error:", err);
                setSettings(base);
            }
        };

        loadSettings();
    }, [user, settingsStorageKey]);

    const saveSettings = useCallback(() => {
        if (!settingsStorageKey) return;
        setIsSaving(true);
        try {
            const clean = {
                ...settings,
                name: String(settings.name || "").trim(),
                phone: String(settings.phone || "").trim(),
                vehicleType: String(settings.vehicleType || "").trim(),
                area: String(settings.area || "").trim() || DRIVER_AREA_ID,
            };
            setSettings(clean);
            localStorage.setItem(settingsStorageKey, JSON.stringify(clean));
            alert("تم حفظ الإعدادات بنجاح");
        } catch (err) {
            console.error("save local driver settings error:", err);
            alert("تعذر حفظ الإعدادات");
        } finally {
            setIsSaving(false);
        }
    }, [settings, settingsStorageKey]);

    if (!authChecked) {
        return (
            <div className="driver-layout" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
                <div style={{ color: "var(--driver-text-muted)" }}>...</div>
            </div>
        );
    }
    if (!user) {
        return (
            <div className="driver-layout" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "24px" }}>
                <div className="empty-state">
                    <div style={{ fontWeight: 800, marginBottom: "8px" }}>يجب تسجيل الدخول أولاً</div>
                    <Link href="/driver" className="order-details-btn" style={{ marginTop: "8px" }}>
                        العودة إلى صفحة المندوب
                    </Link>
                </div>
            </div>
        );
    }
    if (!roleChecked) {
        return (
            <div className="driver-layout" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
                <div style={{ color: "var(--driver-text-muted)" }}>...</div>
            </div>
        );
    }
    if (!isDriver) {
        return (
            <div className="driver-layout" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "24px" }}>
                <div className="empty-state">
                    <div style={{ fontWeight: 800, marginBottom: "8px" }}>غير مخول لدخول إعدادات المندوب</div>
                    <Link href="/" className="order-details-btn" style={{ marginTop: "8px" }}>
                        العودة للرئيسية
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="driver-layout">
            <header className="driver-header">
                <div className="driver-title">إعدادات المندوب</div>
                <Link href="/driver" className="driver-logout-btn" style={{ textDecoration: "none" }}>
                    رجوع
                </Link>
            </header>

            <main className="driver-content">
                <div className="section-heading">إعدادات الحساب</div>

                <div className="accepted-card" style={{ padding: "14px" }}>
                    <div className="driver-profile-card">
                        <div className="driver-profile-title">بيانات المندوب</div>
                        <div className="driver-profile-list">
                            <div className="driver-profile-item">
                                <span className="driver-profile-label">الاسم</span>
                                <span className="driver-profile-value">{settings.name || "—"}</span>
                            </div>
                            <div className="driver-profile-item">
                                <span className="driver-profile-label">رقم الهاتف</span>
                                <span className="driver-profile-value" dir="ltr">{settings.phone || "—"}</span>
                            </div>
                            <div className="driver-profile-item">
                                <span className="driver-profile-label">وسيلة النقل</span>
                                <span className="driver-profile-value">{settings.vehicleType || "—"}</span>
                            </div>
                            <div className="driver-profile-item">
                                <span className="driver-profile-label">المنطقة</span>
                                <span className="driver-profile-value">{settings.area || "—"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="driver-settings-toggles">
                        <label className="driver-toggle-item">
                            <input
                                type="checkbox"
                                checked={settings.isAvailable}
                                onChange={(e) => setSettings((prev) => ({ ...prev, isAvailable: e.target.checked }))}
                            />
                            <span>متاح لاستقبال الطلبات</span>
                        </label>
                        <label className="driver-toggle-item">
                            <input
                                type="checkbox"
                                checked={settings.soundAlerts}
                                onChange={(e) => setSettings((prev) => ({ ...prev, soundAlerts: e.target.checked }))}
                            />
                            <span>تشغيل صوت التنبيهات</span>
                        </label>
                        <label className="driver-toggle-item">
                            <input
                                type="checkbox"
                                checked={settings.vibrationAlerts}
                                onChange={(e) => setSettings((prev) => ({ ...prev, vibrationAlerts: e.target.checked }))}
                            />
                            <span>تشغيل الاهتزاز عند التنبيه</span>
                        </label>
                    </div>

                    <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                        <button
                            onClick={saveSettings}
                            disabled={isSaving}
                            style={{ flex: 1, padding: "11px", borderRadius: "8px", border: "none", background: "var(--driver-primary)", color: "white", fontFamily: "inherit", fontWeight: 700, cursor: "pointer", opacity: isSaving ? 0.8 : 1 }}
                        >
                            {isSaving ? "جاري الحفظ..." : "حفظ الإعدادات"}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
