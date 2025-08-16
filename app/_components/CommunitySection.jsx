"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import FoundingMemberModal from "./FoundingMemberModal";

export default function CommunitySection() {

    const [isFoundingModalOpen, setFoundingModalOpen] = useState(false);
    return (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl font-bold sm:text-4xl text-gray-900"
                >
                    Built Together with Our Early Community 🌱
                </motion.h2>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                    Instead of fake reviews, here’s the real deal: this platform is
                    early-stage and being built in public. Your feedback isn’t just
                    welcome — it’s what shapes the roadmap.
                </p>

                <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-2xl shadow-md p-6 text-left border"
                    >
                        <p className="text-gray-700">
                            “Tried making a quick promo reel. Super smooth already, can’t wait
                            for captions + templates in the next version.”
                        </p>
                        <div className="mt-4">
                            <p className="font-semibold text-gray-900">Akmal</p>
                            <p className="text-sm text-gray-500">Early Beta User</p>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-2xl shadow-md p-6 text-left border"
                    >
                        <p className="text-gray-700">
                            “Not overwhelming like other editors. I made my first AI video in
                            under a minute.”
                        </p>
                        <div className="mt-4">
                            <p className="font-semibold text-gray-900">Faheem</p>
                            <p className="text-sm text-gray-500">Community Friend</p>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-2xl shadow-md p-6 text-left border"
                    >
                        <p className="text-gray-700">
                            “As the maker, I’m testing and improving this every day. Your
                            feedback directly decides what gets built next.”
                        </p>
                        <div className="mt-4">
                            <p className="font-semibold text-gray-900">Amin Tai</p>
                            <p className="text-sm text-gray-500">Founder</p>
                        </div>
                    </motion.div>
                </div>

                <p className="mt-12 text-gray-600">
                    👉 Want to shape the product?{" "}
                    <span className="font-semibold text-purple-600" onClick={() => setFoundingModalOpen(true)}>
                        Join the early feedback group
                    </span>
                </p>

                {isFoundingModalOpen ? <FoundingMemberModal isFoundingModalOpen={isFoundingModalOpen} setFoundingModalOpen={setFoundingModalOpen} /> : null}
            </div>
        </section>
    );
}
