import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE_TITLE } from '../consts';

export const GET: APIRoute = async ({ params, request }) => {
    try {
        const posts = await getCollection("products");
        return new Response(
            JSON.stringify({
                data: posts.map((post) => ({
                    title: post.data.title,
                    url: `/products/${post.id}`,
                    date: post.data.created_at,
                    poster: post.data.images[0] || 'https://placehold.co/100x100?text=Product',
                })),
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    } catch (error) {
        console.error('Error fetching or processing data:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
};