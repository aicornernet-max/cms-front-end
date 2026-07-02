# CMS Admin Frontend

A modern Content Management System (CMS) Admin Panel built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. This application allows administrators to manage tools, categories, pages, SEO content, FAQs, images, and other CMS resources through an intuitive interface.

---

# Features

- Authentication
- Dashboard
- Tool Management
- Tool Content Management
- Category Management
- Page Management
- SEO Management
- FAQ Management
- Image Uploads
- Rich Text Editor
- Form Validation
- Drag & Drop Support
- Responsive Admin UI

---

# Tech Stack

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS

### State Management

- Zustand

### Routing

- React Router

### Form Handling

- React Hook Form
- Zod

### HTTP Client

- Axios

### Rich Text Editor

- TipTap
- React Quill

### UI Libraries

- Lucide React
- Iconify
- DnD Kit

---

# Folder Structure

```
src/
│
├── api/                 # API services
├── app/                 # Application entry
├── components/          # Reusable UI components
├── features/            # Feature modules
│   ├── Authentication
│   ├── Categories
│   ├── Pages
│   ├── Tools
│   ├── Tool Content
│   └── Dashboard
│
├── hooks/
├── layouts/
├── routes/
├── services/
├── types/
├── utils/
└── main.tsx
```

---

# Prerequisites

Before running the project, install:

- Node.js (v20 or later recommended)
- npm

Check versions:

```bash
node -v
npm -v
```

---

# Installation

## 1. Clone the repository

```bash
git clone <repository-url>
```

## 2. Open the project

```bash
cd cms-for-blog-main
```

## 3. Install dependencies

```bash
npm install
```

---

# Environment Setup

Create a `.env` file in the project root.

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

If a `.env.example` file exists, copy it:

```bash
cp .env.example .env
```

On Windows:

```cmd
copy .env.example .env
```

---

# Run Development Server

```bash
npm run dev
```

The application will start at

```
http://localhost:5173
```

---

# Build for Production

```bash
npm run build
```

The production files will be generated inside:

```
dist/
```

---

# Preview Production Build

```bash
npm run preview
```

---

# Lint Project

```bash
npm run lint
```

---

# Available Scripts

| Command | Description |
|----------|-------------|
| npm install | Install dependencies |
| npm run dev | Start development server |
| npm run build | Create production build |
| npm run preview | Preview production build |
| npm run lint | Run ESLint |

---

# Backend Requirement

This frontend requires the CMS Backend API.

Configure the backend URL inside:

```
.env
```

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

Make sure the backend server is running before using the application.

---

# Main Modules

- Authentication
- Dashboard
- Categories
- Pages
- Tools
- Tool Content
- SEO
- FAQs
- Image Upload
- Rich Text Editor

---

# Project Workflow

```
Login
      ↓
Dashboard
      ↓
Manage Categories
      ↓
Create Tools
      ↓
Add Tool Content
      ↓
Create Pages
      ↓
Publish Content
```

---

# Deployment

Build the application:

```bash
npm run build
```

Deploy the generated `dist` folder to your preferred hosting provider such as:

- Netlify
- Vercel
- AWS S3
- Nginx
- Apache

---

# Troubleshooting

### Dependencies not installing

```bash
rm -rf node_modules
rm package-lock.json
npm install
```

Windows:

```cmd
rmdir /s /q node_modules
del package-lock.json
npm install
```

---

### API Not Working

Verify:

- Backend server is running
- `VITE_API_URL` is correct
- Backend allows CORS

---

### Build Errors

Run:

```bash
npm install
npm run build
```

---

# License

This project is intended for internal CMS administration and content management.
