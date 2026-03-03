import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
    try {
        await connectDB();

        const { name, phone, password, address } = await request.json();

        // Validation
        if (!name || !phone || !password || !address) {
            return NextResponse.json(
                { error: "جميع الحقول مطلوبة" },
                { status: 400 }
            );
        }

        if (password.length < 4) {
            return NextResponse.json(
                { error: "كلمة السر يجب أن تكون 4 أحرف على الأقل" },
                { status: 400 }
            );
        }

        // Check if phone already exists
        const existingUser = await User.findOne({ phone: phone.trim() });
        if (existingUser) {
            return NextResponse.json(
                { error: "رقم الهاتف مسجل بالفعل. يرجى تسجيل الدخول" },
                { status: 409 }
            );
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name: name.trim(),
            phone: phone.trim(),
            password: hashedPassword,
            address: address.trim(),
        });

        // Return user data (without password)
        return NextResponse.json(
            {
                message: "تم إنشاء الحساب بنجاح",
                user: {
                    id: user._id,
                    name: user.name,
                    phone: user.phone,
                    address: user.address,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Register error:", error);
        return NextResponse.json(
            { error: "حدث خطأ في إنشاء الحساب" },
            { status: 500 }
        );
    }
}
