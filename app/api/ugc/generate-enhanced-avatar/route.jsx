import { NextResponse } from "next/server";
import Replicate from "replicate";
import { storage } from "../../../../configs/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req) {
  try {
    const { 
      avatarId, 
      audioUrl, 
      script, 
      productImage, 
      productName,
      tone,
      id 
    } = await req.json();

    if (!avatarId || !audioUrl) {
      return NextResponse.json({
        success: false,
        error: "Avatar ID and audio URL are required"
      }, { status: 400 });
    }

    // Enhanced avatar mapping with gesture-capable avatars
    const enhancedAvatars = {
      "sara": {
        image: "https://replicate.delivery/pbxt/IJBgZHPzCFfvJ1oaK7z3ygI6L7y6KGJjZWVIxZyPBW7jA7OJA/output.jpg",
        personality: "enthusiastic",
        gestures: ["pointing", "holding", "excited_wave"],
        body_visible: true
      },
      "alex": {
        image: "https://replicate.delivery/pbxt/IJBgZHPzCFfvJ1oaK7z3ygI6L7y6KGJjZWVIxZyPBW7jA7OJB/output.jpg",
        personality: "professional",
        gestures: ["presentation", "thumbs_up", "open_palm"],
        body_visible: true
      },
      "emma": {
        image: "https://replicate.delivery/pbxt/IJBgZHPzCFfvJ1oaK7z3ygI6L7y6KGJjZWVIxZyPBW7jA7OJC/output.jpg",
        personality: "friendly",
        gestures: ["heart_hands", "clapping", "product_showcase"],
        body_visible: true
      },
      "david": {
        image: "https://replicate.delivery/pbxt/IJBgZHPzCFfvJ1oaK7z3ygI6L7y6KGJjZWVIxZyPBW7jA7OJD/output.jpg",
        personality: "confident",
        gestures: ["strong_point", "crossed_arms", "approval_nod"],
        body_visible: true
      },
      "sophia": {
        image: "https://replicate.delivery/pbxt/IJBgZHPzCFfvJ1oaK7z3ygI6L7y6KGJjZWVIxZyPBW7jA7OJE/output.jpg",
        personality: "elegant",
        gestures: ["graceful_wave", "delicate_hold", "gentle_point"],
        body_visible: true
      },
      "michael": {
        image: "https://replicate.delivery/pbxt/IJBgZHPzCFfvJ1oaK7z3ygI6L7y6KGJjZWVIxZyPBW7jA7OJF/output.jpg",
        personality: "energetic",
        gestures: ["dynamic_point", "victory_pose", "product_lift"],
        body_visible: true
      }
    };

    const selectedAvatar = enhancedAvatars[avatarId] || enhancedAvatars["sara"];

    // Generate background composition with product integration
    let backgroundComposition = null;
    if (productImage) {
      backgroundComposition = await createProductBackground(productImage, productName, tone);
    }

    // Step 1: Create enhanced talking head with upper body
    const talkingHeadOutput = await replicate.run(
      "cjwbw/sadtalker:3aa3dac9353cc4d6bd62a8772b0e1821148c2ca50c946e8ddc09f0f8da5c1046",
      {
        input: {
          source_image: selectedAvatar.image,
          driven_audio: audioUrl,
          still: false,
          use_eyeblink: true,
          use_idle_mode: false,
          length_of_audio: 0,
          use_enhanced: true,
          only_enhance_face: false,
          preprocess: "crop",
          // Enhanced parameters for more realistic movement
          pose_style: selectedAvatar.personality === "energetic" ? "dynamic" : "natural",
          expression_scale: tone === "excited" ? 1.3 : 1.0,
          eye_blinking: true,
          head_pose: true
        }
      }
    );

    // Step 2: If we have product image, create product integration overlay
    let finalVideoUrl = talkingHeadOutput;
    
    if (productImage && backgroundComposition) {
      // Composite the avatar with product background/foreground
      finalVideoUrl = await replicate.run(
        "tencentarc/gfpgan:9283608cc6b7be6b65a8e44983db012355fde4132009bf99d976b2f0896856a3",
        {
          input: {
            img: talkingHeadOutput,
            background: backgroundComposition,
            scale: 2,
            // Add product integration parameters
            blend_mode: "overlay",
            opacity: 0.8
          }
        }
      );
    }

    // Step 3: Add gesture overlay if supported
    if (selectedAvatar.gestures && script) {
      finalVideoUrl = await addGestureOverlay(
        finalVideoUrl, 
        selectedAvatar.gestures, 
        script, 
        tone
      );
    }

    // Upload to Firebase for persistent storage
    let storedVideoUrl = finalVideoUrl;
    if (typeof finalVideoUrl === "string" && finalVideoUrl.startsWith("http")) {
      try {
        const response = await fetch(finalVideoUrl);
        const videoBuffer = await response.arrayBuffer();
        
        const storageRef = ref(storage, `enhanced-ugc-videos/${id}.mp4`);
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
      enhancement: "realistic_ugc_style"
    });

  } catch (error) {
    console.error("Error generating enhanced avatar video:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to generate enhanced avatar video",
      details: error.message
    }, { status: 500 });
  }
}

// Helper function to create product background composition
async function createProductBackground(productImage, productName, tone) {
  try {
    // Create a UGC-style background with the product
    const backgroundPrompt = `Create a modern UGC advertisement background featuring ${productName}, 
    ${tone} mood, clean aesthetic, product showcase style, Instagram reels format, 
    vertical 9:16 aspect ratio, soft lighting, minimal background`;

    const backgroundOutput = await replicate.run(
      "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
      {
        input: {
          prompt: backgroundPrompt,
          image: productImage,
          width: 512,
          height: 768,
          prompt_strength: 0.7,
          num_outputs: 1,
          num_inference_steps: 50,
          guidance_scale: 7.5,
          scheduler: "DPMSolverMultistep"
        }
      }
    );

    return backgroundOutput[0];
  } catch (error) {
    console.error("Error creating product background:", error);
    return null;
  }
}

// Helper function to add gesture overlays
async function addGestureOverlay(videoUrl, availableGestures, script, tone) {
  try {
    // Analyze script to determine appropriate gestures
    const gestureMapping = {
      "amazing": "excited_wave",
      "love": "heart_hands", 
      "recommend": "thumbs_up",
      "check out": "pointing",
      "show": "product_showcase",
      "incredible": "victory_pose",
      "perfect": "approval_nod"
    };

    let selectedGesture = "open_palm"; // default
    
    // Find the best gesture based on script content
    for (const [keyword, gesture] of Object.entries(gestureMapping)) {
      if (script.toLowerCase().includes(keyword) && availableGestures.includes(gesture)) {
        selectedGesture = gesture;
        break;
      }
    }

    // Apply gesture enhancement
    const gestureEnhancedVideo = await replicate.run(
      "lucataco/animate-diff:1531004ee4c98894ab11f8a4ce6206099e732c1da15121987a8eef54828f0663",
      {
        input: {
          path: videoUrl,
          motion_module: "mm_sd_v14.ckpt",
          prompt: `${selectedGesture} gesture, natural body movement, UGC style, ${tone} expression`,
          n_prompt: "static, rigid, unnatural movement",
          steps: 25,
          guidance_scale: 7.5
        }
      }
    );

    return gestureEnhancedVideo;
  } catch (error) {
    console.error("Error adding gesture overlay:", error);
    return videoUrl; // Return original if gesture overlay fails
  }
}
