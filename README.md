# Portfolio Website

A modern, responsive portfolio website for showcasing software, AI, and robotics engineering work. Built with React, TypeScript, Tailwind CSS, and Firebase.

## Features

- **Clean, futuristic design** with glassmorphism, soft gradients, and smooth animations
- **Home page** with hero section, featured projects grid, and resume download section
- **Project detail pages** with media gallery, GitHub links, technology tags, and descriptions
- **Multi-domain resume downloads** — separate resumes for Robotics, AI, Devices, Software Engineering, etc.
- **Admin panel** (email/password auth) for managing projects, resumes, and featured content
- **Mobile responsive** with elegant navigation
- **Code-split** admin panel for fast public page loads

## Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Framer Motion, Lucide Icons
- **Backend:** Firebase (Auth, Firestore, Storage)
- **Hosting:** Firebase Hosting (free tier)
- **Build:** Vite 6

## Getting Started

### Prerequisites

- Node.js 20+
- Firebase CLI (`npm i -g firebase-tools`)
- A Firebase project

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd portfolio-website
npm install
```

### 2. Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** → Email/Password sign-in method
3. Create a **Firestore Database** (start in production mode)
4. Enable **Storage**
5. Register a Web App and copy the config values

### 3. Environment Variables

Copy `.env.example` to `.env` and fill in your Firebase config:

```bash
cp .env.example .env
```

### 4. Create Admin User

In Firebase Console → Authentication → Add User with your email and password.

### 5. Deploy Firestore & Storage Rules

```bash
firebase login
firebase init  # select Firestore, Storage, Hosting (use existing project)
firebase deploy --only firestore:rules,storage
```

### 6. Run Locally

```bash
npm run dev
```

### 7. Deploy

```bash
npm run deploy
```

## Project Structure

```
src/
├── components/       # Shared UI components
│   ├── Footer.tsx
│   ├── Layout.tsx
│   ├── LoadingSpinner.tsx
│   ├── Navbar.tsx
│   ├── ProjectCard.tsx
│   └── SectionHeading.tsx
├── hooks/            # Custom React hooks
│   ├── useAuth.ts
│   └── useFirestore.ts
├── lib/              # Firebase config & utilities
│   ├── firebase.ts
│   └── storage.ts
├── pages/            # Route pages
│   ├── Admin.tsx
│   ├── Home.tsx
│   └── ProjectDetail.tsx
├── types/            # TypeScript type definitions
│   └── index.ts
├── App.tsx           # Router setup
├── index.css         # Global styles & Tailwind theme
└── main.tsx          # Entry point
```

## Admin Panel

Navigate to `/admin` and sign in with your Firebase Auth credentials. From there you can:

- **Add / edit / delete projects** with media uploads, tags, and technology lists
- **Toggle featured projects** that appear on the homepage
- **Add / edit / delete resumes** with PDF file uploads organized by domain

## Free Tier Considerations

This project is designed to stay within Firebase's free (Spark) plan:

- **Firestore:** 1 GiB stored, 50K reads/day, 20K writes/day
- **Storage:** 5 GB stored, 1 GB/day downloads
- **Hosting:** 10 GB stored, 360 MB/day transfer
- **Auth:** Unlimited email/password users
