import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Customer from "@/models/Customer";

// POST - Add a new call record to a customer
export async function POST(request, { params }) {
  try {
    await dbConnect();
    const { notes } = await request.json();

    if (!notes || notes.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Call notes are required" },
        { status: 400 }
      );
    }

    const customer = await Customer.findById(params.id);

    if (!customer) {
      return NextResponse.json(
        { success: false, error: "Customer not found" },
        { status: 404 }
      );
    }

    // Add new call record
    customer.callRecords.push({
      date: new Date(),
      notes: notes.trim(),
      createdAt: new Date(),
    });

    await customer.save();

    return NextResponse.json(
      {
        success: true,
        message: "Call record added successfully",
        data: customer.callRecords[customer.callRecords.length - 1],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add call record error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add call record" },
      { status: 500 }
    );
  }
}

// GET - Get all call records for a customer
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const customer = await Customer.findById(params.id);

    if (!customer) {
      return NextResponse.json(
        { success: false, error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: customer.callRecords.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      ),
    });
  } catch (error) {
    console.error("Get call records error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch call records" },
      { status: 500 }
    );
  }
}
