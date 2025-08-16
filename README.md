# 🎬 Short Video Generator: AI-Powered Micro SaaS Platform

An AI-powered full-stack video generation SaaS that allows users to effortlessly create short, branded videos with script, audio, images, and captions — all in under 60 seconds.

---

## 🚀 Overview

The **Short Video Generator** is a Micro SaaS platform built to simplify video creation for solo creators, marketers, and small businesses.  
Powered by cutting-edge AI, users can **generate, download, and share short-form videos** by selecting simple inputs like topic and duration.  

The platform uses a **coin-based monetization model**, allowing flexibility for both free and paid users.

---

## 🧠 Core Features

- ✅ **AI Video Generation**: Create professional short videos with AI-generated script, voice, captions, and visuals.  
- 💰 **Coin-Based System**: Each video costs coins; users can purchase more via in-app purchases.  
- 🎯 **Custom Parameters**: Choose duration, topic, and content style to personalize videos.  
- 🔐 **Auth System**: Secure login/signup with Clerk & Firebase Auth.  
- 📥 **Downloadable Videos**: Save generated videos offline in MP4.  
- 📲 **1-Click Sharing**: Share instantly to WhatsApp, Facebook, Instagram, TikTok (coming soon).  
- 📊 **User Dashboard**: Track video history, credits, and recent activity.  
- 🧩 **Templates & Styles**: Pick from branded templates, avatars, or pre-set video themes.  

---

## 🧩 System Architecture & Flow

### 1. 🔐 Authentication
- Users sign up via Clerk/Firebase, coins & data stored in Supabase.
- Returning users log in and access personalized dashboard.

### 2. 🎛️ Video Generation Pipeline

| Step              | Service/Technology Used                          | Description                                                  |
|-------------------|--------------------------------------------------|--------------------------------------------------------------|
| 🎯 Input          | React, Next.js UI                                | User selects topic + video duration                          |
| 🔻 Coin Deduction | Supabase / Firebase                              | Deducts coins from user balance                              |
| 📜 Script         | Gemini AI                                        | Generates video script with text + image prompts             |
| 🎧 Audio          | Google Cloud Text-to-Speech                      | Converts script to realistic voices (multi-language support) |
| ✍️ Captions       | AssemblyAI                                       | Generates subtitles & captions                               |
| 🖼️ Image Gen     | DALL·E / Stable Diffusion                        | AI-generated images for each scene                           |
| 🎞️ Compilation   | FFmpeg (planned server-side renderer)            | Merges audio, images, captions into cohesive video           |
| 🗃️ Storage        | Firebase Storage                                 | Stores media assets & final video                            |

---

### 3. 📤 Download & Share
- Download generated videos instantly (MP4 format).  
- Share directly to WhatsApp, Instagram, Facebook.  
- **Upcoming:** Auto-publishing to TikTok & YouTube Shorts.  

---

## 🌱 Enhanced & Upcoming Features

### 🧠 Enhanced AI Capabilities
- [x] Multi-language support (subtitles + voice)  
- [x] Voice tone & style modulation (formal, casual, energetic)  
- [ ] Smart scene transitions (smooth cuts, fades, zooms)  
- [ ] AI-powered B-roll suggestions for better storytelling  

### 🛠️ UX & Editor Enhancements
- [x] Template-based video creation (branded presets)  
- [ ] Real-time video preview before final render  
- [ ] Drag & drop video editor with timeline  
- [ ] Custom aspect ratios (9:16, 16:9, 1:1 for socials)  

### 🤝 Collaboration & Workflow
- [ ] Team workspaces (multi-user collaboration)  
- [ ] Commenting & feedback system  
- [ ] Version control (rollback to previous edits)  
- [ ] Scheduled publishing & content calendar  

### 📊 Analytics & Insights
- [ ] View counts, engagement rates, and CTR tracking  
- [ ] A/B testing for different video variants  
- [ ] Export & ROI analytics dashboard  

### 💸 Monetization & Growth
- [x] Coin-based credits system  
- [ ] Freemium access with limited free coins  
- [ ] Monthly/annual subscription plans  
- [ ] Affiliate/referral program  
- [ ] Marketplace for user-generated templates & effects  

---

## 🔗 Inspiration & Related Tools

- [Revid AI](https://www.revid.ai/) – Commercial AI-powered video editor  
- Canva Video, Lumen5 – Inspiration for simplified storytelling  

---

## 🧪 Tech Stack

| Layer            | Technology Used                   |
|------------------|-----------------------------------|
| Frontend         | React, Next.js, Tailwind CSS       |
| Backend/API      | Node.js, Supabase, Firebase        |
| AI Integration   | Gemini AI, Google TTS, AssemblyAI  |
| Storage          | Firebase Storage                   |
| Auth & Database  | Clerk, Firebase Auth, Supabase     |
| Video Rendering  | FFmpeg (planned), serverless jobs  |
| Deployment       | Vercel (Frontend)                  |

---

## 🧑‍💻 Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/amintai/short-video-generator-ai.git
cd short-video-generator-ai

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
# Fill in API keys for Firebase, Gemini, Google TTS, AssemblyAI, etc.

# 4. Run the dev server
npm run dev


---

## 🙌 Contribution

Contributions, issues, and feature requests are welcome!  
Please open a pull request or start a discussion.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## ✨ Creator

**Amin Tai** – [amintai.github.io/mywebsite](https://amintai.github.io/mywebsite/)  
Connect: [LinkedIn](https://linkedin.com/in/amintai) | [GitHub](https://github.com/amintai)
