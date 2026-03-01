'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Article {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    author: string;
    date: string;
    imageUrl: string;
    slug: string;
}

interface HeroCarouselProps {
    articles: Article[];
}

export default function HeroCarousel({ articles }: HeroCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, [articles.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
    }, [articles.length]);

    // Auto-advance
    useEffect(() => {
        const timer = setInterval(nextSlide, 6000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    if (!articles.length) return null;

    return (
        <div className="w-full pb-4 md:pb-8 group">
            <div className="relative w-full overflow-hidden">
                {/* Dummy element to set proportional height based on the slide's desired aspect ratio and safe min-heights to prevent text cutoff */}
                <div className="w-[85%] md:w-[80%] lg:w-[75%] aspect-[16/9] md:aspect-[21/9] lg:aspect-[24/9] min-h-[400px] md:min-h-[450px] lg:min-h-[500px] mx-auto pointer-events-none opacity-0" />

                <div className="absolute top-2 bottom-2 left-0 right-0 flex justify-center items-center">
                    {articles.map((article, idx) => {
                        const isActive = idx === currentIndex;
                        const isPrev = idx === (currentIndex - 1 + articles.length) % articles.length;
                        const isNext = idx === (currentIndex + 1) % articles.length;
                        const isHidden = !isActive && !isPrev && !isNext;

                        if (isHidden && articles.length > 3) return null; // Only render active, prev, next to save memory if many slides

                        // Calculate translation based on role
                        // Active is in center (0)
                        // Prev is skewed left
                        // Next is skewed right
                        let xOffset = "0%";
                        let scale = 1;
                        let opacity = 1;
                        let zIndex = 20;

                        if (isPrev) {
                            xOffset = "-85%";
                            scale = 0.85;
                            opacity = 0.5;
                            zIndex = 10;
                        } else if (isNext) {
                            xOffset = "85%";
                            scale = 0.85;
                            opacity = 0.5;
                            zIndex = 10;
                        }

                        return (
                            <motion.div
                                key={article.id}
                                initial={false}
                                animate={{ x: xOffset, scale, opacity, zIndex }}
                                transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                                className="absolute w-[85%] md:w-[80%] lg:w-[75%] h-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-gray-900 cursor-pointer"
                                onClick={() => {
                                    if (isPrev) prevSlide();
                                    if (isNext) nextSlide();
                                }}
                            >
                                {article.imageUrl ? (
                                    <Image
                                        src={article.imageUrl}
                                        alt={article.title}
                                        fill
                                        priority={isActive}
                                        className={`object-cover transition-transform duration-[8000ms] ease-out ${isActive ? 'scale-100 group-hover:scale-[1.02]' : 'scale-100'}`}
                                        sizes="(max-width: 768px) 85vw, 75vw"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-linear-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                        <span className="text-gray-700 font-bold text-4xl opacity-20">ARTI FIKSI</span>
                                    </div>
                                )}

                                {/* Cinematic Gradient Overlays */}
                                <div className="absolute inset-0 bg-linear-to-t from-black/[0.92] via-black/60 to-black/10" />
                                <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/20 to-transparent" />

                                {/* Content */}
                                <div className={`absolute inset-0 flex items-end p-5 md:p-10 lg:p-14 z-20 transition-opacity duration-700 ${isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                                    <div className="max-w-4xl w-full">
                                        <div className="space-y-3 md:space-y-4 lg:space-y-5">
                                            <div className="flex items-center flex-wrap gap-3">
                                                {article.category && (
                                                    <span className="inline-block bg-[#e7fe41] text-[#203627] text-[10px] md:text-xs font-black font-montserrat-black px-3 py-1.5 uppercase tracking-widest rounded-sm shadow-lg">
                                                        {article.category}
                                                    </span>
                                                )}
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[#e7fe41] text-[10px] md:text-xs font-black font-montserrat-black uppercase tracking-wider">
                                                        By {article.author}
                                                    </span>
                                                    <span className="text-gray-400 text-xs">•</span>
                                                    <span className="text-gray-300 text-[10px] md:text-xs font-medium tracking-wide uppercase">
                                                        {article.date}
                                                    </span>
                                                </div>
                                            </div>

                                            <h2 className="font-playfair text-2xl md:text-4xl lg:text-5xl font-black text-white leading-[1.1] md:leading-[1.05] tracking-tight drop-shadow-2xl max-w-3xl">
                                                <Link href={`/articles/${article.slug}`} className="hover:text-[#e7fe41] transition-colors duration-300 line-clamp-2 md:line-clamp-3">
                                                    {article.title}
                                                </Link>
                                            </h2>

                                            <p className="text-gray-300 text-xs md:text-sm lg:text-base line-clamp-2 max-w-2xl leading-relaxed drop-shadow-md font-medium mt-2 md:mt-3">
                                                {article.excerpt}
                                            </p>

                                            <div className="pt-3 md:pt-4">
                                                <Link
                                                    href={`/articles/${article.slug}`}
                                                    className="inline-flex items-center gap-2 text-white font-bold font-montserrat-black uppercase tracking-widest text-[10px] md:text-xs bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 hover:bg-[#e7fe41] hover:text-[#203627] hover:border-[#e7fe41] transition-all duration-300 rounded-full"
                                                >
                                                    Read Full Story <ArrowRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
                {/* Side Navigation Buttons (Only visible on hover) */}
                <div className="hidden md:flex absolute inset-y-0 left-0 items-center justify-start z-30 px-6 pointer-events-none">
                    <button
                        onClick={prevSlide}
                        className="p-4 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 hover:bg-[#e7fe41] hover:text-[#203627] hover:border-[#e7fe41] transition-all duration-300 pointer-events-auto opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                </div>
                <div className="hidden md:flex absolute inset-y-0 right-0 items-center justify-end z-30 px-6 pointer-events-none">
                    <button
                        onClick={nextSlide}
                        className="p-4 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 hover:bg-[#e7fe41] hover:text-[#203627] hover:border-[#e7fe41] transition-all duration-300 pointer-events-auto opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Mobile / Bottom Navigation Controls */}
            <div className="flex items-center justify-center gap-6 mt-6 md:mt-8 px-4">
                <button
                    onClick={prevSlide}
                    className="p-2 md:p-3 rounded-full bg-white text-[#203627] border border-gray-200 shadow-sm hover:bg-[#e7fe41] hover:shadow-md transition-all duration-300"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </button>

                <div className="flex gap-2.5 items-center">
                    {articles.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`rounded-full transition-all duration-300 ${currentIndex === idx
                                    ? 'w-6 h-2 md:w-8 md:h-2.5 bg-[#203627]'
                                    : 'w-2 h-2 md:w-2.5 md:h-2.5 bg-gray-300 hover:bg-gray-400'
                                }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>

                <button
                    onClick={nextSlide}
                    className="p-2 md:p-3 rounded-full bg-white text-[#203627] border border-gray-200 shadow-sm hover:bg-[#e7fe41] hover:shadow-md transition-all duration-300"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </button>
            </div>
        </div>
    );
}

