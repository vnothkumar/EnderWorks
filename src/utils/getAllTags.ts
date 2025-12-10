/* eslint-disable */
import { getCollection } from 'astro:content';
import type { MDXInstance } from 'astro';
import { slugify, deslugify } from './slug';

interface Post {
    title: string;
    description: string;
    pubDate: Date;
    updatedDate: Date | null;
    heroImage?: string | null;
    categories?: string[]; // Make categories optional
    tags?: string[]; // Make tags optional
    authors: string[];
}

export function getAllTags(posts: MDXInstance<Post>[] = []) {
    const allTags = new Set<string>();
    posts.forEach((post) => {
        if (post.data?.tags) { // Check if tags exist
            post.data.tags.forEach((tag: string) => allTags.add(tag.toLowerCase()));
        }
    });
    return [...allTags];
}

export const getTaxonomy = async (collection: string, name: string) => {
    const singlePages = await getCollection(collection);
    const taxonomyPages = singlePages.map((page) => page.data[name] || []); // Default to empty array if taxonomy not present

    // Prepare map to count occurrences of each tag
    const tagCountMap: Record<string, number> = {};

    // Iterate over pages to count tags
    for (let i = 0; i < taxonomyPages.length; i++) {
        const categoryArray = taxonomyPages[i];
        for (let j = 0; j < categoryArray.length; j++) {
            const tagName = categoryArray[j];
            if (tagCountMap[tagName]) {
                tagCountMap[tagName]++;
            } else {
                tagCountMap[tagName] = 1;
            }
        }
    }

    // Prepare array of unique taxonomies with count
    const uniqueTaxonomies = Object.keys(tagCountMap).map(tagName => ({
        name: tagName,
        slug: slugify(tagName),
        count: tagCountMap[tagName]
    }));

    return uniqueTaxonomies;

};


export const getSinglePage = async (collection: any) => {
    const allPage = await getCollection(collection);
    const removeIndex = allPage.filter((data) => data.id.match(/^(?!-)/));
    const removeDrafts = removeIndex.filter((data) => !data.data.draft);
    return removeDrafts;
};

export const taxonomyFilter = (posts: any[], name: string, key: any) =>
    posts.filter((post) => {
        if (post.data[name]) { // Check if the taxonomy array exists
            return post.data[name].map((name: string) => deslugify(name)).includes(deslugify(key));
        }
        return false; // Return false if taxonomy array doesn't exist
    });