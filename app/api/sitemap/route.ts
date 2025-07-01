import { db } from "@/lib/firebase";
import { NextResponse } from "next/server";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {

    return new NextResponse("Success", { status: 200 });
    try {
        console.log("Starting sitemap generation...");

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
                priority: "0.7",
            },
            {
                name: "hospitals",
                path: "hospitals",
                changefreq: "weekly",
                priority: "0.7",
            },
            {
                name: "specialties",
                path: "specialties",
                changefreq: "monthly",
                priority: "0.5",
            }
        ];

        let urls = "";

        // Helper function to add URL entries safely
        const addUrl = (path: string, changefreq: string, priority: string) => {
            urls += `
      <url>
        <loc>${escapeXml(`https://www.doczappoint.com/${path}`)}</loc>
        <changefreq>${escapeXml(changefreq)}</changefreq>
        <priority>${escapeXml(priority)}</priority>
      </url>`;
        };

        // Add static pages
        const staticPages = [
            { path: "", changefreq: "daily", priority: "0.7" },
            { path: "about", changefreq: "monthly", priority: "0.7" },
            { path: "contact", changefreq: "monthly", priority: "0.7" },
            { path: "emergency", changefreq: "daily", priority: "0.7" },
        ];

        staticPages.forEach(page => addUrl(page.path, page.changefreq, page.priority));

        // Process dynamic collections
        for (const { name, path, changefreq, priority } of collectionsToInclude) {
            try {
                const ref = collection(db, name);
                const snap = await getDocs(ref);

                snap.forEach(doc => {
                    addUrl(`${path}/${doc.id}`, changefreq, priority);
                });
            } catch (error) {
                console.error(`Error processing collection ${name}:`, error);
            }
        }

        // Process specialties
        try {
            const specialtiesRef = collection(db, "specialties");
            const specialtiesSnap = await getDocs(specialtiesRef);

            specialtiesSnap.forEach(doc => {
                const specialtyName = doc.data()?.name;
                if (specialtyName) {
                    addUrl(`doctors?speciality=${slugify(specialtyName)}`, "weekly", "1.0");
                    addUrl(`hospitals?q=&service=${slugify(specialtyName)}`, "weekly", "0.7");
                }
            });
        } catch (error) {
            console.error("Error processing specialties:", error);
        }

        // Process states and districts
        try {
            const statesRef = collection(db, "states");
            const statesSnap = await getDocs(statesRef);

            for (const stateDoc of statesSnap.docs) {
                const stateName = stateDoc.id;
                const stateData = stateDoc.data();
                const districts = stateData.districts || [];

                districts.forEach((districtName: string) => {
                    addUrl(`${slugify(stateName)}/${slugify(districtName)}`, "weekly", "0.8");
                    // addUrl(`${slugify(stateName)}/${slugify(districtName)}/doctors`, "weekly", "1.0");
                    // addUrl(`${slugify(stateName)}/${slugify(districtName)}/doctors?ayushman=true`, "weekly", "1.0");
                });
            }
        } catch (error) {
            console.error("Error processing states:", error);
        }

        // Process lab tests with state/district combinations
        try {
            console.log("Fetching lab tests...");
            const testsRef = collection(db, "specialtiesLab");
            const testsSnap = await getDocs(testsRef);
            const tests: string[] = [];

            testsSnap.forEach(testDoc => {
                const testName = testDoc.data()?.name;
                if (testName) tests.push(testName);
            });

            console.log(`Found ${tests.length} tests`);

            const statesRef = collection(db, "states");
            const statesSnap = await getDocs(statesRef);
            let combinationCount = 0;

            for (const stateDoc of statesSnap.docs) {
                const stateName = stateDoc?.id;
                const districts = stateDoc.data()?.districts || [];
                console.log(stateDoc.data());
                // if (!stateName) continue;

                for (const district of districts) {
                    for (const test of tests) {
                        combinationCount++;
                        addUrl(
                            `labs?state=${slugify(stateName)}&district=${slugify(district)}&test=${slugify(test)}`,
                            "weekly",
                            "0.7"
                        );
                    }
                }
            }

            console.log(`Generated ${combinationCount} state-district-test combinations`);
        } catch (error) {
            console.error("Error processing lab tests:", error);
        }
        // Process doctors tests with state/district combinations
        try {
            console.log("Fetching doctors tests...");
            const specialtiesRef = collection(db, "specialties");
            const specialtiesSnap = await getDocs(specialtiesRef);
            const specialties: string[] = [];

            specialtiesSnap.forEach(specialtiesDoc => {
                const testName = specialtiesDoc.data()?.name;
                if (testName) specialties.push(testName);
            });

            console.log(`Found ${specialties.length} tests`);

            const statesRef = collection(db, "states");
            const statesSnap = await getDocs(statesRef);
            let combinationCount = 0;

            for (const stateDoc of statesSnap.docs) {
                const stateName = stateDoc?.id;
                const districts = stateDoc.data()?.districts || [];
                console.log(stateDoc.data());
                // if (!stateName) continue;

                for (const district of districts) {
                    addUrl(`${slugify(stateName)}/${slugify(district)}/doctors`, "weekly", "1.0");
                    addUrl(`${slugify(stateName)}/${slugify(district)}/ayushman/doctors`, "weekly", "1.0");
                    for (const specialty of specialties) {
                        combinationCount++;
                        // addUrl(
                        //     `doctors?state=${slugify(stateName)}&district=${slugify(district)}&test=${slugify(specialty)}`,
                        //     "weekly",
                        //     "1.0"
                        // );
                        addUrl(`${slugify(stateName)}/${slugify(district)}/ayushman/doctors?test=${slugify(specialty)}`, "weekly", "1.0");
                        addUrl(`${slugify(stateName)}/${slugify(district)}/doctors?&test=${slugify(specialty)}`, "weekly", "1.0");
                    //
                    }
                }
            }

            console.log(`Generated ${combinationCount} state-district-test combinations`);
        } catch (error) {``
            console.error("Error processing doctor tests:", error);
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

// Improved slugify with null check
function slugify(text: string | undefined | null): string {
    if (!text) return '';
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

// XML escaping function
function escapeXml(unsafe: string): string {
    if (!unsafe) return '';
    return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            default: return c;
        }
    });
}
