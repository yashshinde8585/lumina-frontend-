# AI Resume Generator

![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18.0.0-blue?logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-3.0.0-cyan?logo=tailwind-css)

## 📌 Project Title & Description
**AI Resume Generator** is a modern, AI-powered web application designed to streamline the resume creation process. It leverages Google's Gemini AI to automatically generate professional, ATS-optimized content from simple job descriptions, wrapping it all in a stunning glassmorphic user interface.

## ❓ Problem Statement
Job seekers often struggle to create resumes that pass Applicant Tracking Systems (ATS) while maintaining a professional design. Writing tailored content for every job application is time-consuming and repetitive. Existing tools are either too clunky, expensive, or lack intelligent customization. **AI Resume Generator** solves this by combining powerful AI for content generation with a beautiful, easy-to-use editor.

## ✨ Features
- **🤖 AI-Powered Content**: Paste a job description and experience level to generate tailored resume sections instantly using Google Gemini.
- **🎨 Modern Glassmorphism UI**: A visually striking, responsive interface built with Tailwind CSS and Framer Motion.
- **⚡ Real-Time WYSIWYG Editor**: Edit generated content seamlessly with a live preview.
- **📄 One-Click PDF Export**: Download your resume in a clean, professional format ready for application.
- **� Secure Authentication**: User accounts with secure login/signup to save and manage multiple resumes.
- **� Fully Responsive**: Optimized for Desktop, Tablet, and Mobile experiences.

## 🛠 Tech Stack
- **Frontend Framework**: React.js (Vite)
- **Styling**: Tailwind CSS, Vanilla CSS (for custom glassmorphism)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Context API
- **API Client**: Axios

## 📂 Project Architecture
The project follows a modular, component-based architecture for scalability and maintainability.

```
my-resume/
├── src/
│   ├── components/
│   │   ├── editor/         # Resume editing logic & sub-components
│   │   ├── home/           # Landing page specific components
│   │   ├── ui/             # Reusable atomic UI elements (Buttons, Inputs)
│   ├── context/            # Global state (Authentication, Resume Data)
│   ├── pages/              # Application Routes (Home, Dashboard, Editor)
│   ├── services/           # API integration services
│   └── utils/              # Helper functions, constants, validation
├── public/                 # Static assets
└── tailwind.config.js      # Design Token configuration
```

## 🚀 Installation & Setup Instructions

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/yourusername/my-resume.git
    cd my-resume
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Start the Development Server**
    ```bash
    npm run dev
    ```
    The application will launch at `http://localhost:5173`.

## 🔑 Environment Variables
Create a `.env` file in the root directory to configure the application.

```env
# API Base URL (Point this to your local or hosted backend)
VITE_API_BASE_URL=http://localhost:5002/api
```

## 🔌 API Endpoints / Integration
The frontend communicates with the `Backend-my-resume` service. Key integrations include:

- `POST /auth/login`: Authenticates users and retrieves JWT.
- `POST /generate`: Sends Job Description to AI and receives JSON resume structure.
- `POST /resumes`: Saves key resume data to the database.

## 📸 Screenshots
*(Placeholder for project screenshots - add images of Landing Page, Editor, and Dashboard here)*

## 🔮 Future Enhancements
- [ ] **Multi-Template Support**: Add more template designs (Minimal, Creative, Corporate).
- [ ] **AI Cover Letter**: Generate matching cover letters for resumes.
- [ ] **LinkedIn Import**: Import profile data directly from LinkedIn PDF.
- [ ] **Resume Scoring**: Real-time feedback on resume quality.

## ✍️ Author & Contact
**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---
*Built with ❤️ for job seekers everywhere.*
