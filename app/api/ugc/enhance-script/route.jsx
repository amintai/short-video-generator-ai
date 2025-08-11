import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const {
      productName,
      productDescription,
      tone,
      language,
      avatarPersonality,
      voiceStyle
    } = await req.json();

    if (!productName || !productDescription) {
      return NextResponse.json({
        success: false,
        error: "Product name and description are required"
      }, { status: 400 });
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Create enhanced script prompt
    const enhancementPrompt = `
You are a professional UGC (User Generated Content) script writer for social media advertisements.

Create an engaging, authentic-sounding UGC video script for the following product:
- Product Name: ${productName}
- Description: ${productDescription}
- Tone: ${tone}
- Language: ${language}
- Avatar Personality: ${avatarPersonality}
- Voice Style: ${voiceStyle}

Requirements:
1. Make it sound like a real person genuinely recommending the product
2. Include a compelling hook in the first 3 seconds
3. Add personal touch and relatable language
4. Include social proof elements
5. End with a clear call-to-action
6. Keep it between 30-50 seconds when spoken
7. Use ${tone} tone throughout
8. Match the ${voiceStyle} voice style
9. Make it suitable for ${avatarPersonality} personality

Structure:
- Hook (3-5 seconds): Grab attention immediately
- Problem/Pain Point (5-7 seconds): What problem does this solve?
- Solution/Product Intro (8-12 seconds): Introduce the product naturally
- Benefits/Results (8-10 seconds): Show value and results
- Call-to-Action (3-5 seconds): Clear next step

Return the script as a JSON array with objects containing:
- contentText: the script text for each segment
- duration: estimated duration for each segment
- scene: description of what should be shown

Make it conversational, authentic, and compelling for ${language} speakers.
`;


    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 1024,
      responseMimeType: "application/json",
    };

    // Generate enhanced script
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: enhancementPrompt }] }],
      generationConfig
    });



    console.log("result", result)
    const response = await result.response;
    let scriptText = response.text();

    scriptText = scriptText.replace(/```json|```/g, "").trim();

    // Parse the response and structure it
    let enhancedScript;
    try {
      // Try to parse as JSON first
      enhancedScript = JSON.parse(scriptText);
    } catch (parseError) {
      // If not JSON, create structured script from text
      enhancedScript = createStructuredScript(scriptText, tone, avatarPersonality);
    }

    // Add intro and CTA enhancement
    const finalScript = enhanceWithIntroAndCTA(enhancedScript, productName, tone);

    return NextResponse.json({
      success: true,
      originalScript: `${productName}: ${productDescription}`,
      enhancedScript: finalScript,
      tone: tone,
      language: language,
      avatarPersonality: avatarPersonality,
      voiceStyle: voiceStyle,
      enhancement: "ai_optimized"
    });

  } catch (error) {
    console.error("Script enhancement error:", error);

    // Fallback to basic enhancement if AI fails
    const fallbackScript = createFallbackScript(
      req.body?.productName || "Product",
      req.body?.productDescription || "Great product",
      req.body?.tone || "friendly"
    );

    return NextResponse.json({
      success: true,
      enhancedScript: fallbackScript,
      enhancement: "basic_fallback",
      note: "Used fallback enhancement due to AI service unavailability"
    });
  }
}

// Create structured script from text
function createStructuredScript(scriptText, tone, personality) {
  const sentences = scriptText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const segments = [];

  // Distribute sentences across segments
  const segmentCount = Math.min(5, Math.max(3, sentences.length));
  const sentencesPerSegment = Math.ceil(sentences.length / segmentCount);

  for (let i = 0; i < segmentCount; i++) {
    const startIdx = i * sentencesPerSegment;
    const endIdx = Math.min(startIdx + sentencesPerSegment, sentences.length);
    const segmentText = sentences.slice(startIdx, endIdx).join('. ').trim() + '.';

    segments.push({
      contentText: segmentText,
      duration: Math.max(3, Math.min(8, segmentText.length / 15)), // Rough estimation
      scene: getSceneDescription(i, segmentCount, personality)
    });
  }

  return segments;
}

// Get scene description based on segment position
function getSceneDescription(segmentIndex, totalSegments, personality) {
  const scenes = [
    `${personality} avatar with excited expression, looking directly at camera`,
    `Avatar gesturing enthusiastically while talking about the problem`,
    `Avatar holding/presenting the product with confident body language`,
    `Avatar showing results/benefits with satisfied expression`,
    `Avatar with call-to-action pose, encouraging viewer to act`
  ];

  return scenes[Math.min(segmentIndex, scenes.length - 1)];
}

// Enhance with intro and CTA
function enhanceWithIntroAndCTA(script, productName, tone) {
  const introEnhancements = {
    excited: `OMG, you guys! I just discovered ${productName} and I'm obsessed!`,
    professional: `I want to share something that's been a game-changer for me: ${productName}.`,
    friendly: `Hey friends! I've been testing ${productName} and had to tell you about it!`,
    casual: `So I tried ${productName} and honestly? Mind blown.`,
    serious: `Listen, I don't usually do this, but ${productName} is worth talking about.`
  };

  const ctaEnhancements = {
    excited: `Seriously, go check it out RIGHT NOW! You'll thank me later! 🙌`,
    professional: `I highly recommend giving it a try. The link is in my bio.`,
    friendly: `Trust me on this one - you won't regret it! Link below 👇`,
    casual: `Definitely worth a try. Check it out if you're interested.`,
    serious: `Don't take my word for it. Try it yourself and see the difference.`
  };

  const intro = introEnhancements[tone] || introEnhancements.friendly;
  const cta = ctaEnhancements[tone] || ctaEnhancements.friendly;

  // Enhance first segment with intro
  if (script.length > 0) {
    script[0].contentText = `${intro} ${script[0].contentText}`;
  }

  // Enhance last segment with CTA
  if (script.length > 0) {
    const lastIndex = script.length - 1;
    script[lastIndex].contentText = `${script[lastIndex].contentText} ${cta}`;
  }

  return script;
}

// Fallback script creation
function createFallbackScript(productName, productDescription, tone) {
  const toneAdjustments = {
    excited: {
      intro: `Hey everyone! I'm SO excited to share ${productName} with you!`,
      middle: `This ${productDescription.toLowerCase()} is absolutely AMAZING!`,
      end: `You NEED to try this! Trust me, you'll love it! 🔥`
    },
    professional: {
      intro: `I'd like to introduce you to ${productName}.`,
      middle: `It's ${productDescription.toLowerCase()} that delivers real results.`,
      end: `I recommend giving it a try. You can find more information below.`
    },
    friendly: {
      intro: `Hi friends! I want to tell you about ${productName}!`,
      middle: `It's ${productDescription.toLowerCase()} and it's been great for me.`,
      end: `Hope this helps! Let me know what you think! 😊`
    }
  };

  const adjustment = toneAdjustments[tone] || toneAdjustments.friendly;

  return [
    {
      contentText: adjustment.intro,
      duration: 4,
      scene: "Avatar with welcoming expression, looking at camera"
    },
    {
      contentText: adjustment.middle,
      duration: 5,
      scene: "Avatar gesturing about the product benefits"
    },
    {
      contentText: adjustment.end,
      duration: 4,
      scene: "Avatar with encouraging expression, call-to-action pose"
    }
  ];
}
