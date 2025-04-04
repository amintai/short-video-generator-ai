import React from "react";
import { motion } from "framer-motion";

const FeaturedCard = () => {
  return (
    <section
      id="features"
      className="mt-32 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
    >
      <motion.div
        className="p-6 bg-primary rounded-xl text-center shadow-lg shadow-rounded"
        whileHover={{ scale: 1.05 }}
      >
        <h3 className="text-2xl text-white font-semibold">AI-Powered</h3>
        <p className="mt-2 text-black-400">
          Leverage the power of AI to create videos from text prompts.
        </p>
      </motion.div>
      <motion.div
        className="p-6 bg-primary rounded-xl text-center shadow-lg"
        whileHover={{ scale: 1.05 }}
      >
        <h3 className="text-2xl text-white font-semibold">Fast Processing</h3>
        <p className="mt-2 text-black-400">
          Generate videos within minutes with high efficiency.
        </p>
      </motion.div>
      <motion.div
        className="p-6 bg-primary rounded-xl text-center shadow-lg"
        whileHover={{ scale: 1.05 }}
      >
        <h3 className="text-2xl text-white font-semibold">Customizable</h3>
        <p className="mt-2 text-black-400">
          Tweak settings to match your brand and style.
        </p>
      </motion.div>
    </section>
  );
};

export default FeaturedCard;
