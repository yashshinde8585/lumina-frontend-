# Lumina — AI-Powered Resume Builder

> Build, tailor, and track your job applications — all in one place.

**Lumina** is a modern, full-featured resume platform that helps you create polished resumes with AI assistance, manage multiple resume versions, and track your entire job application journey through a visual Kanban board.

---

## Features

**Resume Builder**
- AI-powered content generation using the Gemini Pro model
- Rich text editor with Lexical for fine-grained formatting control
- Drag-and-drop section reordering via dnd-kit
- Live preview with export to PDF via react-to-print
- Import existing resumes from file

**Smart Job Tracker**
- Kanban-style job board — Saved → Applied → Screening → Aptitude → Technical → Interview → Offer
- Drag a resume onto a job column to instantly create a linked application
- Drop a resume directly onto a job card to trigger AI tailoring
- One-way status enforcement to keep your pipeline clean
- Confetti celebration on offer stage 🎉

**Analytics Dashboard**
- Application funnel visualization with Recharts
- Status history tracking per job card
- Round scheduling (aptitude, technical, interview) with date picker
- Stale-while-revalidate data strategy for instant load times

**Auth & Account**
- Email / password signup and login
- Google OAuth sign-in via `@react-oauth/google`
- Protected routes for user and admin roles
- Persistent board state synced to backend with localStorage fallback

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS + Emotion |
| UI Components | MUI, Lucide React |
| Rich Text | Lexical Editor |
| Drag & Drop | dnd-kit |
| Animations | Framer Motion |
| HTTP Client | Axios |
| Routing | React Router DOM v7 |
| Charts | Recharts |
| Auth | JWT + Google OAuth |

---

## Getting Started

### Prerequisites

- Node.js `>=18`
- The [Backend API](https://github.com/yashshinde8585/backend-my-resume) running locally on port `5002`

### Installation

```bash
# Clone the repository
git clone https://github.com/yashshinde8585/my-resume.git
cd my-resume

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
VITE_API_URL=http://localhost:5002
```

### Run Locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

---

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── auth/           # ProtectedRoute, auth guards
│   ├── dashboard/      # JobBoard, AnalyticsSection, JobDetailsDrawer
│   ├── layout/         # AppHeader
│   └── ui/             # Button, ErrorBoundary, etc.
├── context/            # ResumeContext (global state)
├── hooks/              # Custom React hooks
├── pages/              # Route-level page components
├── services/           # API service layer (authService, resumeService)
├── types/              # TypeScript type definitions
├── utils/              # Constants and helper functions
└── App.jsx             # Router configuration
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Lint with ESLint |
| `npm run preview` | Preview production build |

---

## License

MIT
