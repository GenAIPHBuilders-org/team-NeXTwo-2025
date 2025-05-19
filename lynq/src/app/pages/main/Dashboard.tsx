"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  CreditCard,
  DollarSign,
  LineChart,
  PiggyBank,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CardBudget from "./cards/CardBudget";
import CardCashFlow from "./cards/CardCashFlow";
import CardSavings from "./cards/CardSavings";
import CardInsights from "./cards/CardInsights";

const cardConfigs = [
  {
    key: "budget",
    title: "Budget Overview",
    description: "Track your monthly spending against budget",
    component: CardBudget,
    icon: CreditCard,
  },
  {
    key: "savings",
    title: "Savings Goals",
    description: "Monitor progress toward your financial goals",
    component: CardSavings,
    icon: PiggyBank,
  },
  {
    key: "cashflow",
    title: "Cash Flow",
    description: "Visualize your income and expenses",
    component: CardCashFlow,
    icon: DollarSign,
  },
  {
    key: "insights",
    title: "Financial Insights",
    description: "AI-powered recommendations for your finances",
    component: CardInsights,
    icon: LineChart,
  },
];

export default function Dashboard() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const router = useRouter(); // Initialize router

  const user = {
    name: "Juan Dela Cruz",
    email: "juan.delacruz@example.com",
    age: 40,
    maritalStatus: "Married",
    dependents: 2,
    location: "Makati, Metro Manila",
    jobTitle: "Mid-level IT Manager",
  };

  const handleCardClick = (cardKey: string) => {
    // Only open modal for cards other than insights
    if (cardKey !== "insights") {
      setActiveCard(cardKey);
      setModalOpen(true);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
    hover: {
      y: -5,
      boxShadow:
        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17,
      },
    },
    tap: { scale: 0.98 },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      y: 50,
      scale: 0.9,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Back Button */}
      <div className="px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => router.push("/")}
          className="cursor-pointer inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition"
        >
          ← Back to Home
        </button>
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, {user.name.split(" ")[0]}
          </h2>
          <p className="text-slate-500">
            Here's an overview of your financial health
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {cardConfigs.map((card, index) => {
            const CardComponent = card.component;
            const Icon = card.icon;

            // Determine column span based on index:
            // First two cards → 1 column each (in the first row)
            // Remaining cards → span both columns (full width)
            const isFullWidth = index >= 2;
            const columnSpanClass = isFullWidth ? "col-span-2" : "";

            if (card.key === "insights") {
              return (
                <motion.div
                  key={card.key}
                  variants={cardVariants}
                  custom={index}
                  layout
                  className={columnSpanClass}
                >
                  <CardComponent />
                </motion.div>
              );
            }

            return (
              <motion.div
                key={card.key}
                className={`bg-white rounded-lg border border-slate-200 overflow-hidden cursor-pointer min-h-[320px] flex flex-col ${columnSpanClass}`}
                onClick={() => handleCardClick(card.key)}
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
                custom={index}
                layout
              >
                <div className="p-6 pb-2">
                  <div className="flex items-center justify-between">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        delay: 0.2 + index * 0.1,
                      }}
                    >
                      <Icon className="h-5 w-5 text-slate-500" />
                    </motion.div>
                    <motion.button
                      className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center"
                      whileHover={{ backgroundColor: "rgb(241 245 249)" }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </motion.button>
                  </div>
                  <motion.h3
                    className="text-base font-medium mt-2 text-slate-900"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    {card.title}
                  </motion.h3>
                  <motion.p
                    className="text-xs text-slate-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    {card.description}
                  </motion.p>
                </div>
                <motion.div
                  className="p-6 pt-3 flex-grow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="h-[200px] w-full">
                    <CardComponent preview />
                  </div>
                </motion.div>
                <div className="p-6 pt-2 flex justify-end">
                  <motion.button
                    className="text-sm px-4 py-2 rounded hover:bg-slate-100 text-slate-700 font-medium"
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgb(241 245 249)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Details
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </main>

      {/* Modal for detailed view (only for non-insights cards) */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setModalOpen(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
              <motion.div
                className="relative bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-auto m-4"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="flex items-center justify-between p-4 border-b">
                  <div>
                    <motion.h3
                      className="text-lg font-medium text-slate-900"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {activeCard
                        ? cardConfigs.find((c) => c.key === activeCard)?.title
                        : ""}
                    </motion.h3>
                    <motion.p
                      className="text-sm text-slate-500"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {activeCard
                        ? cardConfigs.find((c) => c.key === activeCard)
                            ?.description
                        : ""}
                    </motion.p>
                  </div>
                  <motion.button
                    className="rounded-full p-1.5 hover:bg-slate-100 text-slate-500"
                    onClick={() => setModalOpen(false)}
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "rgb(241 245 249)",
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>
                <motion.div
                  className="p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {activeCard &&
                    (() => {
                      const CardComponent = cardConfigs.find(
                        (c) => c.key === activeCard
                      )?.component;
                      return CardComponent ? <CardComponent modal /> : null;
                    })()}
                </motion.div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
