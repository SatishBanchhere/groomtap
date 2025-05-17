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

        const specialtiesRef = collection(db, "specialties");
        const specialtiesSnap = await getDocs(specialtiesRef);

        // Add doctor specialty routes
        specialtiesSnap.forEach(doc => {
            const specialtyName = doc.data().name;
            urls += `
              <url>
                <loc>https://www.doczappoint.com/doctors?speciality=${slugify(specialtyName)}</loc>
                <changefreq>weekly</changefreq>
                <priority>0.9</priority>
              </url>`;
        });

        const allServicesRef = collection(db, "specialties");
        const allServicesSnap = await getDocs(allServicesRef);

        // Add doctor specialty routes
        allServicesSnap.forEach(doc => {
            const servicesName = doc.data().name;
            urls += `
              <url>
                <loc>https://www.doczappoint.com/hospitals?q=&amp;service=${slugify(servicesName)}</loc>
                <changefreq>weekly</changefreq>
                <priority>0.9</priority>
              </url>`;
        });

        // Add states and districts
        const statesRef = collection(db, "states");
        const statesSnap = await getDocs(statesRef);

        for (const stateDoc of statesSnap.docs) {
            const stateName = stateDoc.id;
            const stateData = stateDoc.data();

            // Process each district in the state
            if (stateData.districts && Array.isArray(stateData.districts)) {
                for (const districtName of stateData.districts) {
                    urls += `
                      <url>
                        <loc>https://www.doczappoint.com/${slugify(stateName)}/${slugify(districtName)}</loc>
                        <changefreq>weekly</changefreq>
                        <priority>0.8</priority>
                      </url>`;

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
