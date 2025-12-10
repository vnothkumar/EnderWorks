import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		tags: z.array(z.string()).optional(),
	}),
});

const products = defineCollection({
	loader: glob({ base: './src/content/products', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		images: z.array(z.string()),
		price: z.number().or(z.string()),
		currency: z.string().default('INR'),
		tags: z.array(z.string()).optional(),
		created_at: z.coerce.date(),
		updated_at: z.coerce.date().optional().nullable(),
	}),
});

export const collections = {
	blog,
	products,
};
