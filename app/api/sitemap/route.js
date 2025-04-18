import { db } from "@/lib/firebase";
import { NextResponse } from "next/server";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
    try {
        // Define all collections with their URL paths and sitemap options
        const collectionsToInclude = [
            {
                name: "doctors",
                path: "doctors",
                changefreq: "weekly",
                priority: "1.0",
            },
            {
                name: "lab_form",
                path: "labs",
                changefreq: "monthly",
                priority: "0.9",
            },
            {
                name: "hospitals",
                path: "hospitals",
                changefreq: "weekly",
                priority: "0.9",
            },
            {
                name: "specialties",
                path: "specialties",
                changefreq: "monthly",
                priority: "0.5",
            }
        ];

        let urls = "";

        for (const { name, path, changefreq, priority } of collectionsToInclude) {
            const ref = collection(db, name);
            const snap = await getDocs(ref);
            snap.forEach(doc => {
                urls += `
          <url>
            <loc>https://www.doczappoint.com/${path}/${doc.id}</loc>
            <changefreq>${changefreq}</changefreq>
            <priority>${priority}</priority>
          </url>`;
            });
        }

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urls}
      </urlset>`;

        return new NextResponse(sitemap, {
            headers: { "Content-Type": "application/xml" },
        });

    } catch (error) {
        return new NextResponse("Error generating sitemap", { status: 500 });
    }
}
