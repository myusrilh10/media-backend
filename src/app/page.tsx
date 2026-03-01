import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, TrendingUp, ArrowRight } from "lucide-react";

import SectionHeader from "@/components/ui/SectionHeader";
import ArticleCard from "@/components/ui/ArticleCard";
import AdBanner from "@/components/ui/AdBanner";
import HeroCarousel from "@/components/ui/HeroCarousel";
import VideoCard from "@/components/ui/VideoCard";

import { getArticles, getEvents, getVideos } from "@/lib/api";

export default async function Home() {
  // Parallel fetch for better performance
  const [articles, events, videos] = await Promise.all([
    getArticles(),
    getEvents(),
    getVideos()
  ]);

  // Hero carousel — first 3 articles from Strapi
  const carouselArticles = articles.slice(0, 3);

  // One featured article per main category
  const lensaLokalArticle = articles.find((a) => a.mainCategory === "Lensa Lokal");
  const lifestyleArticle = articles.find((a) => a.mainCategory === "Lifestyle");
  const publicInterestArticle = articles.find((a) => a.mainCategory === "Public Interest")
    ?? articles.find((a) => a.mainCategory === "News"); // fallback for "News" category

  // Trending — is_trending flag first, then latest
  const trendingArticles = [
    ...articles.filter((a) => a.isTrending),
    ...articles.filter((a) => !a.isTrending),
  ].slice(0, 4);

  // Featured Videos
  const homepageVideos = videos.slice(0, 3);

  // Upcoming Events
  const homepageEvents = events.slice(0, 4);

  return (
    <div className="py-6 md:py-8">

      {/* Top Ad Banner */}
      <div className="container mx-auto px-4 md:px-6 mb-8">
        <AdBanner size="large-leaderboard" />
      </div>

      {/* Hero Carousel — Full Width */}
      <section className="mb-12 w-full">
        <HeroCarousel articles={carouselArticles} />
      </section>

      <div className="container mx-auto px-4 md:px-6">

        {/* Newest Articles by Category */}
        <section className="mb-24">
          <SectionHeader title="Newest Article" subtitle="Ikuti perkembangan terkini" className="mb-12" />
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#203627]/20">

            {/* Lensa Lokal */}
            <div className="space-y-6 md:pr-8 py-8 md:py-0">
              <Link href="/categories/lensa-lokal" className="block group">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[#203627]/15">
                  <span className="w-1 h-6 bg-lemon-lime flex-shrink-0" />
                  <h2 className="font-black font-montserrat-black text-xl uppercase tracking-[0.08em] text-[#203627] group-hover:text-[#203627]/60 transition-colors">
                    Lensa Lokal
                  </h2>
                </div>
              </Link>
              <div className="space-y-8">
                {lensaLokalArticle && <ArticleCard article={lensaLokalArticle} />}
              </div>
            </div>

            {/* Lifestyle */}
            <div className="space-y-6 md:px-8 py-8 md:py-0">
              <Link href="/categories/lifestyle" className="block group">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[#203627]/15">
                  <span className="w-1 h-6 bg-lemon-lime flex-shrink-0" />
                  <h2 className="font-black font-montserrat-black text-xl uppercase tracking-[0.08em] text-[#203627] group-hover:text-[#203627]/60 transition-colors">
                    Lifestyle
                  </h2>
                </div>
              </Link>
              <div className="space-y-8">
                {lifestyleArticle && <ArticleCard article={lifestyleArticle} />}
              </div>
            </div>

            {/* Public Interest / News */}
            <div className="space-y-6 md:pl-8 py-8 md:py-0">
              <Link href="/categories/public-interest" className="block group">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[#203627]/15">
                  <span className="w-1 h-6 bg-lemon-lime flex-shrink-0" />
                  <h2 className="font-black font-montserrat-black text-xl uppercase tracking-[0.08em] text-[#203627] group-hover:text-[#203627]/60 transition-colors">
                    Public Interest
                  </h2>
                </div>
              </Link>
              <div className="space-y-8">
                {publicInterestArticle && <ArticleCard article={publicInterestArticle} />}
              </div>
            </div>

          </div>
        </section>

        {/* Trending + Ad */}
        <div className="grid lg:grid-cols-12 gap-12 mb-24">
          <div className="lg:col-span-8">
            <div className="bg-gray-50/80 p-8 rounded-2xl border border-gray-100 h-full">
              <div className="flex items-center gap-3 mb-8 pb-5 border-b border-gray-200">
                <span className="w-1 h-7 bg-lemon-lime flex-shrink-0" />
                <div className="flex items-center gap-2 text-[#203627]">
                  <TrendingUp className="w-5 h-5" />
                  <h3 className="font-black font-montserrat-black uppercase tracking-[0.08em] text-xl leading-none">
                    Trending Now<span className="text-lemon-lime">.</span>
                  </h3>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
                {trendingArticles.map((article, idx) => (
                  <Link key={article.id} href={`/articles/${article.slug}`} className="flex gap-4 group items-start">
                    <span className="text-[2.5rem] font-black font-montserrat-black text-gray-200 group-hover:text-lemon-lime transition-colors duration-200 tabular-nums leading-none select-none">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-lg overflow-hidden hidden sm:block">
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="pt-1">
                      <span className="text-[10px] font-bold font-montserrat-black uppercase tracking-[0.15em] text-[#203627]/50 mb-1.5 block">
                        {article.category}
                      </span>
                      <h4 className="text-[15px] font-bold font-playfair text-gray-900 leading-snug group-hover:text-[#203627]/60 transition-colors line-clamp-3">
                        {article.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex items-center justify-center">
            <AdBanner size="medium-rectangle" className="w-full h-full my-0" />
          </div>
        </div>

        {/* Upcoming Events */}
        {homepageEvents.length > 0 && (
          <section className="mb-24">
            <div className="flex items-center justify-between mb-10">
              <SectionHeader title="Upcoming Events" subtitle="Jangan lewatkan momen seru" className="mb-0" />
              <Link href="/events" className="hidden md:flex items-center gap-2 text-[11px] font-black font-montserrat-black text-[#203627] uppercase tracking-[0.12em] hover:text-lemon-lime hover:translate-x-1 transition-all duration-200">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {homepageEvents.map((event) => (
                <Link key={event.id} href={`/events/${event.slug}`} className="block group">
                  <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-lemon-lime text-[#203627] text-[10px] font-black font-montserrat-black px-2.5 py-1 uppercase tracking-[0.1em]">
                          {event.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h4 className="font-playfair font-bold text-[#203627] leading-snug mb-2.5 line-clamp-2 group-hover:text-[#203627]/70 transition-colors text-base flex-grow">
                        {event.title}
                      </h4>
                      <div className="space-y-1.5 mt-auto">
                        <div className="flex items-center gap-2 text-gray-500 text-[11px] font-medium uppercase tracking-wider">
                          <Calendar className="w-3 h-3 text-lemon-lime flex-shrink-0" />
                          {event.date}
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-[11px] font-medium truncate">
                          <MapPin className="w-3 h-3 text-gray-300 flex-shrink-0" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Featured Videos */}
        {homepageVideos.length > 0 && (
          <section className="mb-24">
            <div className="flex items-center justify-between mb-10">
              <SectionHeader title="Featured Videos" subtitle="Tonton tayangan eksklusif kami" className="mb-0" />
              <Link href="/videos" className="hidden md:flex items-center gap-2 text-[11px] font-black font-montserrat-black text-[#203627] uppercase tracking-[0.12em] hover:text-lemon-lime hover:translate-x-1 transition-all duration-200">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {homepageVideos.map((video) => (
                <div key={video.id} className="h-[300px]">
                  <VideoCard video={video} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom Ad */}
        <AdBanner size="large-leaderboard" className="hidden lg:flex mt-4 mb-4" />

      </div>
    </div>
  );
}
