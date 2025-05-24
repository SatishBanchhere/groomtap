"use client";

import { Suspense } from "react";

export default function SearchLayout({
                                         children,
                                         searchParams,
                                     }: {
    children: React.ReactNode;
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <Suspense fallback={<div className="text-center py-8">Loading search results...</div>}>
                    {children}
                </Suspense>
            </div>
        </div>
    );
}
