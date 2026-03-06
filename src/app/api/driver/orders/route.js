import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

// GET /api/driver/orders - Fetch pending orders
export async function GET() {
    try {
        await connectDB();

        // Fetch orders that are "pending"
        // Sorted by newest first
        const orders = await Order.find({ status: "pending" })
            .sort({ createdAt: -1 })
            .limit(50); // Limit to 50 for performance

        return NextResponse.json({ orders });
    } catch (error) {
        console.error("Fetch orders error:", error);
        return NextResponse.json(
            { error: "حدث خطأ في جلب الطلبات" },
            { status: 500 }
        );
    }
}

// PATCH /api/driver/orders - Accept an order
export async function PATCH(request) {
    try {
        await connectDB();

        const { orderId, status } = await request.json();

        if (!orderId || !status) {
            return NextResponse.json(
                { error: "بيانات الطلب غير مكتملة" },
                { status: 400 }
            );
        }

        // In a real app we'd also save the driver ID (from session/token)
        // For now we just update the status so other drivers don't see it
        const order = await Order.findOneAndUpdate(
            { _id: orderId, status: "pending" }, // Ensure it's still pending
            { status: "accepted" /*, driverId: session.userId */ },
            { new: true }
        );

        if (!order) {
            return NextResponse.json(
                { error: "عذراً، ربما قام مندوب آخر بقبول هذا الطلب أو تم إلغاؤه" },
                { status: 409 } // Conflict
            );
        }

        return NextResponse.json({ message: "تم قبول الطلب بنجاح", order });
    } catch (error) {
        console.error("Accept order error:", error);
        return NextResponse.json(
            { error: "حدث خطأ في تحديث الطلب" },
            { status: 500 }
        );
    }
}
