"use client";

import { useRef, useState } from "react";

export default function WordPastePreviewer() {
    const editorRef = useRef<HTMLDivElement>(null);
    const [html, setHtml] = useState("");

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const html = e.clipboardData.getData("text/html");
        const text = e.clipboardData.getData("text/plain");

        if (html) {
            const processedHtml = cleanWordHtml(html);
            setHtml(processedHtml);
            if (editorRef.current) {
                editorRef.current.innerHTML = processedHtml;
            }
        } else if (text) {
            setHtml(text);
            if (editorRef.current) {
                editorRef.current.textContent = text;
            }
        }
    };

    const cleanWordHtml = (html: string): string => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;

        // Preserve images exactly as they are
        const images = tempDiv.querySelectorAll('img');
        images.forEach(img => {
            // Ensure image retains its original dimensions
            if (!img.hasAttribute('width') && !img.hasAttribute('height')) {
                img.setAttribute('style', 'max-width: 100%; height: auto;');
            }
        });

        // Clean other elements but leave images untouched
        const elements = tempDiv.querySelectorAll('*:not(img)');
        elements.forEach(el => {
            el.removeAttribute('style');
            el.removeAttribute('class');
            if (el.tagName === 'P' && el.innerHTML.trim() === '') {
                el.remove();
            }
        });

        return tempDiv.innerHTML
            .replace(/<br\s*\/?>\s*<br\s*\/?>/g, '<br>')
            .replace(/\n\s*\n/g, '\n')
            .replace(/&nbsp;/g, ' ')
            .trim();
    };

    const generateMime = (html: string) => {
        return `Content-Type: text/html; charset="UTF-8"\n\n${html}`;
    };

    return (
        <div className="p-6 space-y-4 max-w-4xl mx-auto">
            <h1 className="text-xl font-bold">📄 Paste from Word Below</h1>

            <div
                ref={editorRef}
                contentEditable
                onPaste={handlePaste}
                className="min-h-[200px] border rounded p-4 bg-white shadow overflow-auto"
                style={{
                    whiteSpace: "pre-wrap",
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    lineHeight: "1.5"
                }}
            />

            <div>
                <h2 className="font-semibold mt-6">🔍 Cleaned HTML:</h2>
                <pre className="bg-gray-100 p-4 rounded max-h-64 overflow-auto text-xs">
                    {html}
                </pre>
            </div>

            <div>
                <h2 className="font-semibold mt-6">✉️ Simulated MIME:</h2>
                <pre className="bg-yellow-50 p-4 rounded max-h-64 overflow-auto text-xs">
                    {generateMime(html)}
                </pre>
            </div>
        </div>
    );
}