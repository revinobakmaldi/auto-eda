"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

interface SectionHeaderProps {
  badge: string;
  title: string;
  subtitle?: string;
  id?: string;
}

export function SectionHeader({ badge, title, subtitle, id }: SectionHeaderProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="mb-8"
      id={id}
    >
      <span className="mb-3 inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-xs text-primary">
        {badge}
      </span>
      <h2 className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-sm text-gray-400">{subtitle}</p>
      )}
    </motion.div>
  );
}
