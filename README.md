# IdeaForge – Idea Innovation Lab

IdeaForge is a premium, AI-powered brainstorming platform built for real-time collaboration. It allows users to map out ideas on an infinite canvas, expand them using Gemini AI, and collaborate with team members instantly.

## 🚀 Key Features

- **Infinite Canvas:** Powered by React Flow (XYFlow) for a smooth, zoomable brainstorming experience.
- **AI Idea Expansion:** Uses Gemini 1.5 Flash to automatically generate business models, features, and target users for any idea.
- **Real-time Collaboration:** Powered by Supabase Realtime (Websockets) and Presence to see teammates online and see changes instantly.
- **Voice-to-Idea:** Browser-native speech recognition to dictate ideas directly onto the board.
- **Secure Authentication:** Complete Auth flow with Supabase (Email/Password).
- **Premium UI:** Glassmorphic design system built with Tailwind CSS v4 and Framer Motion.

## 🛠️ Tech Stack & Dependencies

### Core Framework
- **Next.js 16 (React 19):** Modern app directory architecture.
- **TypeScript:** Type-safe development.

### State & Realtime
- **Zustand:** Lightweight global state management.
- **Supabase SDK (`@supabase/supabase-js`, `@supabase/ssr`):** Handles Authentication, Database, and Realtime sync.

### Visual & Interactive
- **React Flow (`@xyflow/react`):** The engine for the infinite canvas and node-based visualization.
- **Framer Motion:** High-performance animations and micro-interactions.
- **Tailwind CSS v4:** Next-generation utility-first styling.
- **Lucide React:** Beautiful, consistent iconography.

### AI Integration
- **Google Generative AI (`@google/generative-ai`):** Integration with Gemini models for intelligent idea processing.

---

## ⚙️ Getting Started

### 1. Prerequisites
- Node.js 18+ 
- A Supabase Project
- A Google AI (Gemini) API Key

### 2. Installation
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
```

### 4. Database Setup
Apply the migrations found in `supabase/migration.sql` via the Supabase SQL Editor. This will set up the:
- `profiles` table (linked to Auth)
- `ideas` and `votes` tables
- RLS (Row Level Security) policies
- Realtime publication

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to start brainstorming.

---

## 📜 License
MIT
