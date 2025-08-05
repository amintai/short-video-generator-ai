import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY);

export async function POST(req) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({
        success: false,
        error: "URL is required"
      }, { status: 400 });
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: "Invalid URL format"
      }, { status: 400 });
    }

    // Fetch the webpage content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: "Failed to fetch webpage"
      }, { status: 400 });
    }

    const html = await response.text();
    
    // Extract basic meta tags and content
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const descriptionMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    const imageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
    
    // Fallback to other image sources if og:image not found
    const imageMatch2 = html.match(/<img[^>]*src=["']([^"']+)["'][^>]*>/i);

    let productName = titleMatch ? titleMatch[1].trim() : "";
    let productDescription = descriptionMatch ? descriptionMatch[1].trim() : "";
    let productImage = imageMatch ? imageMatch[1] : (imageMatch2 ? imageMatch2[1] : null);

    // Use AI to clean up and improve the extracted data
    if (productName || productDescription) {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `
Given this raw product information extracted from a webpage:
Title: ${productName}
Description: ${productDescription}
URL: ${url}

Please extract and clean up:
1. A clear, concise product name (max 50 characters)
2. A compelling product description for a UGC ad (max 200 characters, focus on benefits and appeal)

Format your response as JSON:
{
  "name": "cleaned product name",
  "description": "compelling description for UGC ad"
}
`;

      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiResult = JSON.parse(response.text());
        
        if (aiResult.name) productName = aiResult.name;
        if (aiResult.description) productDescription = aiResult.description;
      } catch (aiError) {
        console.error("AI processing error:", aiError);
        // Continue with scraped data if AI fails
      }
    }

    // If no data was extracted, return an error
    if (!productName && !productDescription) {
      return NextResponse.json({
        success: false,
        error: "Could not extract product information from the provided URL"
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      name: productName,
      description: productDescription,
      image: productImage,
      sourceUrl: url
    });

  } catch (error) {
    console.error("Error scraping product:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to scrape product information"
    }, { status: 500 });
  }
}
