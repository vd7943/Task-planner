import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  profileImage: {
    public_id: { type: String, default: "" },
    url: {
      type: String,
      default: "https://via.placeholder.com/150",
    },
  },
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, default: null },
  role: {
    type: String,
    enum: ["Admin", "User"],
    default: "User",
  },
  userType: {
    type: String,
    enum: ["Custom", "Manage", "Regular"],
    default: "Regular",
  },
  payments: [
    {
      razorpay_order_id: String,
      razorpay_payment_id: String,
      amount: Number,
      status: { type: String, enum: ["success", "failed"], default: "success" },
      createdAt: {
        type: Date,
        default: () => {
          const now = new Date();
          return new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
        },
      },
    },
  ],
  subscriptionEndDate: { type: Date, default: null },
  coins: {
    type: Number,
    default: 0,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: () => {
      const now = new Date();
      return new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
    },
  },
});

const User = mongoose.model("User", userSchema);

export default User;
