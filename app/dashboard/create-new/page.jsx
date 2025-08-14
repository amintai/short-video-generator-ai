"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../../components/ui/button";
import { ChevronLeft, ChevronRight, Wand2, Eye, Settings, Sparkles } from "lucide-react";
import CustomLoading from "./_components/CustomLoading";
import useCreateNewVideo from "./hooks/useCreateNewVideo";
import PlayerDialog from "../_components/PlayerDialog";
import SelectTopic from "./_components/SelectTopic";
import SelectStyle from "./_components/SelectStyle";
import SelectDuration from "./_components/SelectDuration";
import SelectLanguage from "./_components/SelectLanguage";
// Enhanced components for future use
// import EnhancedSelectVoice from "./_components/EnhancedSelectVoice";
// import EnhancedSelectTransition from "./_components/EnhancedSelectTransition";

const steps = [
  { id: 'topic', title: 'Choose Topic', icon: Sparkles },
  { id: 'style', title: 'Visual Style', icon: Eye },
  { id: 'duration', title: 'Duration', icon: Settings },
  { id: 'language', title: 'Language', icon: Settings },
  { id: 'voice', title: 'Voice & Audio', icon: Settings },
  { id: 'transitions', title: 'Transitions', icon: Settings }
];

const CreateNew = () => {
  const [currentStep, setCurrentStep] = useState(0);
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
      onHandleInputChange,
      getVideoScript,
      handleCreateVideo,
      generateAudioFile,
      generateAudioCaption,
      handleCancelVideoPlayerCb,
    },
  ] = useCreateNewVideo();

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return formData.topic;
      case 1: return formData.imageStyle;
      case 2: return formData.duration;
      case 3: return formData.language;
      case 4: return formData.voiceName;
      case 5: return formData.transitionStyle;
      default: return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <SelectTopic onHandleInputChange={onHandleInputChange} />;
      case 1:
        return <SelectStyle onHandleInputChange={onHandleInputChange} />;
      case 2:
        return <SelectDuration onHandleInputChange={onHandleInputChange} />;
      case 3:
        return <SelectLanguage onHandleInputChange={onHandleInputChange} />;
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="font-bold text-xl text-primary">Voice & Audio</h2>
            <p className="text-gray-500">Choose a voice for your video narration</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['sarah', 'john', 'emma', 'david'].map((voice) => (
                <button
                  key={voice}
                  onClick={() => {
                    onHandleInputChange('voiceName', voice);
                    onHandleInputChange('voiceStyle', 'friendly');
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.voiceName === voice
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  <div className="text-center">
                    <p className="font-semibold capitalize">{voice}</p>
                    <p className="text-sm text-gray-500">English Voice</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h2 className="font-bold text-xl text-primary">Transitions</h2>
            <p className="text-gray-500">Select transition effects between scenes</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['fade', 'slide', 'zoom', 'dissolve'].map((transition) => (
                <button
                  key={transition}
                  onClick={() => onHandleInputChange('transitionStyle', transition)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.transitionStyle === transition
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  <div className="text-center">
                    <p className="font-semibold capitalize">{transition}</p>
                    <p className="text-sm text-gray-500">Transition Effect</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Create Your Video
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Design stunning videos with our advanced AI-powered creation wizard
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Progress Bar */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.id} className="flex items-center flex-1">
                      <motion.div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          index <= currentStep 
                            ? 'bg-primary border-primary text-white'
                            : 'border-gray-300 text-gray-400'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon className="w-4 h-4" />
                      </motion.div>
                      {index < steps.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-2 ${
                          index < currentStep ? 'bg-primary' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {steps[currentStep].title}
                </h3>
                <p className="text-gray-500 text-sm">
                  Step {currentStep + 1} of {steps.length}
                </p>
              </div>
            </motion.div>

            {/* Step Content */}
            <motion.div 
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 mb-8 shadow-lg"
            >
              {renderStep()}
            </motion.div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                onClick={prevStep}
                disabled={currentStep === 0}
                variant="outline"
                className="disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep === steps.length - 1 ? (
                <Button 
                  onClick={handleCreateVideo}
                  disabled={!canProceed() || isAPILoading}
                  className="px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isAPILoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Create Video
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="px-8 py-3 rounded-xl font-semibold"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Summary Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 sticky top-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-primary" />
                Current Configuration
              </h3>
              
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-gray-600">Topic:</span>
                  <p className="text-gray-800 font-medium">
                    {formData.topic || 'Not selected'}
                  </p>
                </div>
                
                <div>
                  <span className="text-gray-600">Style:</span>
                  <p className="text-gray-800 font-medium">
                    {formData.imageStyle || 'Not selected'}
                  </p>
                </div>
                
                <div>
                  <span className="text-gray-600">Duration:</span>
                  <p className="text-gray-800 font-medium">
                    {formData.duration ? `${formData.duration} seconds` : 'Not selected'}
                  </p>
                </div>
                
                <div>
                  <span className="text-gray-600">Language:</span>
                  <p className="text-gray-800 font-medium">
                    {formData.language || 'Not selected'}
                  </p>
                </div>
                
                <div>
                  <span className="text-gray-600">Voice:</span>
                  <p className="text-gray-800 font-medium">
                    {formData.voiceName || 'Not selected'}
                  </p>
                </div>
                
                <div>
                  <span className="text-gray-600">Transitions:</span>
                  <p className="text-gray-800 font-medium">
                    {formData.transitionStyle || 'Not selected'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <CustomLoading loading={isAPILoading} />

      {playVideo && (
        <PlayerDialog
          handleCancelVideoPlayerCb={handleCancelVideoPlayerCb}
          playVideo={playVideo}
          isLoading={isAPILoading}
          videoData={videoContent}
        />
      )}
    </div>
  );
};

export default CreateNew;
