"use client"
import { useState } from 'react';

type MetaTag = {
    name?: string;
    property?: string;
    content: string;
};

export default function MetaPreview() {
    const [url, setUrl] = useState('');
    const [metaTags, setMetaTags] = useState<MetaTag[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchMetaTags = async () => {
        setLoading(true);
        setError('');
        setMetaTags([]);

        try {
            const res = await fetch(`/api/fetch-meta?url=${encodeURIComponent(url)}`);
            const data = await res.json();
            if (data.success) {
                setMetaTags(data.meta);
            } else {
                setError(data.error || 'Failed to fetch metadata.');
            }
        } catch (err) {
            setError('Error fetching meta tags.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4">Meta Tag Extractor</h1>
            <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter a URL..."
                className="w-full p-2 border rounded mb-4"
            />
            <button
                onClick={fetchMetaTags}
                disabled={!url}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
                {loading ? 'Loading...' : 'Fetch Meta Tags'}
            </button>

            {error && <p className="text-red-500 mt-4">{error}</p>}

            {metaTags.length > 0 && (
                <table className="mt-6 w-full border">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 border">Name / Property</th>
                        <th className="p-2 border">Content</th>
                    </tr>
                    </thead>
                    <tbody>
                    {metaTags.map((tag, idx) => (
                        <tr key={idx}>
                            <td className="p-2 border">
                                {tag.name || tag.property || '—'}
                            </td>
                            <td className="p-2 border">{tag.content}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
