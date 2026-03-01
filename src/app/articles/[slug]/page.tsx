import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import AdBanner from "@/components/ui/AdBanner";
import ArticleCard from "@/components/ui/ArticleCard";
import { notFound } from "next/navigation";

import { getArticleBySlug, getArticles } from "@/lib/api";

// Strapi rich-text is an array of block nodes. This renders them as plain HTML.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderRichText(content: any[]): string {
    if (!Array.isArray(content)) return '';
    return content.map((block) => {
        if (block.type === 'paragraph') {
            const text = block.children?.map((c: { text: string }) => c.text).join('') ?? '';
            return `<p>${text}</p>`;
        }
        if (block.type === 'heading') {
            const text = block.children?.map((c: { text: string }) => c.text).join('') ?? '';
            const level = block.level ?? 2;
            return `<h${level}>${text}</h${level}>`;
        }
        if (block.type === 'list') {
            const tag = block.format === 'ordered' ? 'ol' : 'ul';
            const items = block.children?.map((item: { children: { text: string }[] }) => {
                const text = item.children?.map((c) => c.text).join('') ?? '';
                return `<li>${text}</li>`;
            }).join('') ?? '';
            return `<${tag}>${items}</${tag}>`;
        }
        return '';
    }).join('');
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);
    if (!article) return { title: "Article Not Found" };

    return {
        title: `${article.title} | Arti Fiksi Media`,
        description: article.excerpt,
        openGraph: {
            images: [{ url: article.imageUrl }],
        },
    };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const [article, allArticles] = await Promise.all([
        getArticleBySlug(slug),
        getArticles(),
    ]);

    if (!article) return notFound();

    // Related articles: up to 3 others in the same category, excluding current
    const relatedArticles = allArticles
        .filter((a) => a.slug !== slug && a.category === article.category)
        .slice(0, 3);

    // Fallback to latest articles if no related
    const sidebarArticles = relatedArticles.length > 0
        ? relatedArticles
        : allArticles.filter((a) => a.slug !== slug).slice(0, 3);

    const htmlContent = Array.isArray(article.content)
        ? renderRichText(article.content)
        : article.content ?? '';

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title,
        "image": [article.imageUrl],
        "datePublished": article.date,
        "author": [{
            "@type": "Person",
            "name": article.author,
        }]
    };

    return (
        <div className="container mx-auto px-4 py-8 md:px-6">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="grid gap-12 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <div className="mb-6">
                        <span className="text-primary font-bold uppercase tracking-wider text-sm">
                            {article.category}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-bold mt-2 leading-tight">
                            {article.title}
                        </h1>
                        <div className="flex items-center gap-4 text-gray-500 mt-4 text-sm">
                            <span>By {article.author}</span>
                            <span>•</span>
                            <span>{article.date}</span>
                            {article.readingTime && (
                                <>
                                    <span>•</span>
                                    <span>{article.readingTime} min read</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Cover Image */}
                    <div className="aspect-video w-full rounded-lg overflow-hidden mb-8 relative bg-gray-100">
                        <Image
                            src={article.imageUrl}
                            alt={article.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* Article Body */}
                    <article className="prose prose-lg max-w-none text-gray-800">
                        {htmlContent ? (
                            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                        ) : (
                            <p className="text-gray-400 italic">Konten belum tersedia.</p>
                        )}
                    </article>

                    <AdBanner size="medium-rectangle" className="md:hidden my-8" />
                </div>

                {/* Sidebar */}
                <aside className="lg:col-span-1 space-y-8">
                    {/* Ad */}
                    <AdBanner size="medium-rectangle" className="hidden md:flex mx-auto" />

                    {/* Related Articles */}
                    <div>
                        <SectionHeader title="Artikel Terkait" className="mb-4" />
                        <div className="space-y-4">
                            {sidebarArticles.map((a) => (
                                <ArticleCard key={a.id} article={a} />
                            ))}
                        </div>
                    </div>
                </aside>
            </div>

            <AdBanner size="leaderboard" className="mt-12 hidden md:flex" />
        </div>
    );
}
