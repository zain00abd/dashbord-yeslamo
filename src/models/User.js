import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "الرجاء إدخال الاسم"],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, "الرجاء إدخال رقم الهاتف"],
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "الرجاء إدخال كلمة السر"],
            minlength: [4, "كلمة السر يجب أن تكون 4 أحرف على الأقل"],
        },
        address: {
            type: String,
            required: [true, "الرجاء إدخال العنوان"],
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
