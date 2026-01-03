# AI Resume Generator

> **Production-Ready Resume Builder** powered by AI with modern design and accessibility features

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

- 🤖 **AI-Powered Generation** - Automatically generate tailored resumes from job descriptions
- 🎨 **Premium Design** - Modern, glassmorphic UI with smooth animations
- ♿ **Accessible** - WCAG AA compliant with full keyboard navigation
- 📱 **Responsive** - Works seamlessly on desktop, tablet, and mobile
- 🎯 **ATS-Optimized** - Clean formatting that passes Applicant Tracking Systems
- 💾 **Multi-Resume Management** - Save and manage multiple resumes
- 🖨️ **PDF Export** - One-click PDF download
- ⚡ **Real-time Editing** - WYSIWYG editor with live preview
- 🔐 **Secure Authentication** - JWT-based auth with encrypted storage

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ and npm/yarn
- **Backend API** running on `http://localhost:5002` (see [Backend Setup](#backend-setup))

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd my-resume

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 📁 Project Structure

```
my-resume/
├── src/
│   ├── components/
│   │   ├── editor/          # Resume editing components
│   │   │   └── ResumeSections.jsx
│   │   └── ui/              # Reusable UI components
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       ├── Input.jsx    # ✨ NEW: Accessible input
│   │       ├── Modal.jsx    # ✨ NEW: Accessible modal
│   │       ├── Select.jsx
│   │       └── TextArea.jsx
│   ├── context/
│   │   └── ResumeContext.jsx # Global state management
│   ├── lib/
│   │   └── axios.js         # API client configuration
│   ├── pages/
│   │   ├── Dashboard.jsx    # Resume management
│   │   ├── Editor.jsx       # Resume editor
│   │   ├── Generator.jsx    # AI generation
│   │   ├── Home.jsx         # Landing page
│   │   ├── Login.jsx        # ✨ REDESIGNED
│   │   ├── Signup.jsx       # ✨ REDESIGNED
│   │   └── LexicalEditor.jsx
│   ├── utils/
│   │   ├── constants.js     # ✨ NEW: Centralized constants
│   │   ├── validation.js    # ✨ NEW: Form validation
│   │   └── utils.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── package.json
└── README.md
```

---

## 🎨 Component Library

### Button Component

```jsx
import { Button } from './components/ui/Button';

// Variants: primary, secondary, outline, danger
<Button variant="primary" onClick={handleClick}>
  Click Me
</Button>
```

### Input Component (NEW ✨)

```jsx
import { Input } from './components/ui/Input';

<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  required
/>
```

### Modal Component (NEW ✨)

```jsx
import { Modal, ConfirmModal } from './components/ui/Modal';

// Basic Modal
<Modal isOpen={isOpen} onClose={onClose} title="Modal Title">
  <p>Modal content</p>
</Modal>

// Confirmation Modal
<ConfirmModal
  isOpen={isOpen}
  onClose={onClose}
  onConfirm={handleConfirm}
  title="Delete Resume"
  message="Are you sure?"
  variant="danger"
/>
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5002/api/v1
```

### Tailwind Configuration

Custom colors and fonts are defined in `tailwind.config.js`:

```js
colors: {
  primary: '#2563EB',
  secondary: '#475569',
  paper: '#FFFFFF',
  canvas: '#F3F4F6',
}
```

---

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run linter
npm run lint
```

---

## 📦 Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

The build output will be in the `dist/` directory.

---

## ♿ Accessibility Features

This application is built with accessibility as a priority:

- ✅ **WCAG AA Compliant** - Proper contrast ratios and semantic HTML
- ✅ **Keyboard Navigation** - Full keyboard support with visible focus indicators
- ✅ **Screen Reader Support** - ARIA labels and live regions
- ✅ **Form Validation** - Clear error messages with visual and text feedback
- ✅ **Focus Management** - Proper focus trapping in modals

### Keyboard Shortcuts

- `Tab` / `Shift+Tab` - Navigate between elements
- `Enter` / `Space` - Activate buttons and links
- `Escape` - Close modals and dropdowns

---

## 🎯 User Flow

1. **Landing Page** (`/`) - View features and examples
2. **Sign Up** (`/signup`) - Create account with validation
3. **Generate Resume** (`/generate`) - Paste job description, select level
4. **Edit Resume** (`/editor`) - Customize with Form or Doc mode
5. **Save & Download** - Save to dashboard or export as PDF
6. **Dashboard** (`/dashboard`) - Manage all saved resumes

---

## 🔐 Authentication

The app uses JWT-based authentication:

- Tokens stored in `localStorage`
- Axios interceptor adds `Authorization` header
- Protected routes redirect to login if unauthenticated

```js
// Example: Protected API call
const response = await axiosInstance.get('/resumes');
```

---

## 🎨 Design System

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | #2563EB | Primary actions, links |
| `secondary` | #475569 | Secondary text |
| `paper` | #FFFFFF | Card backgrounds |
| `canvas` | #F3F4F6 | Page backgrounds |

### Typography

- **Sans**: Inter, Roboto
- **Serif**: Merriweather, Garamond

### Spacing Scale

Uses Tailwind's default spacing scale (4px base unit)

---

## 🐛 Known Issues & Limitations

- [ ] Mobile editor experience needs optimization for A4 paper size
- [ ] Offline mode not yet implemented
- [ ] No undo/redo in editor
- [ ] Limited to 2 resume templates

---

## 🚧 Roadmap

- [ ] Add more resume templates
- [ ] Implement real-time collaboration
- [ ] Add resume analytics (views, downloads)
- [ ] Support for multiple languages
- [ ] Integration with LinkedIn
- [ ] AI-powered resume scoring

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **Framer Motion** - Smooth animations
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **React Quill** - Rich text editing

---

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Email: support@example.com

---

**Made with ❤️ by the Resume Builder Team**
