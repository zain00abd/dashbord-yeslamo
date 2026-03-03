import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
    try {
        await connectDB();

        const { phone, password } = await request.json();

        if (!phone || !password) {
            return NextResponse.json(
                { error: "رقم الهاتف وكلمة السر مطلوبان" },
                { status: 400 }
            );
        }

        // Find user by phone
        const user = await User.findOne({ phone: phone.trim() });
        if (!user) {
            return NextResponse.json(
                { error: "رقم الهاتف غير مسجل" },
                { status: 404 }
            );
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { error: "كلمة السر غير صحيحة" },
                { status: 401 }
            );
        }

        return NextResponse.json({
            message: "تم تسجيل الدخول بنجاح",
            user: {
                id: user._id,
                name: user.name,
                phone: user.phone,
                address: user.address,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "حدث خطأ في تسجيل الدخول" },
            { status: 500 }
        );
    }
}
