"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "rect" | "circle";
}

export function Skeleton({ className = "", variant = "rect" }: SkeletonProps) {
  return (
    <div 
      className={`animate-pulse bg-white/5 ${variant === "circle" ? "rounded-full" : "rounded-none"} ${className}`} 
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <Skeleton className="aspect-[4/5] w-full" />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
}

export function PDPDetailSkeleton() {
  return (
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start w-full">
      <Skeleton className="aspect-[4/5] w-full" />
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-8 w-1/4" />
        </div>
        <Skeleton className="h-32 w-full" />
        <div className="flex flex-col gap-6 pt-12">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </div>
  );
}
