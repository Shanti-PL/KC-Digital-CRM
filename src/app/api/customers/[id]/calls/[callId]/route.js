import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Customer from "@/models/Customer";

// PUT - Update a specific call record
export async function PUT(request, { params }) {
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

    // Find the specific call record
    const callRecord = customer.callRecords.id(params.callId);

    if (!callRecord) {
      return NextResponse.json(
        { success: false, error: "Call record not found" },
        { status: 404 }
      );
    }

    // Update the call record
    callRecord.notes = notes.trim();
    callRecord.updatedAt = new Date();

    await customer.save();

    return NextResponse.json(
      {
        success: true,
        message: "Call record updated successfully",
        data: callRecord,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update call record error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update call record" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specific call record
export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const customer = await Customer.findById(params.id);

    if (!customer) {
      return NextResponse.json(
        { success: false, error: "Customer not found" },
        { status: 404 }
      );
    }

    // Find and remove the specific call record
    const callRecord = customer.callRecords.id(params.callId);

    if (!callRecord) {
      return NextResponse.json(
        { success: false, error: "Call record not found" },
        { status: 404 }
      );
    }

    // Remove the call record
    callRecord.deleteOne();
    await customer.save();

    return NextResponse.json(
      {
        success: true,
        message: "Call record deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete call record error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete call record" },
      { status: 500 }
    );
  }
}
