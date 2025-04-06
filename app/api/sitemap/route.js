import { db } from "@/lib/firebase";
import { NextResponse } from "next/server";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
    try {
        const doctorsRef = collection(db, "doctors");
        const doctorSnap = await getDocs(doctorsRef);
        let urls = "";
        doctorSnap.forEach(doc => {
            urls += `<url><loc>https://www.doczappoint.in/doctors/${doc.id}</loc></url>`; // Use www. for consistency
        });
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urls}
      </urlset>`;
        return new NextResponse(sitemap, {
            headers: { "Content-Type": "application/xml" }, // Use "application/xml"
        });
    } catch (error) {
        return new NextResponse("Error generating sitemap", { status: 500 });
    }
}
