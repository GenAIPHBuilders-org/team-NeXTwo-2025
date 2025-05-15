import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);
  return (
    <div className="max-w-4xl mx-auto text-center mb-10">
      <motion.h1
        className="text-4xl md:text-6xl font-bold text-slate-800 tracking-tight mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Save. Balance. Grow.
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl text-slate-600 max-w-[80rem] leading-10 mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        Your all-in-one{" "}
        <strong className="text-blue-600 border-b-2 border-b-blue-600">Financial Assistant</strong> for{" "}
        <strong className="text-blue-600">Smarter</strong>,{" "}
        <strong className="text-blue-600">Stress-free Money Management</strong>.
      </motion.p>
    </div>
  );
};

export default Hero;
