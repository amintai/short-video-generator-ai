const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Write a script to generate 30 seconds video on topic: Interesting historical story along with AI image prompt in Realistic format for each scene and give me result in JSON format with imagePrompt and ContetText as field, No Plain Text\n",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n{\n  "scenes": [\n    {\n      "imagePrompt": "A dimly lit, stone-walled room in a medieval castle. A young woman, Elara, with determined eyes and simple clothes, is hunched over a large book, illuminated by a single flickering candle. The book is filled with strange symbols and diagrams. Focus on the textures of the stone and parchment, with a realistic and slightly grainy feel.",\n      "contentText": "Scene 1: 14th century Europe. Elara, a young scholar, secretly studies ancient texts, forbidden by the Church. She believes they hold the key to a lost science."\n    },\n    {\n      "imagePrompt": "A bustling medieval marketplace in the morning light. Merchants are setting up stalls with colorful fabrics, fresh produce, and handcrafted goods. A hooded figure, subtly different from the other townsfolk, moves through the crowd, occasionally glancing around cautiously. Use a wide, establishing shot with a slightly hazy atmosphere.",\n        "contentText": "Scene 2: A hidden network of scholars, spread across the land, keeps Elara informed. Her message, coded in the book, speaks of an anomaly in nature."\n    },\n    {\n        "imagePrompt":"A panoramic view of a vast, open plain, under a clear blue sky. A large, unnatural geological formation shimmers in the distance, appearing as if it\'s made of crystal or glass. A group of travellers on horseback, including Elara and the hooded figure, are riding toward it, appearing small against the landscape. Capture the scale and the strange phenomenon with realistic lighting.",\n        "contentText":"Scene 3: The network uncovers a hidden anomaly, located outside the walls of civilization. Elara and a companion embark on a journey of discovery."\n    },\n    {\n        "imagePrompt": "A close-up shot of the shimmering geological formation. It\'s composed of interconnected crystalline structures, pulsating with a soft, inner light. Elara reaches out to touch it, her expression a mix of awe and caution. The focus is on the intricate details of the crystal and her hand, rendered with high clarity and realism.",\n         "contentText":"Scene 4: The anomaly reveals itself - a structure unknown to humankind. It vibrates with a strange energy, its surface reflecting the surrounding landscape."\n\n    },\n    {\n      "imagePrompt": "A POV shot looking through the crystal structure. Inside, floating orbs of light dance, illuminating walls covered in complex diagrams. Elara\'s face, reflecting the light, appears amazed and filled with wonder. Realistic rendering of the floating lights and the intricacy of the diagrams are key.",\n      "contentText": "Scene 5: The interior reveals another dimension, a convergence of light and information. Elara is not just a scholar anymore, she\'s an explorer."\n    },\n     {\n       "imagePrompt": "A quick montage of close-ups: Elara\'s hand tracing symbols in her book, the hooded figure\'s determined eyes, a horse\'s hooves kicking up dust, the crystal structure pulsing with more energy. These images should be presented with dynamic cuts and a faster pace, creating a sense of urgency. Maintain a realistic visual style with slight grain and natural lighting.",\n        "contentText":"Scene 6: The forbidden knowledge Elara now holds, could change the world."\n      }\n  ]\n}\n```\n',
        },
      ],
    },
  ],
});
