# 3D Interactive Portfolio — Project Summary & Architecture Notes

This project is a hybrid personal portfolio combining a professional, modern landing page and an immersive, custom 3D car driving experience.

---

## 🛠️ Technology Stack & Packages Used

The application is built using **React (v19)** and **TypeScript**, bundled with **Vite** for fast builds and hot module replacement.

### Core Frontend & UI
*   `react` & `react-dom` (v19.2.6): The foundation of the web app.
*   `tailwindcss` (v3.4.19): Used for utility-first CSS styling across the landing page sections.
*   `framer-motion` (v12.40.0): Handles micro-animations, slide-ins, modal transitions, and smooth hover effects.
*   `lucide-react` (v1.21.0): Lightweight icon library for contact forms, skills, resume buttons, and navigation symbols.
*   `@emailjs/browser` (v4.3.3): Provides secure, backend-less form submission directly to the developer's email inbox.

### 🎮 3D Graphics & Canvas
*   `three` (v0.184.0): The underlying WebGL graphics library.
*   `@react-three/fiber` (v9.6.1): The React wrapper for Three.js, translating React components into 3D objects.
*   `@react-three/drei` (v10.7.7): Helper library offering pre-built 3D controls, shaders, standard materials, skyboxes, and camera systems.

### ⚡ State Management & Interactivity
*   `zustand` (v5.0.14): Clean, hook-based state management that updates coordinates, game statuses, and achievements globally with zero boilerplate.
*   `canvas-confetti` (v1.9.4): Triggers colorful bursts on screen when key achievements are unlocked.

---

## 🏗️ Project Architecture & How it Works

The project runs on a single-page hybrid structure, allowing recruiters to read through standard sections or hop directly into the driving game.

### 1. Global State Management (`src/store/useStore.ts`)
Tracks the active UI tab, vehicle state (speed, position, collision flags), current running mini-games, scores, and unlocked achievements:
- **Achievements**: Includes "First Drive", "Coin Collector", "Speed Demon", and "Drift King".
- **Scores**: Saves personal best times for checkpoint races in `localStorage`.

### 2. High-Performance Input handling (`src/hooks/useInput.ts`)
Listens to `keydown` and `keyup` events, mapping inputs like `w`, `a`, `s`, `d`, `Arrow Keys`, `Shift` (Wheelie), `H` (Horn), and `Space` (Drift/Brake). It holds them in a local mutable reference object to avoid causing React component re-renders on every keyboard tap inside the 3D loop.
- **Controls Modal (`src/components/ControlsModal.tsx`)**: A responsive UI overlay that detects whether the user is on mobile (touch) or desktop (keyboard) and presents device-specific controls upon loading the game. Handles landscape viewports gracefully with scrollable overflow.
- **Mobile Touch Overrides (`src/index.css`)**: Implements strict `-webkit-touch-callout: none` and `user-select: none` to prevent native browser behaviors (like long-press image download popups) from disrupting the driving experience when pressing the on-screen GAS, BRK, and HORN buttons.

### 3. Custom Physics & Driving Loop (`src/components/Car.tsx`)
Updates the car on every single tick inside `@react-three/fiber`'s `useFrame` hook using pure vector mathematics and framerate-independent spring dampening (`Math.exp` interpolation):
*   Calculates acceleration, drag, braking, and responsive tight steering.
*   **Models (`src/components/VehicleModel.tsx`)**: Renders custom massive `.glb` models like the Cyberpunk Car, utilizing automatic scaling and hidden shadow planes.
*   **Drifting Mode**: Holding `SPACE` reduces lateral tire friction and activates a dynamic tire smoke particle system (`TireSmoke` component).
*   **Dynamic Audio Engine**: Loads a real BMW engine sound (`mizanstock-bmw-xm-car-sound`) and a horn (`floraphonic-car-horn`), mapping the HTML5 Audio `playbackRate` directly to the car's simulated transmission and speed to mimic actual revving and gear shifting.

### 4. Compact 3D Environment Map (`src/components/World.tsx` & `src/components/world/`)
Coordinates are compressed within 22 units to keep exploration distances fast and minimal:
*   `Terrain.tsx` & `Water.tsx`: Creates a soft, light-gray landscape heightmap with a central transparent purple-blue lake.
*   `Roads.tsx`: Renders the road network connecting all building nodes.
*   `Buildings.tsx`: Generates unique buildings representing each portfolio project, complete with glowing interaction rings.
*   `MiniGames.tsx`: Orchestrates the triggers and reward loops for the three mini-games (Coin Challenge, Checkpoint Race, Drift Arena).
*   **Resume Zone**: Features a glowing pedestal where the user can pick up and download the customized `RajatAmbedkar_CV.docx`.

### 5. Dynamic Portfolio Data (`src/data/personalInfo.ts`)
Houses the developer's experience, project data, and a categorized skills list that dynamically generates a styled grid (Frontend, Backend, Languages, DevOps, Styling, etc.) on the React landing page (`src/pages/landing/Skills.tsx`). Empty social links (like a missing Twitter profile) are automatically filtered out.

### 6. Email Delivery (`src/pages/landing/Contact.tsx`)
A fully functional Contact section powered by EmailJS. The application utilizes Vite environment variables (`VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`) to securely route messages submitted by recruiters directly to the developer's email account.

---

## 🚀 How to Run & Build

### Development Server
Run the local dev server:
```bash
npm run dev
```
It usually opens on `http://localhost:5173/` or `http://localhost:5174/`.

### Production Build
Compile and bundle the project for distribution (e.g. Netlify/Vercel):
```bash
npm run build
```
The output will be saved in the `dist` folder. The app includes a `public/_redirects` file to support single-page application routing when hosted on Netlify.
