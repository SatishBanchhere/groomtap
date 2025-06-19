import Razorpay from "razorpay";
import { NextResponse } from "next/server";


const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST",
    "Access-Control-Allow-Headers": "Content-Type",
};
const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_SECRET!,
});

export async function POST(req: Request) {


    try {
        const body = await req.json();
        const amount = body.amount;

        // Validate amount
        if (!amount || isNaN(amount)) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400, headers: corsHeaders});
        }

        const options = {
            amount: parseInt(amount).toString(), // amount in paisa, as string
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1, // THIS enables auto-capture
            notes: {
                key1: "value3",
                key2: "value2",
                labId: body.labId || "",
                userId: body.userId || ""
            }
        };

        const order = await razorpay.orders.create(options);

        return new NextResponse(JSON.stringify(order), {
            status: 200,
            headers: corsHeaders
        });
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        return NextResponse.json(
            { error: "Error creating Razorpay order" },
            { status: 500, headers: corsHeaders }
        );
    }
}
