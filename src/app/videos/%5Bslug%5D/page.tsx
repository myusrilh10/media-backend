import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, CalendarDays, Play } from "lucide-react";
import AdBanner from "@/components/ui/AdBanner";
import VideoCard from "@/components/ui/VideoCard";
import { getVideoBySlug, getVideos } from "@/lib/api";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const video = await getVideoBySlug(slug);
    if (!video) return { title: "Video Not Found" };

    return {
        title: `${video.title} | Arti Fiksi Media`,
        description: `Watch ${video.title} on Arti Fiksi Media.`,
    };
}

export default async function VideoDetailPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const video = await getVideoBySlug(params.slug);

    if (!video) {
        notFound();
    }

    const allVideos = await getVideos();
    const relatedVideos = allVideos.filter((v) => v.id !== video.id).slice(0, 3);

    // Convert regular YouTube URL to embed URL
    const getEmbedUrl = (url: string) => {
        if (url.includes('youtube.com/watch?v=')) {
            return url.replace('watch?v=', 'embed/');
        }
        if (url.includes('youtu.be/')) {
            const id = url.split('youtu.be/')[1];
            return `https://www.youtube.com/embed/${id}`;
        }
        return url;
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Top Ad */}
            <div className="container mx-auto px-4 py-8">
                <AdBanner size="leaderboard" className="hidden md:flex" />
            </div>

            <main className="container mx-auto px-4 pb-16 md:px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Back Link */}
                    <Link
                        href="/videos"
                        className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500 hover:text-black transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Videos
                    </Link>

                    {/* Header */}
                    <header className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="bg-[#e7fe41] text-[#203627] px-3 py-1 text-[10px] md:text-xs font-black font-montserrat-black uppercase tracking-widest">
                                {video.category}
                            </span>
                            <div className="flex items-center gap-4 text-gray-500 text-xs font-medium uppercase tracking-wider">
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" />
                                    {video.duration}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <CalendarDays className="w-4 h-4" />
                                    {video.date}
                                </span>
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black font-montserrat-black leading-[1.15] md:leading-[1.1] tracking-tight text-black mb-6">
                            {video.title}
                        </h1>
                    </header>

                    {/* Video Player */}
                    <div className="aspect-video w-full bg-gray-900 rounded-2xl overflow-hidden shadow-2xl mb-12 relative flex items-center justify-center">
                        {video.videoUrl.includes('youtube.com') || video.videoUrl.includes('youtu.be') ? (
                            <iframe
                                src={getEmbedUrl(video.videoUrl)}
                                title={video.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full border-0 absolute inset-0"
                            />
                        ) : (
                            <div className="text-center text-white">
                                <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p className="font-medium text-gray-400">Video player not available for this source.</p>
                                <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="text-[#e7fe41] hover:underline mt-4 inline-block font-bold">Watch externally</a>
                            </div>
                        )}
                    </div>

                    {/* Description area placeholder if they had description */}
                    <div className="prose prose-lg max-w-none prose-a:text-[#e7fe41] mb-16">
                        <p className="text-gray-600 leading-relaxed text-lg">
                            Watch our latest coverage of <strong>{video.title}</strong>, showcasing detailed insights, brilliant cinematography, and an exclusive look at the underlying stories. Stick around to explore more about our cultural deep dives and city tours.
                        </p>
                    </div>

                    {/* Related Videos */}
                    {relatedVideos.length > 0 && (
                        <div className="mt-20 border-t border-gray-100 pt-16">
                            <h2 className="text-2xl font-black font-montserrat-black tracking-tight mb-8">
                                More Videos
                            </h2>
                            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                {relatedVideos.map((related) => (
                                    <VideoCard key={related.id} video={related} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
