import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Customer from "@/models/Customer";

// GET all customers
export async function GET() {
  try {
    await dbConnect();
    const customers = await Customer.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: customers });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

// POST create new customer
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const customer = await Customer.create(body);
    return NextResponse.json(
      { success: true, data: customer },
      { status: 201 }
    );
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return NextResponse.json(
        { success: false, error: messages },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create customer" },
      { status: 500 }
    );
  }
}
