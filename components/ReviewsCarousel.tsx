'use client';

import { useState, useEffect } from 'react';
import portfolioData from './portfolioData.json';

interface ReviewsCarouselProps {
  isDark: boolean;
  textSecondary: string;
  textPrimary: string;
}

export default function ReviewsCarousel({ isDark, textSecondary, textPrimary }: ReviewsCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const reviews = portfolioData.reviews;

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, reviews.length]);

  const goTo = (index: number) => {
    setCurrent(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 10000);
  };

  const next = () => {
    setCurrent((prev) => (prev + 1) % reviews.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 10000);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 10000);
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="overflow-hidden rounded-3xl">
        <div 
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {reviews.map((review) => (
            <div
              key={review.id}
              className="w-full flex-shrink-0 px-4"
            >
              <div className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white/80 border-gray-200'} backdrop-blur-sm p-12 rounded-3xl border shadow-xl`}>
                <div className="flex items-center gap-2 mb-6">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-6 h-6 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className={`text-xl ${textPrimary} mb-6 leading-relaxed italic`}>
                  "{review.reviewText}"
                </p>

                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl`}>
                    {review.companyName.charAt(0)}
                  </div>
                  <div>
                    <div className={`font-bold ${textPrimary}`}>{review.companyName}</div>
                    <div className={`text-sm ${textSecondary}`}>Klient DesignStron.pl</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={prev}
        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-gray-100'} rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 z-10`}
        aria-label="Previous review"
      >
        <svg className={`w-6 h-6 ${textPrimary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={next}
        className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-gray-100'} rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 z-10`}
        aria-label="Next review"
      >
        <svg className={`w-6 h-6 ${textPrimary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="flex justify-center gap-2 mt-8">
        {reviews.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`h-2 rounded-full transition-all ${
              current === index
                ? 'w-8 bg-gradient-to-r from-blue-500 to-purple-500'
                : isDark
                ? 'w-2 bg-slate-700 hover:bg-slate-600'
                : 'w-2 bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to review ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}