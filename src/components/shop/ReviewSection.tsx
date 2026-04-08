"use client";

import React from "react";
import Image from "next/image";
import { Star } from "@mui/icons-material";

const MOCK_REVIEWS = [
  {
    id: 1,
    user: "Asif R.",
    rating: 5,
    date: "2 days ago",
    comment: "The structural integrity of these joggers is unmatched. Survived 3 weeks of daily outdoor concrete sprints in Dhaka heat without a single loose thread.",
    isVerified: true,
    images: ["/images/arena_texture_1775667573740.png"] // Reusing existing texture as placeholder
  },
  {
    id: 2,
    user: "Tausif A.",
    rating: 5,
    date: "1 week ago",
    comment: "Finally, a brand that doesn't airbrush the reality of training. The fabric has an honest weight. Fits perfectly once you use the calculator.",
    isVerified: true,
    images: []
  },
  {
    id: 3,
    user: "Sara K.",
    rating: 4,
    date: "2 weeks ago",
    comment: "Excellent breathability for the weight. Looking forward to more color drops.",
    isVerified: true,
    images: ["/images/worn_with_purpose_texture_17756671242255.png"] // Reusing existing texture
  }
];

export function ReviewSection() {
  return (
    <div className="mt-24 border-t border-white/10 pt-24">
      <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
        <div>
          <h2 className="font-structural text-4xl uppercase tracking-tighter mb-4">Evidence of Effort</h2>
          <div className="flex items-center gap-4">
            <div className="flex text-wattle">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} fontSize="small" />)}
            </div>
            <span className="font-structural text-sm uppercase tracking-widest text-gray-400">4.9 Based on 128 Reviews</span>
          </div>
        </div>
        <button className="px-12 py-4 border border-white/20 font-structural text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-bottle-green transition-all">
          Write A Review
        </button>
      </div>

      <div className="grid gap-16">
        {MOCK_REVIEWS.map((review) => (
          <div key={review.id} className="grid md:grid-cols-4 gap-8 pb-16 border-b border-white/5 last:border-0">
            <div className="md:col-span-1">
              <div className="flex flex-col gap-2">
                <span className="font-structural text-sm uppercase tracking-widest text-white">{review.user}</span>
                {review.isVerified && (
                  <span className="font-structural text-[10px] uppercase tracking-widest text-wattle bg-wattle/10 w-fit px-2 py-1">Verified Purchase</span>
                )}
                <span className="font-editorial text-xs text-gray-500 mt-2">{review.date}</span>
              </div>
            </div>
            <div className="md:col-span-3">
              <div className="flex text-wattle mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} fontSize="inherit" className={s <= review.rating ? "text-wattle" : "text-white/10"} />
                ))}
              </div>
              <p className="font-editorial text-lg text-gray-300 leading-relaxed mb-8">
                "{review.comment}"
              </p>
              
              {review.images.length > 0 && (
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
                  {review.images.map((img, idx) => (
                    <div key={idx} className="relative w-40 aspect-square bg-dark-slate border border-white/10 shrink-0 group overflow-hidden">
                      <Image 
                        src={review.images[0]} // Using index 0 for placeholder
                        alt={`Customer review image ${idx}`}
                        fill
                        className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-700 grayscale"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
