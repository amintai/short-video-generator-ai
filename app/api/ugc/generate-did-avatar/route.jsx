import { NextResponse } from "next/server";
import { storage } from "../../../../configs/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export async function POST(req) {
  try {
    const { 
      avatarId, 
      audioUrl, 
      script, 
      productImage,
      productName,
      tone,
      voiceStyle,
      id 
    } = await req.json();

    if (!avatarId || !audioUrl) {
      return NextResponse.json({
        success: false,
        error: "Avatar ID and audio URL are required"
      }, { status: 400 });
    }

    // Enhanced avatar mapping with D-ID compatible images
    const didAvatars = {
      "sara": {
        image: "https://create-images-results.d-id.com/google-oauth2%7C117330394769767673709/upl_kxZJ0qgOY_1703076906.jpeg",
        personality: "enthusiastic",
        gestures: ["pointing", "holding", "excited_wave"],
        body_visible: true
      },
      "alex": {
        image: "https://create-images-results.d-id.com/DefaultCustomAvatar/upl_qWgGhTPbp_1703076906.png",
        personality: "professional", 
        gestures: ["presentation", "thumbs_up", "open_palm"],
        body_visible: true
      },
      "emma": {
        image: "https://create-images-results.d-id.com/DefaultCustomAvatar/upl_mNpHrVKj8_1703076906.png",
        personality: "friendly",
        gestures: ["heart_hands", "clapping", "product_showcase"],
        body_visible: true
      },
      "david": {
        image: "https://create-images-results.d-id.com/DefaultCustomAvatar/upl_xYzAbC123_1703076906.png",
        personality: "confident",
        gestures: ["strong_point", "crossed_arms", "approval_nod"],
        body_visible: true
      },
      "sophia": {
        image: "https://create-images-results.d-id.com/DefaultCustomAvatar/upl_eFgH456_1703076906.png",
        personality: "elegant",
        gestures: ["graceful_wave", "delicate_hold", "gentle_point"],
        body_visible: true
      },
      "michael": {
        image: "https://create-images-results.d-id.com/DefaultCustomAvatar/upl_iJkL789_1703076906.png",
        personality: "energetic",
        gestures: ["dynamic_point", "victory_pose", "product_lift"],
        body_visible: true
      }
    };

    const selectedAvatar = didAvatars[avatarId] || didAvatars["sara"];

    // Step 1: Create D-ID talking photo/video
    const didResponse = await createDIDVideo({
      avatarImage: selectedAvatar.image,
      audioUrl: audioUrl,
      script: script,
      avatarPersonality: selectedAvatar.personality,
      tone: tone,
      voiceStyle: voiceStyle
    });

    if (!didResponse.success) {
      throw new Error(didResponse.error || "Failed to create D-ID video");
    }

    let finalVideoUrl = didResponse.videoUrl;

    // Step 2: If we have product image, create background integration
    if (productImage) {
      finalVideoUrl = await enhanceWithProductBackground(
        didResponse.videoUrl,
        productImage,
        productName,
        tone
      );
    }

    // Upload to Firebase for persistent storage
    let storedVideoUrl = finalVideoUrl;
    if (typeof finalVideoUrl === "string" && finalVideoUrl.startsWith("http")) {
      try {
        const response = await fetch(finalVideoUrl);
        const videoBuffer = await response.arrayBuffer();
        
        const storageRef = ref(storage, `did-ugc-videos/${id}.mp4`);
        const uploadResult = await uploadBytes(storageRef, videoBuffer, {
          contentType: "video/mp4",
        });
        
        storedVideoUrl = await getDownloadURL(storageRef);
      } catch (uploadError) {
        console.error("Error uploading to Firebase:", uploadError);
        storedVideoUrl = finalVideoUrl;
      }
    }

    return NextResponse.json({
      success: true,
      videoUrl: storedVideoUrl,
      avatarId,
      avatarPersonality: selectedAvatar.personality,
      gestures: selectedAvatar.gestures,
      duration: 30,
      hasProductIntegration: !!productImage,
      enhancement: "did_realistic_ugc",
      provider: "d-id"
    });

  } catch (error) {
    console.error("Error generating D-ID avatar video:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to generate D-ID avatar video",
      details: error.message
    }, { status: 500 });
  }
}

// D-ID API Integration with Enhanced Error Handling
async function createDIDVideo({ avatarImage, audioUrl, script, avatarPersonality, tone, voiceStyle }) {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    avatarImage,
    audioUrl,
    scriptLength: Array.isArray(script) ? script.length : typeof script === 'string' ? script.length : 0,
    avatarPersonality,
    tone,
    voiceStyle
  };

  console.log('🎬 Starting D-ID avatar generation:', debugInfo);

  try {
    const DID_API_KEY = process.env.DID_API_KEY;
    const DID_API_URL = "https://api.d-id.com/talks";

    if (!DID_API_KEY) {
      console.warn('⚠️ D-ID API key not found, using fallback method');
      return await createFallbackVideo({ avatarImage, audioUrl, script });
    }

    // Validate inputs
    if (!avatarImage || !audioUrl) {
      throw new Error('Missing required inputs: avatarImage or audioUrl');
    }

    // Validate audio URL accessibility
    try {
      const audioCheck = await fetch(audioUrl, { method: 'HEAD' });
      if (!audioCheck.ok) {
        throw new Error(`Audio URL not accessible: ${audioCheck.status}`);
      }
      console.log('✅ Audio URL validated successfully');
    } catch (audioError) {
      console.error('❌ Audio URL validation failed:', audioError);
      throw new Error(`Invalid audio URL: ${audioError.message}`);
    }

    // Enhanced script for better lip-sync
    const enhancedScript = enhanceScriptForLipSync(script, tone, voiceStyle);
    console.log('📝 Enhanced script created:', { 
      originalLength: typeof script === 'string' ? script.length : JSON.stringify(script).length,
      enhancedLength: enhancedScript.length 
    });

    // D-ID API payload with validation
    const didPayload = {
      script: {
        type: "audio",
        audio_url: audioUrl,
        reduce_noise: true,
        ssml: false
      },
      source_url: avatarImage,
      config: {
        fluent: true,
        pad_audio: 0.0,
        stitch: true,
        align_driver: true,
        align_expand_factor: 1.0,
        auto_match: true,
        normalization_factor: 1.0,
        sharpen: true,
        result_format: "mp4"
      },
      webhook: null
    };

    console.log('🚀 Sending request to D-ID API...');
    
    // Create the video with timeout
    const createResult = await Promise.race([
      fetch(DID_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${DID_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(didPayload)
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('D-ID API request timeout')), 30000)
      )
    ]);

    const createData = await createResult.json();
    console.log('📥 D-ID API response:', { 
      status: createResult.status, 
      ok: createResult.ok,
      hasId: !!createData.id,
      message: createData.message 
    });
    
    if (!createResult.ok) {
      const errorMsg = `D-ID API error (${createResult.status}): ${createData.message || createData.error || 'Unknown error'}`;
      console.error('❌ D-ID API failed:', errorMsg);
      throw new Error(errorMsg);
    }

    if (!createData.id) {
      throw new Error('D-ID API did not return a talk ID');
    }

    const talkId = createData.id;
    console.log('✅ D-ID talk created successfully:', { talkId });

    // Poll for completion with enhanced monitoring
    console.log('⏳ Starting polling for completion...');
    const videoUrl = await pollDIDCompletion(talkId, DID_API_KEY);
    
    console.log('🎉 D-ID avatar generation completed successfully:', { videoUrl });
    return {
      success: true,
      videoUrl: videoUrl,
      talkId: talkId,
      provider: 'did',
      debugInfo
    };

  } catch (error) {
    console.error('💥 D-ID API error:', {
      error: error.message,
      stack: error.stack,
      debugInfo
    });
    
    // Enhanced fallback with error context
    console.log('🔄 Falling back to Replicate...');
    const fallbackResult = await createFallbackVideo({ avatarImage, audioUrl, script });
    
    return {
      ...fallbackResult,
      fallbackReason: error.message,
      originalProvider: 'did',
      debugInfo
    };
  }
}

// Enhanced D-ID polling with detailed monitoring
async function pollDIDCompletion(talkId, apiKey, maxAttempts = 36, interval = 5000) {
  const DID_API_URL = `https://api.d-id.com/talks/${talkId}`;
  const startTime = Date.now();
  
  console.log(`🔄 Starting polling for talk ID: ${talkId}`);
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await fetch(DID_API_URL, {
        headers: {
          "Authorization": `Basic ${apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      
      console.log(`📊 Poll attempt ${attempt + 1}/${maxAttempts} (${elapsed}s):`, {
        status: data.status,
        hasResultUrl: !!data.result_url,
        message: data.message
      });

      if (data.status === "done" && data.result_url) {
        console.log(`✅ D-ID processing completed in ${elapsed}s:`, data.result_url);
        return data.result_url;
      }

      if (data.status === "error") {
        const errorMsg = `D-ID processing failed: ${data.message || 'Unknown error'}`;
        console.error('❌ D-ID processing error:', errorMsg);
        throw new Error(errorMsg);
      }

      if (data.status === "rejected") {
        const rejectMsg = `D-ID request rejected: ${data.message || 'Content policy violation'}`;
        console.error('🚫 D-ID request rejected:', rejectMsg);
        throw new Error(rejectMsg);
      }

      // Log progress for long-running jobs
      if (data.status === "started" || data.status === "processing") {
        console.log(`⏳ D-ID still processing... (${data.status})`);
      }

      // Wait before next poll
      if (attempt < maxAttempts - 1) {
        await new Promise(resolve => setTimeout(resolve, interval));
      }

    } catch (error) {
      console.error(`❌ Polling attempt ${attempt + 1} failed:`, error.message);
      
      // Don't retry immediately on auth errors
      if (error.message.includes('401') || error.message.includes('403')) {
        throw new Error(`Authentication failed: ${error.message}`);
      }
      
      if (attempt === maxAttempts - 1) {
        throw error;
      }
      
      // Shorter wait on error
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  const totalTime = Math.round((Date.now() - startTime) / 1000);
  const timeoutMsg = `D-ID video generation timed out after ${totalTime}s (${maxAttempts} attempts)`;
  console.error('⏰ Timeout:', timeoutMsg);
  throw new Error(timeoutMsg);
}

// Fallback to existing Replicate method
async function createFallbackVideo({ avatarImage, audioUrl, script }) {
  try {
    const Replicate = require("replicate");
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const output = await replicate.run(
      "cjwbw/sadtalker:3aa3dac9353cc4d6bd62a8772b0e1821148c2ca50c946e8ddc09f0f8da5c1046",
      {
        input: {
          source_image: avatarImage,
          driven_audio: audioUrl,
          still: false,
          use_eyeblink: true,
          use_enhanced: true,
          only_enhance_face: false,
          preprocess: "crop"
        }
      }
    );

    return {
      success: true,
      videoUrl: output
    };

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Enhance script for better lip-sync
function enhanceScriptForLipSync(script, tone, voiceStyle) {
  let enhancedScript = "";
  
  if (Array.isArray(script)) {
    enhancedScript = script.map(item => item.contentText || item.text || item).join(" ");
  } else {
    enhancedScript = script;
  }

  // Add tone-specific enhancements
  const toneEnhancements = {
    excited: { 
      prefix: "Hey there! ",
      suffix: " Isn't that amazing?",
      pacing: "fast"
    },
    professional: {
      prefix: "Good day. ",
      suffix: " Thank you for your attention.",
      pacing: "moderate"
    },
    friendly: {
      prefix: "Hi friend! ",
      suffix: " Hope this helps!",
      pacing: "casual"
    },
    confident: {
      prefix: "Listen up. ",
      suffix: " That's the truth.",
      pacing: "assertive"
    }
  };

  const enhancement = toneEnhancements[tone] || toneEnhancements.friendly;
  
  return `${enhancement.prefix}${enhancedScript}${enhancement.suffix}`;
}

// Product background integration
async function enhanceWithProductBackground(videoUrl, productImage, productName, tone) {
  try {
    // This would integrate with video editing service
    // For now, return original URL
    // In production, you'd use ffmpeg or similar to composite
    return videoUrl;
    
  } catch (error) {
    console.error("Product background enhancement failed:", error);
    return videoUrl;
  }
}
