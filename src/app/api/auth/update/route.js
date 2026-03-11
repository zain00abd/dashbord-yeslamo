import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request) {
    try {
        const { id, name, address, city, locationDesc, locationCoords } = await request.json();

        if (!id) {
            return NextResponse.json({ error: "المعرف مطلوب" }, { status: 400 });
        }

        const updateData = {
            updatedAt: FieldValue.serverTimestamp(),
        };

        if (name) updateData.name = name.trim();
        if (address) updateData.address = address.trim();
        if (city !== undefined) updateData.city = city?.trim() || "";
        if (locationDesc !== undefined) updateData.locationDesc = locationDesc?.trim() || "";
        if (locationCoords !== undefined) updateData.locationCoords = locationCoords || null;
        // Phone is intentionally not updatable here (it's tied to the Auth email)

        const docRef = adminDb.collection("users").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
        }

        await docRef.update(updateData);
        const updatedDoc = await docRef.get();
        const profile = updatedDoc.data();

        return NextResponse.json({
            message: "تم تحديث البيانات بنجاح",
            user: {
                id,
                name: profile.name,
                phone: profile.phone,
                address: profile.address,
            },
        });
    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json({ error: "حدث خطأ في تحديث البيانات" }, { status: 500 });
    }
}
