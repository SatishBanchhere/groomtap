import { NextRequest } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get('url');

    if (!url) {
        return Response.json({ success: false, error: 'URL is required' }, { status: 400 });
    }

    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);

        const metaTags: { name?: string; property?: string; content: string }[] = [];

        $('meta').each((_, el) => {
            const name = $(el).attr('name');
            const property = $(el).attr('property');
            const content = $(el).attr('content');
            if (content) {
                metaTags.push({ name, property, content });
            }
        });

        const title = $('title').text();
        if (title) {
            metaTags.unshift({ name: 'title', content: title });
        }

        return Response.json({ success: true, meta: metaTags });
    } catch (err) {
        return Response.json({ success: false, error: 'Failed to fetch meta tags' }, { status: 500 });
    }
}
