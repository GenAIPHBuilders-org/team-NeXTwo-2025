import React, { useState, useEffect } from 'react'
import { LockIcon } from "lucide-react"
import { motion } from "framer-motion"

const LockDesign = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

return (
    <motion.div className="flex justify-center my-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
        transition={{ duration: 0.8, delay: 0.2 }}>
        <div className="flex items-center space-x-3">
            {[1, 2, 3, 4, 5].map((step, index) => (
                <div key={index} className="flex items-center">
                    <div className={`h-2 w-2 rounded-full ${index === 2 ? "bg-emerald-500" : "bg-gray-300"}`}>
                        {index === 2 && (
                            <div className="relative">
                                <div className="absolute -top-6 -left-3">
                                    <div className="bg-white p-2 rounded-full shadow-lg">
                                        <LockIcon className="h-4 w-4 text-emerald-500" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {index < 4 && <div className="h-[1px] w-8 bg-gray-300"></div>}
                </div>
            ))}
        </div>
    </motion.div>
)
}

export default LockDesign
