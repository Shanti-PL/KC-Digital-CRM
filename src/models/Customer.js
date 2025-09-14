import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    trim: true,
  },
  businessName: {
    type: String,
    required: [true, "Please provide a business name"],
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
    default: "",
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: "",
    validate: {
      validator: function (v) {
        // Only validate if email is provided (not empty)
        return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: "Please enter a valid email address",
    },
  },
  interested: {
    type: Boolean,
    default: false,
  },
  package: {
    type: String,
    enum: [
      "Starter Landing Page",
      "Growth Landing Page",
      "Pro Website",
      "Other",
      "",
    ],
    default: "",
  },
  packagePrice: {
    type: String,
    default: "",
  },
  notes: {
    type: String,
    default: "",
  },
  callRecords: [
    {
      date: {
        type: Date,
        default: Date.now,
      },
      notes: {
        type: String,
        required: [true, "Please provide call notes"],
        trim: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
CustomerSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Customer ||
  mongoose.model("Customer", CustomerSchema);
