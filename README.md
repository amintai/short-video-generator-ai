
# 🎬 Short Video Generator: AI-Powered Micro SaaS Platform

An AI-powered full-stack video generation SaaS that allows users to effortlessly create short, branded videos with script, audio, images, and captions — all in under 60 seconds.

## 🚀 Overview

The **Short Video Generator** is a Micro SaaS platform built to simplify video creation for solo creators, marketers, and small businesses. Powered by cutting-edge AI, users can generate, download, and share short-form videos by selecting simple inputs like topic and duration. The platform uses a **coin-based monetization model**, allowing flexibility for free and paid users.

---

## 🧠 Core Features

- ✅ **AI Video Generation**: Create professional short videos with AI-generated script, voice, captions, and visuals.
- 💰 **Coin-Based System**: Each video costs coins; users can purchase more via in-app purchases.
- 🎯 **Custom Parameters**: Choose duration and topic to personalize content.
- 🔐 **Auth System**: Sign up / log in to manage your videos and coins.
- 📥 **Downloadable Videos**: Save your generated videos offline.
- 📲 **1-Click Sharing**: Share directly to WhatsApp, Facebook, Instagram, and more.

---

## 🧩 System Architecture & Flow

### 1. 🔐 Authentication
- New users sign up, and data is saved to the database.
- Returning users can log in and access their dashboard.

### 2. 🎛️ Video Generation Pipeline

**Step-by-step Breakdown:**

| Step              | Service/Technology Used                          | Description                                                  |
|-------------------|--------------------------------------------------|--------------------------------------------------------------|
| 🎯 Input          | React, Next.js UI                                | User selects topic + video duration                          |
| 🔻 Coin Deduction | Firebase / Supabase                              | Deducts coins from user balance                              |
| 📜 Script         | Gemini AI                                        | Generates video script with text and image prompts           |
| 🎧 Audio          | Google Cloud Text-to-Speech                      | Converts script to voice (MP3)                               |
| ✍️ Captions       | AssemblyAI                                       | Generates SRT captions                                       |
| 🖼️ Image Gen     | AI-powered image prompt tool (e.g. DALL·E)       | Creates visual scenes matching script                        |
| 🎞️ Compilation   | Server-side renderer / FFmpeg (planned)          | Merges audio, images, captions into a cohesive video         |
| 🗃️ Storage        | Firebase Storage                                 | Stores audio, images, captions, and final video              |

---

### 3. 📤 Download & Share
- Users can download the video file directly.
- 1-click sharing across WhatsApp, Instagram, Facebook, and more.

---

## 🌱 Future Improvements

### 🧠 Enhanced AI Capabilities
- [x] Voice tone/style modulation
- [x] Multi-language text-to-speech and subtitles
- [ ] Smart scene suggestion & transitions

### 🛠️ UX & Editor Enhancements
- [x] Template-based video creation
- [ ] Real-time video preview
- [ ] Drag & drop video editor

### 💸 Monetization & Growth
- [ ] Freemium access with limited free coins
- [ ] Monthly/annual subscription plans
- [ ] Affiliate/referral program
- [ ] User-generated video marketplace

---

## 🔗 Inspiration & Related Tools

- [Revid AI](https://www.revid.ai/) – Commercial AI-powered video editor
- Canva Video, Lumen5 – Platforms that inspired easy visual storytelling

---

## 🧪 Tech Stack

| Layer            | Technology Used                   |
|------------------|-----------------------------------|
| Frontend         | React, Next.js, Tailwind CSS       |
| Backend/API      | Node.js, Firebase, Supabase        |
| AI Integration   | Gemini AI, Google TTS, AssemblyAI  |
| Storage          | Firebase Storage                   |
| Auth & Database  | Firebase Auth / Supabase           |
| Deployment       | Vercel (Frontend)                  |

---

## 🧑‍💻 Getting Started

\`\`\`bash
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
\`\`\`

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
