"use client";

import Joyride, { STATUS, Step } from "react-joyride";
import { useState } from "react";

export default function OnboardingTour() {
  const [run, setRun] = useState(true);

  const steps = [
    {
      target: ".create-video-btn",
      content: "Click here to generate your first AI video using our magic engine.",
      placement: "bottom",
    },
    {
      target: ".dashboard-card",
      content: "These cards show your stats — like total videos, views, and coins.",
      placement: "top",
    },
    {
      target: ".filters-bar",
      content: "Apply filters to organize your short videos here.",
      placement: "bottom",
    },
  ];

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    console.log("Joyride status:", status, data);
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
      localStorage.setItem("tour_done", "true");
    }
  };

  return (
    <Joyride
      callback={handleJoyrideCallback}
      steps={steps}
      run={run && localStorage.getItem("tour_done") !== "true"}
      continuous
      scrollToFirstStep
      showSkipButton
      showProgress
      styles={{
        options: {
          arrowColor: "rgba(255, 255, 255, 0.8)",
          backgroundColor: "rgba(255, 255, 255, 0.6)", // glassmorphism
          overlayColor: "rgba(0, 0, 0, 0.4)",
          primaryColor: "#6366f1", // indigo-500
          textColor: "#1f2937", // gray-800
          zIndex: 9999,
        },
        buttonNext: {
          background: "linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899)", // blue → purple → pink
          color: "white",
          borderRadius: "9999px",
          padding: "0.5rem 1rem",
        },
        buttonBack: {
          color: "#6b7280",
        },
        tooltip: {
          backdropFilter: "blur(10px)",
          borderRadius: "1rem",
          padding: "1.5rem",
          border: "1px solid #e5e7eb",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        },
      }}
    />
  );
}
