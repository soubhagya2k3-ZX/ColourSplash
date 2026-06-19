import React, { useState } from "react";
import { m as motion, AnimatePresence } from "motion/react";
import { viewportConfig } from "../utils/animations";
import { ChevronDown } from "lucide-react";
import { useFetchData } from "../hooks/useFetchData";
import { getFaqs } from "../services/api";

const FAQItem = ({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white/95 shadow-sm hover:shadow-md transition-shadow">
      <button
        className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <h4 className="font-semibold text-slate-900 text-lg pr-4">
          {question}
        </h4>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600"
          aria-hidden="true"
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] }}
            role="region"
            aria-label={question}
          >
            <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 mt-2 pt-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const { data: faqs, loading } = useFetchData<any[]>(getFaqs, []);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="cv-skip py-24 px-6 bg-transparent relative overflow-hidden"
    >
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            className="px-4 py-2 rounded-full bg-orange-100 text-orange-600 font-medium text-sm inline-block mb-4"
          >
            Got Questions?
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold font-heading text-slate-900 mb-6"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600"
          >
            Everything you need to know about working with Colour Splash Studio.
          </motion.p>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4 ">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-slate-200 rounded-2xl w-full" />
              ))}
            </div>
          ) : (
            faqs?.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{ delay: index * 0.1 }}
              >
                <FAQItem
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === index}
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default React.memo(FAQ);
