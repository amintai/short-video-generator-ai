import { chatSession } from "../../../../configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { productName, productDescription, tone, language, avatar } = await req.json();

    if (!productName || !productDescription) {
      return NextResponse.json({
        success: false,
        error: "Product name and description are required"
      }, { status: 400 });
    }

    const prompt = `Generate a highly engaging and exciting UGC (User Generated Content) style video script in the "${language === 'en' ? 'English' : language}" language for a 30-45 second video featuring an enthusiastic AI avatar presenter.

Product Details:
- Name: ${productName}
- Description: ${productDescription}

Avatar Details:
- Name: ${avatar.name}
- Gender: ${avatar.gender}
- Personality: ${avatar.tone}

Script Requirements:
- Tone: Excited, friendly, and conversational
- Duration: 30-45 seconds when spoken
- Style: Authentic, lively UGC style that feels spontaneous
- Include: Personal testimonial, compelling benefits, engaging call-to-action
- Avoid: Bland or overly promotional language, keep it dynamic

Break the content into 3-4 lively narrative segments:
1. Catchy Hook (grab attention with personal touch)
2. Product Enthusiasm (showcase excitement and personal experience)
3. Real-world Benefits (highlight unique advantages)
4. Call-to-action (enthusiastic recommendation to friends)

For **each segment**, describe:
1. **imagePrompt**: A bright, lively setting showing the avatar expressing their excitement about the product. Capture their enthusiasm and connection.
2. **contentText**: High-energy, engaging narration that feels like ${avatar.name} is talking directly to friends. Sound authentic and relatable, filled with genuine excitement.

### Additional Rules:
- Use vivid language to convey excitement
- Emphasize personal connection and real-world impact
- Optimize for social media and sharing
- **Return ONLY a JSON array** with "imagePrompt" and "contentText" fields
- The script should feel vibrant, dynamic, and directly address the viewer

Let ${avatar.name}'s personality shine through as they genuinely share their love for ${productName}, creating an engaging and memorable experience.`;

    const result = await chatSession.sendMessage(prompt);
    const scriptData = JSON.parse(result.response.text());

    return NextResponse.json({
      result: scriptData
    });

  } catch (error) {
    console.error("Error generating UGC script:", error);
    return NextResponse.json({ 
      "Error:": error.message || error 
    });
  }
}
