import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

/**
 * Generate UGC script based on product information
 */
export const generateUGCScript = async (input) => {
  const { productName, productDescription, tone, language, avatar } = input;

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const prompt = `
Create a compelling UGC (User Generated Content) style video script for an AI avatar presenter.

Product Details:
- Name: ${productName}
- Description: ${productDescription}

Avatar Details:
- Name: ${avatar.name}
- Gender: ${avatar.gender}
- Personality: ${avatar.tone}

Script Requirements:
- Tone: ${tone}
- Language: ${language === 'en' ? 'English' : language}
- Duration: 30-45 seconds when spoken
- Style: Authentic, conversational, like a real person sharing their experience
- Include: Personal testimonial, specific benefits, call-to-action
- Avoid: Overly promotional language, scripted feel

The script should sound like ${avatar.name} is genuinely excited about the product and sharing it with friends. Make it feel natural and authentic, not like an advertisement.

Format the response as a clean script without extra formatting or stage directions.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Error generating UGC script:", error);
    throw new Error("Failed to generate script");
  }
};

/**
 * Generate voice audio from text
 */
export const generateVoice = async (scriptText, voiceId, options = {}) => {
  const { language = "en", tone = "excited" } = options;

  // This would typically use Google Cloud Text-to-Speech or ElevenLabs
  // Implementation depends on your chosen voice generation service

  const response = await fetch("/api/ugc/generate-voice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: scriptText,
      voiceId,
      language,
      tone,
      id: Date.now().toString()
    })
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error("Failed to generate voice");
  }

  return data.audioUrl;
};

/**
 * Generate avatar video with lip sync
 */
export const generateAvatarVideo = async (avatarId, audioUrl, options = {}) => {
  const response = await fetch("/api/ugc/generate-avatar-video", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      avatarId,
      audioUrl,
      ...options,
      id: Date.now().toString()
    })
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error("Failed to generate avatar video");
  }

  return data.videoUrl;
};

/**
 * Overlay product image on video
 */
export const overlayProductImage = async (videoUrl, imageUrl, options = {}) => {
  const response = await fetch("/api/ugc/overlay-product", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      videoUrl,
      productImage: imageUrl,
      ...options,
      id: Date.now().toString()
    })
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error("Failed to overlay product image");
  }

  return data.videoUrl;
};

/**
 * Avatar configurations
 */
export const AVATAR_CONFIGS = {
  sara: {
    id: "sara",
    name: "Sara",
    description: "Female, Excited",
    voiceId: "en-US-Wavenet-F",
    gender: "female",
    tone: "excited",
    languageCode: "en-US"
  },
  alex: {
    id: "alex",
    name: "Alex",
    description: "Male, Professional",
    voiceId: "en-US-Wavenet-B",
    gender: "male",
    tone: "professional",
    languageCode: "en-US"
  },
  emma: {
    id: "emma",
    name: "Emma",
    description: "Female, Casual",
    voiceId: "en-US-Wavenet-C",
    gender: "female",
    tone: "casual",
    languageCode: "en-US"
  },
  david: {
    id: "david",
    name: "David",
    description: "Male, Enthusiastic",
    voiceId: "en-US-Wavenet-D",
    gender: "male",
    tone: "enthusiastic",
    languageCode: "en-US"
  },
  sophia: {
    id: "sophia",
    name: "Sophia",
    description: "Female, Professional",
    voiceId: "en-US-Wavenet-E",
    gender: "female",
    tone: "professional",
    languageCode: "en-US"
  },
  michael: {
    id: "michael",
    name: "Michael",
    description: "Male, Casual",
    voiceId: "en-US-Wavenet-A",
    gender: "male",
    tone: "casual",
    languageCode: "en-US"
  }
};

/**
 * Language configurations
 */
export const LANGUAGE_CONFIGS = {
  en: { code: "en-US", name: "English" },
  es: { code: "es-ES", name: "Spanish" },
  fr: { code: "fr-FR", name: "French" },
  de: { code: "de-DE", name: "German" },
  hi: { code: "hi-IN", name: "Hindi" }
};

/**
 * Tone configurations
 */
export const TONE_CONFIGS = {
  excited: { rate: 1.2, pitch: 2.0 },
  casual: { rate: 1.0, pitch: 0.0 },
  professional: { rate: 0.9, pitch: -1.0 },
  enthusiastic: { rate: 1.3, pitch: 3.0 },
  friendly: { rate: 1.1, pitch: 1.0 }
};

/**
 * Validate UGC input data
 */
export const validateUGCInput = (data) => {
  const errors = [];

  if (!data.avatar) {
    errors.push("Avatar selection is required");
  }

  if (!data.productName || data.productName.trim().length === 0) {
    errors.push("Product name is required");
  }

  if (!data.productDescription || data.productDescription.trim().length === 0) {
    errors.push("Product description is required");
  }

  if (data.productName && data.productName.length > 100) {
    errors.push("Product name must be less than 100 characters");
  }

  if (data.productDescription && data.productDescription.length > 500) {
    errors.push("Product description must be less than 500 characters");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Estimate video generation time
 */
export const estimateGenerationTime = (options = {}) => {
  const baseTime = 60; // 1 minute base
  let additionalTime = 0;

  if (options.hasProductImage) {
    additionalTime += 30; // 30 seconds for overlay
  }

  if (options.language !== "en") {
    additionalTime += 15; // 15 seconds for non-English
  }

  return baseTime + additionalTime;
};
