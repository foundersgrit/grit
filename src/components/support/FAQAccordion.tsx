"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

const FAQ_DATA: FAQCategory[] = [
  {
    title: "Orders & Shipping",
    items: [
      {
        question: "What are your delivery times for Dhaka?",
        answer: "Standard delivery within Dhaka Metro zones takes 2-3 business days. We use dedicated local couriers to ensure your gear arrives ready for work."
      },
      {
        question: "Do you ship internationally?",
        answer: "Yes. We ship to a global community of strivers. International shipping typically takes 7-14 business days depending on your location."
      },
      {
        question: "How can I track my order?",
        answer: "Once your gear leaves our facility, you'll receive a tracking link via email and WhatsApp. You can also view real-time status in your Account dashboard."
      }
    ]
  },
  {
    title: "Sizing & Fit",
    items: [
      {
        question: "How do GRIT products fit?",
        answer: "Our gear follows an athletic, structural fit designed for movement. If you prefer a more relaxed silhouette, we recommend sizing up. Refer to our interactive Size Guide on any product page."
      },
      {
        question: "Can I exchange for a different size?",
        answer: "Yes. If the fit isn't right, you can initiate an exchange within 14 days of delivery. The gear must be in its original, unworn condition."
      }
    ]
  },
  {
    title: "Product Care & Durability",
    items: [
      {
        question: "How should I wash my GRIT gear?",
        answer: "To maintain structural integrity, wash cold and air dry. Avoid bleach and high-heat drying, which can break down technical fibres over time."
      },
      {
        question: "What makes your gear more durable?",
        answer: "We use high-density weaves, triple-reinforced stitching at failure points, and abrasive-resistant fabrics. Every piece is built for repetition, not replacement."
      }
    ]
  },
  {
    title: "Payments",
    items: [
      {
        question: "How do I pay via bKash or Nagad?",
        answer: "Select your preferred provider at checkout. You'll be shown our merchant number. Send the total amount, then enter your Transaction ID in the checkout portal. We'll verify and confirm your order shortly."
      },
      {
        question: "Is Cash on Delivery available?",
        answer: "COD is available for all addresses within Dhaka Metro. For international orders or locations outside the city, we require secured digital payment."
      }
    ]
  }
];

function AccordionItem({ question, answer }: FAQItem) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/5 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left group"
      >
        <span className={`font-structural text-lg uppercase tracking-tight transition-colors ${isOpen ? "text-wattle" : "text-white group-hover:text-gray-300"}`}>
          {question}
        </span>
        <span className={`text-wattle transition-transform duration-300 ${isOpen ? "rotate-45" : "rotate-0"}`}>
          +
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="font-editorial text-gray-400 pb-8 leading-relaxed max-w-3xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQAccordion() {
  return (
    <div className="space-y-16">
      {FAQ_DATA.map((category) => (
        <div key={category.title}>
          <h2 className="font-structural text-sm tracking-[0.2em] uppercase text-gray-500 mb-8 border-b border-white/10 pb-4">
            {category.title}
          </h2>
          <div className="flex flex-col">
            {category.items.map((item, idx) => (
              <AccordionItem key={idx} {...item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
