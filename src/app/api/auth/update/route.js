import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
    try {
        await connectDB();

        const { id, name, phone, address } = await request.json();

        if (!id) {
            return NextResponse.json({ error: "المعرف مطلوب" }, { status: 400 });
        }

        const updateData = {};
        if (name) updateData.name = name.trim();
        if (phone) updateData.phone = phone.trim();
        if (address) updateData.address = address.trim();

        const user = await User.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        }).select("-password");

        if (!user) {
            return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
        }

        return NextResponse.json({
            message: "تم تحديث البيانات بنجاح",
            user: {
                id: user._id,
                name: user.name,
                phone: user.phone,
                address: user.address,
            },
        });
    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json(
            { error: "حدث خطأ في تحديث البيانات" },
            { status: 500 }
        );
    }
}
