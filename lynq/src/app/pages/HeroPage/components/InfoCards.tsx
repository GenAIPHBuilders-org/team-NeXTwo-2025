import React, { useState, useEffect } from "react";
import { TrendingUp, PieChart, PiggyBank, X, ArrowRight } from "lucide-react";

const AnimatedInfoCard = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeModal, setActiveModal] = useState<number | null>(null);
  const [animatingModal, setAnimatingModal] = useState<number | null>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const openModal = (cardId: number) => {
    // Start the animation
    setAnimatingModal(cardId);

    // After animation starts, fully open the modal
    setTimeout(() => {
      setActiveModal(cardId);
      setAnimatingModal(null);
    }, 300);
  };

  const closeModal = () => {
    // Start closing animation
    setAnimatingModal(activeModal);

    // After animation completes, fully close the modal
    setTimeout(() => {
      setActiveModal(null);
      setAnimatingModal(null);
    }, 300);
  };

  const handleOutsideClick = (e: { target: any; currentTarget: any }) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Card data for easier management
  const cards = [
    {
      id: 1,
      title: "Cash Flow Stability",
      subtitle: "Stay ahead of every peso",
      icon: <TrendingUp className="text-blue-600" />,
      bgColor: "bg-blue-100",
      textColor: "text-blue-700",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      features: [
        {
          title: "Monitor",
          description: "Your income and expenses in real-time",
        },
        { title: "Predict", description: "Shortfalls before they happen" },
        { title: "Rebalance", description: "Your funds for life's surprises" },
      ],
    },
    {
      id: 2,
      title: "Smarter Budgeting",
      subtitle: "Spend wisely without overthinking",
      icon: <PieChart className="text-emerald-600" />,
      bgColor: "bg-emerald-100",
      textColor: "text-emerald-700",
      buttonColor: "bg-emerald-600 hover:bg-emerald-700",
      features: [
        {
          title: "Create",
          description: "Dynamic budgets that evolve with your habits",
        },
        {
          title: "Adjust",
          description: "Categories automatically as you spend",
        },
        {
          title: "Align",
          description: "Stay on track with your financial goals",
        },
      ],
    },
    {
      id: 3,
      title: "Effortless Savings Growth",
      subtitle: "Save more, worry less",
      icon: <PiggyBank className="text-amber-600" />,
      bgColor: "bg-amber-100",
      textColor: "text-amber-700",
      buttonColor: "bg-amber-600 hover:bg-amber-700",
      features: [
        {
          title: "Identify",
          description: "Surpluses in your monthly finances",
        },
        {
          title: "Redirect",
          description: "Extra funds toward your dream goals",
        },
        {
          title: "Adjust",
          description: "Plans as your financial situation improves",
        },
      ],
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`transform transition-all duration-700 ${
              isLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-30 opacity-0"
            }`}
            style={{ transitionDelay: `${200 * card.id}ms` }}
          >
            <div
              id="cards"
              className={`bg-white rounded-2xl shadow-xl p-6 overflow-hidden relative border border-gray-100
                hover:shadow-2xl transition-all duration-300 cursor-pointer
                ${animatingModal === card.id ? "scale-105 opacity-0" : ""}`}
              onClick={() => openModal(card.id)}
              style={{
                animation: isLoaded
                  ? `float ${2.5 + card.id * 0.5}s ease-in-out infinite`
                  : "none",
              }}
            >
              <div
                className={`${card.bgColor} rounded-lg p-2 w-16 h-16 flex items-center justify-center mb-4 
                transition-all duration-300`}
              >
                <div className="w-6 h-6">{card.icon}</div>
              </div>

              <div className="flex flex-col justify-between">
                <h3 className="text-xl font-semibold text-slate-800 mb-1">
                  {card.title}
                </h3>
                <h4 className={`font-medium ${card.textColor}`}>
                  {card.subtitle}
                </h4>
              </div>

              <div className="mt-4">
                <span
                  className={`${card.textColor} font-medium text-sm flex items-center`}
                >
                  Learn more
                  <ArrowRight className="h-4 w-4 ml-1" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal View */}
      {activeModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
          onClick={handleOutsideClick}
        >
          <div
            className={`bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative
              transition-all duration-300 ${
                animatingModal ? "scale-90 opacity-0" : "scale-100 opacity-100"
              }`}
          >
            <div className="absolute top-6 right-6">
              <button
                id="x-button"
                onClick={closeModal}
                className="bg-gray-100 cursor-pointer rounded-full p-3 transition-colors duration-200"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            <div className="p-10">
              {cards
                .filter((c) => c.id === activeModal)
                .map((card) => (
                  <div key={card.id}>
                    <div className="flex flex-col justify-center md:flex-row items-center md:space-x-6 mb-10">
                      <div
                        className={`${card.bgColor} rounded-xl p-5 transform transition-all duration-300 mb-4 md:mb-0`}
                      >
                        <div className="w-16 h-16">
                          {React.cloneElement(card.icon, { size: 64 })}
                        </div>
                      </div>

                      <div className="transform transition-all duration-300 text-center md:text-left">
                        <h3 className="text-4xl font-bold text-slate-800 mb-2">
                          {card.title}
                        </h3>
                        <h4
                          className={`text-2xl font-medium ${card.textColor}`}
                        >
                          {card.subtitle}
                        </h4>
                      </div>
                    </div>

                    <div className="space-y-8 mb-10 flex flex-col items-start mx-auto w-fit">
                      {card.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center space-x-5 transform transition-all duration-300"
                          style={{
                            animationDelay: `${idx * 0.1}s`,
                            animation: "fadeInUp 0.5s ease-out forwards",
                          }}
                        >
                          <div
                            className={`${card.bgColor} p-4 rounded-xl flex-shrink-0`}
                          >
                            <svg
                              className={`h-8 w-8 ${card.textColor.replace(
                                "text-",
                                ""
                              )}`}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                d={
                                  idx === 0
                                    ? "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                    : idx === 1
                                    ? "M13 10V3L4 14h7v7l9-11h-7z"
                                    : "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                                }
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xl font-medium text-slate-800 mb-2">
                              <span className={`${card.textColor}`}>
                                {feature.title}
                              </span>
                            </p>
                            <p className="text-lg text-slate-600">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Additional content specific to each card */}
                    {card.id === 1 && (
                      <div className="h-24 mt-6 overflow-hidden">
                        <svg viewBox="0 0 200 50" className="w-full h-full">
                          <path
                            d="M0,25 Q25,5 50,20 T100,15 T150,30 T200,25"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="1"
                          />
                          <path
                            d="M0,25 Q25,5 50,20 T100,15 T150,30 T200,25"
                            fill="none"
                            stroke="#10B981"
                            strokeWidth="2"
                            className="animate-draw"
                          />
                        </svg>
                      </div>
                    )}

                    {card.id === 2 && (
                      <div className="grid grid-cols-3 gap-6 mt-6">
                        {["Track", "Optimize", "Save"].map((item, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col items-center transform transition-all duration-300"
                            style={{
                              animationDelay: `${0.2 + idx * 0.1}s`,
                              animation: "fadeInUp 0.5s ease-out forwards",
                            }}
                          >
                            <div
                              className={`${
                                idx === 0
                                  ? "bg-blue-100"
                                  : idx === 1
                                  ? "bg-purple-100"
                                  : "bg-green-100"
                              } rounded-full h-20 w-20 flex items-center justify-center mb-3`}
                            >
                              <svg
                                className={`h-10 w-10 ${
                                  idx === 0
                                    ? "text-blue-600"
                                    : idx === 1
                                    ? "text-purple-600"
                                    : "text-green-600"
                                }`}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path
                                  d={
                                    idx === 0
                                      ? "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                      : idx === 1
                                      ? "M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 12l2 2 4-4"
                                      : "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  }
                                />
                              </svg>
                            </div>
                            <span className="text-lg font-medium text-slate-700">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {card.id === 3 && (
                      <div className="mt-6 bg-gray-50 rounded-xl p-6 transform transition-all duration-300">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-lg text-slate-600">
                            Dream Home Fund
                          </span>
                          <span className="text-xl font-medium text-slate-700">
                            $12,450
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div
                            className="bg-amber-500 h-4 rounded-full progress-bar"
                            style={{ width: "0%" }}
                          ></div>
                        </div>
                        <div className="flex justify-end mt-2">
                          <span className="text-base text-slate-500">
                            45% of goal
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes draw {
          0% {
            stroke-dasharray: 300;
            stroke-dashoffset: 300;
          }
          100% {
            stroke-dasharray: 300;
            stroke-dashoffset: 0;
          }
        }

        @keyframes grow {
          0% {
            width: 0%;
          }
          100% {
            width: 45%;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-draw {
          animation: draw 1.5s ease forwards;
        }

        .animate-grow {
          animation: grow 1s ease-out forwards;
          animation-delay: 0.3s;
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default AnimatedInfoCard;
