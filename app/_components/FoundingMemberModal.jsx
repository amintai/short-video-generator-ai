"use client";

import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../@/components/ui/input";
import { Dialog, DialogContent } from "../../@/components/ui/dialog";
import { X } from "lucide-react";

export default function FoundingMemberModal({
    isFoundingModalOpen,
    setFoundingModalOpen
}) {
    const [formData, setFormData] = useState({ name: "", email: "" });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Hook up to Supabase/Firebase/Email API
        console.log("Founding Member Data:", formData);
        setSubmitted(true);
        setTimeout(() => setFoundingModalOpen(false), 1500);
    };

    return (
        <>
            <Dialog open={isFoundingModalOpen} onClose={() => setFoundingModalOpen(false)} className="relative z-50">
                {/* Background overlay without blur */}
                <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogContent className="w-full max-w-md rounded-2xl bg-white/90 backdrop-blur-md p-6 shadow-xl border border-gray-200">
                        <button
                            onClick={() => setFoundingModalOpen(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-5 w-5" />
                        </button>


                        <div className="text-xl font-bold text-gray-900 mb-2">
                            Become a Founding Member 🌟
                        </div>
                        <div className="text-sm text-gray-600 mb-4">
                            We’re still in early days. By joining now, you’ll get:
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>💸 Lifetime discount on all plans</li>
                                <li>🗣 Direct input into new features</li>
                                <li>🏆 Recognition as an early supporter</li>
                            </ul>
                        </div>

                        {submitted ? (
                            <p className="text-green-600 font-medium">Thanks for joining! 🎉</p>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <Input
                                    type="text"
                                    name="name"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Your Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                                    Join Now
                                </Button>
                            </form>
                        )}
                    </DialogContent>
                </div>
            </Dialog>
        </>
    );
}
