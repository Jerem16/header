export interface Author {
    id: string;
    name: string;
    avatar: string;
    // autres champs si nécessaire
}

export interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    authorId: string;
    sectionIds: string[];
    relatedPostIds: string[];
    videoUrl: string | null;
    tags: string[];
    type: string;
    status: string;
    seo: { title: string; description: string; image: string | null };
    createdAt: string;
    updatedAt: string;
}

export type Section = {
    id: string;
    title: string;
    slug: string;
    description: string;
    order: number;
    postIds: string[];
    seo?: {
        title: string;
        description: string;
        image?: string;
    };
};

export interface BlogData {
    sections: Section[];
    posts: Post[];
    authors: Author[];
}

export interface BlogProps {
    data: BlogData;
    singlePost?: Post; // optionnel pour page article
}
export type Seo = {
    title: string;
    description: string;
    image: string;
};
