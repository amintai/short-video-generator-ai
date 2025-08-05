"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Wand2 } from "lucide-react";
import { Button } from "../../../@/components/ui/button";
import AvatarSelector from "./_components/AvatarSelector";
import ProductInputForm from "./_components/ProductInputForm";
import InlineVideoPlayer from "./_components/InlineVideoPlayer";
import { useUGCVideo } from "./hooks/useUGCVideo";
import CustomLoading from "../create-new/_components/CustomLoading";
import toast from "react-hot-toast";

const UGCVideoPage = () => {
  const [
    {
      formData,
      isAPILoading,
      videoScript,
      audioFileUrl,
      captions,
      playVideo,
      videoData,
      videoContent,
    },
    {
      setSelectedAvatar,
      setProductData,
      setTone,
      setLanguage,
      generateVideo,
      generateAudioFile,
      generateAudioCaption,
      handleCancelVideoPlayerCb,
      resetForm,
    },
  ] = useUGCVideo();

  const handleGenerateVideo = async () => {
    if (!formData.avatar) {
      toast.error("Please select an avatar");
      return;
    }
    
    if (!formData.productName || !formData.productDescription) {
      toast.error("Please provide product details");
      return;
    }

    await generateVideo();
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-pink-50 p-6">
      <motion.div
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl text-white shadow-lg">
              <Sparkles className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Generate UGC Video Ad
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Create compelling AI-powered UGC-style ad videos with just a few clicks. 
            Select your avatar, add product details, and let AI do the magic!
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <motion.div variants={itemVariants} className="space-y-8">
            {/* Avatar Selection */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                Choose Your Avatar
              </h2>
              <AvatarSelector 
                selectedAvatar={formData.avatar}
                onAvatarSelect={setSelectedAvatar}
              />
            </div>

            {/* Product Input */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Product Details
              </h2>
              <ProductInputForm 
                formData={formData}
                onProductDataChange={setProductData}
                onToneChange={setTone}
                onLanguageChange={setLanguage}
              />
            </div>

            {/* Generate Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={generateVideo}
                disabled={isAPILoading}
                className="w-full h-14 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-2xl text-lg font-semibold shadow-lg transition-all duration-300"
              >
                <Wand2 className="mr-3 h-6 w-6" />
                {isAPILoading ? "Generating Video..." : "Generate UGC Video"}
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Column - Preview */}
          <motion.div variants={itemVariants}>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-xl p-6 h-full">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                Video Preview
              </h2>
              <InlineVideoPlayer 
                videoData={videoContent}
                isLoading={isAPILoading}
onReset={resetForm}
              />
            </div>
          </motion.div>
        </div>

        {/* Loading Overlay */}
        <CustomLoading loading={isAPILoading} />
      </motion.div>
    </div>
  );
};

export default UGCVideoPage;
