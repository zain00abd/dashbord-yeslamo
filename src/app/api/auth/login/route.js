import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase-admin";

export async function POST(request) {
    try {
        const { phone, password } = await request.json();

        if (!phone || !password) {
            return NextResponse.json(
                { error: "رقم الهاتف وكلمة السر مطلوبان" },
                { status: 400 }
            );
        }

        // Verify credentials via Firebase Auth REST API
        // Firebase Admin SDK doesn't have a sign-in method directly,
        // so we verify by looking up the user and checking the phone exists.
        // The actual password check is done client-side via Firebase Auth SDK.
        // This route now just fetches the Firestore profile after client confirms sign-in.
        const email = `${phone.trim().replace(/\s/g, "")}@yaslamo.app`;

        let userRecord;
        try {
            userRecord = await adminAuth.getUserByEmail(email);
        } catch {
            return NextResponse.json(
                { error: "رقم الهاتف غير مسجل" },
                { status: 404 }
            );
        }

        // Fetch profile from Firestore
        const profileDoc = await adminDb.collection("users").doc(userRecord.uid).get();

        if (!profileDoc.exists) {
            return NextResponse.json({ error: "الملف الشخصي غير موجود" }, { status: 404 });
        }

        const profile = profileDoc.data();

        return NextResponse.json({
            message: "تم التحقق بنجاح",
            user: {
                id: userRecord.uid,
                name: profile.name,
                phone: profile.phone,
                address: profile.address,
                email,           // needed for client-side signInWithEmailAndPassword
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "حدث خطأ في تسجيل الدخول" }, { status: 500 });
    }
}
