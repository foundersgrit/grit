"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star, Verified, ThumbUpAltOutlined } from "@mui/icons-material";
import { query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { reviewsRef } from "@/lib/firebase/collections";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/providers/ToastProvider";
import { motion, AnimatePresence } from "framer-motion";

interface Review {
  id: string;
  user: string;
  rating: number;
  date: any;
  comment: string;
  isVerified: boolean;
  images: string[];
  helpful: number;
}

interface ReviewSectionProps {
  productId: string;
}

export function ReviewSection({ productId }: ReviewSectionProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  // Sync reviews
  useEffect(() => {
    const q = query(
      reviewsRef,
      where("productId", "==", productId),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Format date from Firestore timestamp
        date: doc.data().date?.toDate().toLocaleDateString() || "Just now"
      })) as Review[];
      setReviews(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [productId]);

  const handleSubmitReview = async () => {
    if (!user) {
      showToast("Access Denied. Login to provide evidence.");
      return;
    }
    if (!newReview.comment.trim()) {
      showToast("Commentary required.");
      return;
    }

    try {
      await addDoc(reviewsRef, {
        productId,
        userId: user.uid,
        user: user.displayName || "Anonymous Operative",
        rating: newReview.rating,
        comment: newReview.comment,
        date: serverTimestamp(),
        isVerified: true, // Simplified for this implementation
        images: [],
        helpful: 0
      });
      showToast("Evidence logged successfully.");
      setIsFormOpen(false);
      setNewReview({ rating: 5, comment: "" });
    } catch (err) {
      console.error(err);
      showToast("Telemetry failure. Try again.");
    }
  };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div className="mt-24 border-t border-white/10 pt-24 bg-bottle-green">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          <div className="space-y-4">
            <h2 className="font-structural text-4xl uppercase tracking-tighter">Evidence of Effort</h2>
            <div className="flex items-center gap-6">
              <div className="flex text-wattle">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} fontSize="small" className={s <= parseFloat(avgRating) ? "text-wattle" : "text-white/10"} />
                ))}
              </div>
              <span className="font-structural text-sm uppercase tracking-widest text-gray-500">
                {avgRating} Based on {reviews.length} Reviews
              </span>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setIsFormOpen(true)}
            className="px-12 py-6 border-white/10 hover:border-wattle hover:text-wattle"
          >
            Log Evidence
          </Button>
        </div>

        {reviews.length === 0 ? (
          <div className="py-24 border-y border-white/5 text-center">
             <p className="font-editorial text-gray-400 italic mb-8 max-w-lg mx-auto">
               Be the first to provide evidence in this arena. No airbrushing, no shortcuts — just the work.
             </p>
          </div>
        ) : (
          <div className="grid gap-16">
            {reviews.map((review) => (
              <div key={review.id} className="grid md:grid-cols-4 gap-8 pb-16 border-b border-white/5 last:border-0">
                <div className="md:col-span-1">
                  <div className="flex flex-col gap-3">
                    <span className="font-structural text-sm uppercase tracking-widest text-white">{review.user}</span>
                    <div className="flex items-center gap-2">
                       <Verified sx={{ fontSize: 12 }} className="text-wattle" />
                       <span className="font-structural text-[10px] uppercase tracking-widest text-gray-500">Verified Combatant</span>
                    </div>
                    <span className="font-editorial text-xs text-gray-500 mt-2">{review.date}</span>
                  </div>
                </div>
                <div className="md:col-span-3">
                  <div className="flex text-wattle mb-6 gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} sx={{ fontSize: 14 }} className={s <= review.rating ? "text-wattle" : "text-white/10"} />
                    ))}
                  </div>
                  <p className="font-editorial text-lg text-gray-300 leading-relaxed max-w-3xl mb-8">
                    &quot;{review.comment}&quot;
                  </p>
                  
                  <div className="flex items-center gap-6 mt-12">
                     <button className="flex items-center gap-2 group text-[10px] uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
                        <ThumbUpAltOutlined sx={{ fontSize: 14 }} className="group-hover:text-wattle" />
                        Helpful ({review.helpful})
                     </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Submission Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-dark-slate border border-white/10 p-12"
            >
               <h2 className="font-structural text-3xl uppercase tracking-tighter mb-8">Log Evidence</h2>
               <div className="space-y-8">
                 <div>
                   <label className="font-structural text-[10px] uppercase tracking-widest text-gray-500 mb-4 block">Rating</label>
                   <div className="flex gap-2">
                     {[1,2,3,4,5].map(s => (
                       <button 
                        key={s} 
                        onClick={() => setNewReview({...newReview, rating: s})}
                        className={`p-2 transition-all ${newReview.rating >= s ? "text-wattle" : "text-white/10 hover:text-white/30"}`}
                       >
                         <Star />
                       </button>
                     ))}
                   </div>
                 </div>
                 
                 <div>
                   <label className="font-structural text-[10px] uppercase tracking-widest text-gray-500 mb-4 block">Commentary</label>
                   <textarea 
                    autoFocus
                    value={newReview.comment}
                    onChange={e => setNewReview({...newReview, comment: e.target.value})}
                    placeholder="Provide your experience. Be honest. Survival notes, fit analysis, or durability reports."
                    className="w-full bg-white/5 border border-white/10 p-6 font-editorial text-white focus:outline-none focus:border-wattle min-h-[150px] resize-none"
                   />
                 </div>

                 <div className="flex gap-4 pt-12">
                   <Button variant="primary" className="flex-1 py-6" onClick={handleSubmitReview}>Submit Log</Button>
                   <Button variant="outline" className="px-12" onClick={() => setIsFormOpen(false)}>Abort</Button>
                 </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
