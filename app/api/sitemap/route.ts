import { db } from "@/lib/firebase";
import { NextResponse } from "next/server";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

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

        // Add static pages
        const staticPages = [
            { path: "", changefreq: "daily", priority: "1.0" },
            { path: "about", changefreq: "monthly", priority: "0.8" },
            { path: "contact", changefreq: "monthly", priority: "0.8" },
            { path: "emergency", changefreq: "daily", priority: "0.9" },
            // Add other important static pages
        ];

        staticPages.forEach(page => {
            urls += `
      <url>
        <loc>https://www.doczappoint.com/${page.path}</loc>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
      </url>`;
        });

        // Process dynamic collections
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

        // Add states and districts
        const statesRef = collection(db, "states");
        const statesSnap = await getDocs(statesRef);

        for (const stateDoc of statesSnap.docs) {
            const stateName = stateDoc.id;
            const stateData = stateDoc.data();

            // URL for the state page
            urls += `
      <url>
        <loc>https://www.doczappoint.com/${slugify(stateName)}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
      </url>`;

            // Process each district in the state
            if (stateData.districts && Array.isArray(stateData.districts)) {
                for (const districtName of stateData.districts) {
                    // URL for district page
      //               urls += `
      // <url>
      //   <loc>https://www.doczappoint.com/${slugify(stateName)}/${slugify(districtName)}</loc>
      //   <changefreq>weekly</changefreq>
      //   <priority>0.7</priority>
      // </url>`;

                    // URL for emergency services in this district
                    urls += `
      <url>
        <loc>https://www.doczappoint.com/${slugify(stateName)}/${slugify(districtName)}</loc>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
      </url>`;

                    // URL for doctors in this district
      //               urls += `
      // <url>
      //   <loc>https://www.doczappoint.com/${slugify(stateName)}/${slugify(districtName)}/doctors</loc>
      //   <changefreq>weekly</changefreq>
      //   <priority>0.7</priority>
      // </url>`;

                    // URL for hospitals in this district
      //               urls += `
      // <url>
      //   <loc>https://www.doczappoint.com/${slugify(stateName)}/${slugify(districtName)}/hospitals</loc>
      //   <changefreq>monthly</changefreq>
      //   <priority>0.7</priority>
      // </url>`;
                }
            }
        }

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urls}
      </urlset>`;

        return new NextResponse(sitemap, {
            headers: { "Content-Type": "application/xml" },
        });

    } catch (error) {
        console.error("Error generating sitemap:", error);
        return new NextResponse("Error generating sitemap", { status: 500 });
    }
}

// Helper function to convert names to URL-friendly slugs
function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}
