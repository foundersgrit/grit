"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center p-12 bg-white/5 border border-dashed border-white/10"
    >
      <div className="text-wattle mb-6 scale-[2]">
        {icon}
      </div>
      <h3 className="font-structural text-2xl uppercase tracking-tighter text-white mb-4">
        {title}
      </h3>
      <p className="font-editorial text-gray-400 max-w-sm mb-12">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button variant="primary" className="px-12 py-6">
            {actionLabel}
          </Button>
        </Link>
      )}
    </motion.div>
  );
}
