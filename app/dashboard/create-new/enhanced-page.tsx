"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../../components/ui/button";
import { 
  Wand2, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  Clock,
  Palette,
  Languages,
  Type,
  Volume2,
  Video,
  Settings,
  Play,
  Download,
  Share
} from "lucide-react";
import EnhancedSelectTopic from "./_components/EnhancedSelectTopic";
import EnhancedSelectStyle from "./_components/EnhancedSelectStyle";
import EnhancedSelectDuration from "./_components/EnhancedSelectDuration";
import EnhancedSelectLanguage from "./_components/EnhancedSelectLanguage";
import EnhancedSelectVoice from "./_components/EnhancedSelectVoice";
import EnhancedSelectTransition from "./_components/EnhancedSelectTransition";
import CustomLoading from "./_components/CustomLoading";
import useCreateNewVideo from "./hooks/useCreateNewVideo";
import PlayerDialog from "../_components/PlayerDialog";

const EnhancedCreateNew = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  const [
    {
      formData: hookFormData,
      isAPILoading,
      videoScript,
      audioFileUrl,
      captions,
      playVideo,
      videoData,
      videoContent,
    },
    {
      onHandleInputChange,
      getVideoScript,
      handleCreateVideo,
      generateAudioFile,
      generateAudioCaption,
      handleCancelVideoPlayerCb,
    },
  ] = useCreateNewVideo();

  const steps = [
    {
      id: 0,
      title: "Content",
      description: "What's your video about?",
      icon: Type,
      component: EnhancedSelectTopic
    },
    {
      id: 1,
      title: "Visual Style",
      description: "Choose your aesthetic",
      icon: Palette,
      component: EnhancedSelectStyle
    },
    {
      id: 2,
      title: "Duration",
      description: "How long should it be?",
      icon: Clock,
      component: EnhancedSelectDuration
    },
    {
      id: 3,
      title: "Language",
      description: "Select your language",
      icon: Languages,
      component: EnhancedSelectLanguage
    },
    {
      id: 4,
      title: "Voice & Audio",
      description: "Customize the sound",
      icon: Volume2,
      component: EnhancedSelectVoice
    },
    {
      id: 5,
      title: "Transitions",
      description: "Add smooth effects",
      icon: Video,
      component: EnhancedSelectTransition
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const isStepComplete = (stepIndex: number) => {
    const stepRequiredFields = {
      0: ['topic'],
      1: ['imageStyle'],
      2: ['duration'],
      3: ['language'],
      4: ['voiceStyle'],
      5: ['transitionStyle']
    };
    
    const requiredFields = stepRequiredFields[stepIndex] || [];
    return requiredFields.every(field => hookFormData[field]);
  };

  const canProceedToNext = () => {
    return isStepComplete(currentStep);
  };

  const canCreateVideo = () => {
    return steps.slice(0, 4).every((_, index) => isStepComplete(index)); // First 4 steps are required
  };

  const CurrentStepComponent = steps[currentStep].component;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const stepVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 glassmorphism border border-white/10 rounded-full px-4 py-2 mb-4">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-white/90">AI Video Creator</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Create Your{" "}
            <span className="gradient-text">Perfect Video</span>
          </h1>
          
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Follow the steps below to craft your unique AI-generated video with professional quality and style.
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = index === currentStep;
              const isComplete = isStepComplete(index);
              
              return (
                <motion.button
                  key={step.id}
                  onClick={() => handleStepClick(index)}
                  className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-2xl text-sm transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                      : isComplete
                      ? 'bg-green-600/20 text-green-400 border border-green-400/30'
                      : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white/80'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="hidden sm:block">{step.title}</span>
                </motion.button>
              );
            })}
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/10 rounded-full h-2 mb-4">
            <motion.div
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <div className="text-center text-white/60 text-sm">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep].description}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <motion.div
              className="glassmorphism rounded-3xl p-8 border border-white/10 min-h-[500px]"
              layout
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  {React.createElement(steps[currentStep].icon, { className: "h-5 w-5 text-white" })}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{steps[currentStep].title}</h2>
                  <p className="text-white/60">{steps[currentStep].description}</p>
                </div>
              </div>

              <AnimatePresence mode="wait" custom={currentStep}>
                <motion.div
                  key={currentStep}
                  custom={currentStep}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                >
                  <CurrentStepComponent onHandleInputChange={onHandleInputChange} />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
                <Button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  variant="outline"
                  className="border-white/20 hover:border-white/40 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                <div className="flex items-center gap-2 text-sm text-white/60">
                  {canProceedToNext() ? (
                    <div className="flex items-center gap-1 text-green-400">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      Complete
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                      Required
                    </div>
                  )}
                </div>

                {currentStep < steps.length - 1 ? (
                  <Button
                    onClick={handleNext}
                    disabled={!canProceedToNext()}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleCreateVideo}
                    disabled={!canCreateVideo() || isAPILoading}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    {isAPILoading ? 'Creating...' : 'Create Video'}
                  </Button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Preview/Summary Section */}
          <div className="lg:col-span-1">
            <motion.div
              className="glassmorphism rounded-3xl p-6 border border-white/10 sticky top-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuration
              </h3>

              <div className="space-y-4">
                {Object.entries(hookFormData).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center text-sm">
                    <span className="text-white/60 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-white font-medium">{String(value)}</span>
                  </div>
                ))}
                
                {Object.keys(hookFormData).length === 0 && (
                  <div className="text-center py-8 text-white/40">
                    <Video className="h-12 w-12 mx-auto mb-2 opacity-40" />
                    <p>Your settings will appear here</p>
                  </div>
                )}
              </div>

              {canCreateVideo() && (
                <motion.div
                  className="mt-6 p-4 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-2xl"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-2 text-green-400 font-medium mb-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Ready to Create
                  </div>
                  <p className="text-white/70 text-sm">
                    All required settings configured. Your video will be generated with the current settings.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Loading State */}
        <CustomLoading loading={isAPILoading} />

        {/* Video Player Dialog */}
        {playVideo && (
          <PlayerDialog
            handleCancelVideoPlayerCb={handleCancelVideoPlayerCb}
            playVideo={playVideo}
            isLoading={isAPILoading}
            videoData={videoContent}
          />
        )}
      </div>
    </div>
  );
};

export default EnhancedCreateNew;
