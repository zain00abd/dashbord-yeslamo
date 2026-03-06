import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
});

const OrderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            required: true,
            unique: true,
        },
        customerName: {
            type: String,
            required: true,
        },
        customerPhone: {
            type: String,
            required: true,
        },
        customerAddress: {
            type: String,
            required: true,
        },
        items: [OrderItemSchema],
        notes: {
            type: String,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "preparing", "delivering", "delivered", "cancelled"],
            default: "pending",
        },
        driverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Can be used later if drivers also have User accounts
        },
        driverName: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
