// hooks/useViewCount.js
import { useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

export default function useViewCount() {
    useEffect(() => {
        const updateViewCount = async () => {
            try {
                const viewCountRef = doc(db, "analytics", "viewCounts");
                await updateDoc(viewCountRef, {
                    totalViews: increment(1),
                    lastUpdated: new Date().toISOString(),
                });
            } catch (error) {
                console.error("Error updating view count:", error);
            }
        };
        updateViewCount();
    }, []);
}
