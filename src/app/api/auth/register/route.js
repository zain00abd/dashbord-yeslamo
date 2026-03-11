import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request) {
    try {
        const { name, phone, password, address, city, locationDesc, locationCoords } = await request.json();

        // Validation
        if (!name || !phone || !password || !address) {
            return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "كلمة السر يجب أن تكون 6 أحرف على الأقل" },
                { status: 400 }
            );
        }

        // Check if phone already registered in Firestore
        const existing = await adminDb
            .collection("users")
            .where("phone", "==", phone.trim())
            .limit(1)
            .get();

        if (!existing.empty) {
            return NextResponse.json(
                { error: "رقم الهاتف مسجل بالفعل. يرجى تسجيل الدخول" },
                { status: 409 }
            );
        }

        // Create user in Firebase Authentication
        // Use phone number as a pseudo-email for simplicity: phone@yaslamo.app
        const email = `${phone.trim().replace(/\s/g, "")}@yaslamo.app`;
        const userRecord = await adminAuth.createUser({
            email,
            password,
            displayName: name.trim(),
        });

        // Save profile in Firestore (NO password stored)
        await adminDb.collection("users").doc(userRecord.uid).set({
            name: name.trim(),
            phone: phone.trim(),
            address: address.trim(),
            city: city?.trim() || "",
            locationDesc: locationDesc?.trim() || "",
            locationCoords: locationCoords || null,
            role: "customer",
            createdAt: FieldValue.serverTimestamp(),
        });

        return NextResponse.json(
            {
                message: "تم إنشاء الحساب بنجاح",
                user: {
                    id: userRecord.uid,
                    name: name.trim(),
                    phone: phone.trim(),
                    address: address.trim(),
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Register error:", error);
        // Firebase Auth error codes
        if (error.code === "auth/email-already-exists") {
            return NextResponse.json(
                { error: "رقم الهاتف مسجل بالفعل. يرجى تسجيل الدخول" },
                { status: 409 }
            );
        }
        return NextResponse.json({ error: "حدث خطأ في إنشاء الحساب" }, { status: 500 });
    }
}
