"use client";

import { useEffect, useState } from "react";
import LockDesign from "./components/LockDesign";
import InfoCards from "./components/InfoCards";
// import Navbar from "../../components/NavBar";
import { motion } from "framer-motion";
import Hero from "./components/Hero";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative overflow-hidden">
      <div className="relative z-10">
        {/* <Navbar /> */}

        <div className="container mx-auto px-4 pt-40 pb-32">
          <Hero />

          <div className="flex justify-center">
            <motion.button
              id="get-started"
              className="bg-emerald-500 cursor-pointer text-white font-medium px-8 py-3 rounded-lg shadow-lg shadow-emerald-200 transition-all"
              onClick={() => router.push("/pages/main")}
            >
              Get Started
            </motion.button>
          </div>
          <LockDesign />
          <InfoCards />
        </div>
      </div>
    </div>
  );
}
