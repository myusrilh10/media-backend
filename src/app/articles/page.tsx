import ArticleCard from "@/components/ui/ArticleCard";
import AdBanner from "@/components/ui/AdBanner";
import { getArticles } from "@/lib/api";

export const metadata = {
    title: "Latest Articles | Arti Fiksi Media",
    description: "Temukan artikel terbaru seputar teknologi, gaya hidup, fashion, dan budaya pop.",
};

export default async function ArticlesIndexPage() {
    const articles = await getArticles();

    // Group articles by their main category
    const articlesByCategory = articles.reduce((acc, article) => {
        const category = article.mainCategory || article.category || "Uncategorized";
        if (!acc[category]) acc[category] = [];
        acc[category].push(article);
        return acc;
    }, {} as Record<string, typeof articles>);

    const categories = Object.keys(articlesByCategory);

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-16 md:px-6">

                <div className="mb-16 text-center max-w-2xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-black font-montserrat-black mb-4 tracking-tighter uppercase">
                        Stories
                    </h1>
                    <p className="text-gray-500 text-sm md:text-base">
                        Explore the latest from our writers across technology, lifestyle, and culture.
                    </p>
                </div>

                {categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                        <p className="text-lg font-semibold">Belum ada artikel yang dipublikasikan.</p>
                    </div>
                ) : (
                    <div className="space-y-24">
                        {categories.map((category, index) => (
                            <section key={category} className="relative">
                                <div className="flex items-end justify-between mb-10 border-b border-black/10 pb-4">
                                    <h2 className="text-3xl md:text-4xl font-playfair text-black">
                                        {category}
                                    </h2>
                                    <span className="text-xs font-black font-montserrat-black uppercase tracking-widest text-gray-400 hidden md:block">
                                        0{index + 1} /
                                    </span>
                                </div>

                                <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                                    {articlesByCategory[category].map((article) => (
                                        <div key={article.id} className="h-full">
                                            <ArticleCard article={article} />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}

                <div className="mt-24">
                    <AdBanner size="leaderboard" className="hidden md:flex" />
                    <AdBanner size="medium-rectangle" className="md:hidden" />
                </div>
            </div>
        </div>
    );
}
