# CV Validation Application

A full-stack application that validates CV details against uploaded PDF files using AI-powered semantic analysis.

## 🏗️ Architecture

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: Node.js with Express, tRPC, and Prisma
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage
- **AI**: LangChain.js with OpenAI GPT-4 (single agent)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- OpenAI API key

### Environment Setup

1. Clone the repository
2. Copy environment files:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.local.example frontend/.env.local
   ```

3. Fill in your environment variables:
   - OpenAI API key
   - Supabase URL and anon key
   - Database connection string

### Installation

```bash
# Install all dependencies
npm run install:all

# Setup database
npm run setup

# Start development servers
npm run dev
```

## 📁 Project Structure

```
cv-validation-app/
├── backend/          # Node.js + tRPC Server
├── frontend/         # Next.js Client Application
├── shared/           # Shared types and schemas
└── docker-compose.yml
```

## 🔧 Development

### Backend Development

```bash
cd backend
npm run dev
```

### Frontend Development

```bash
cd frontend
npm run dev
```

### Database Management

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Run migrations
npm run db:migrate

# Open Prisma Studio
npm run db:studio
```

## 🚀 Deployment

### Frontend (Vercel)
- Connect your GitHub repository
- Set environment variables
- Deploy automatically

### Backend (Railway/Render)
- Connect your GitHub repository
- Set environment variables
- Deploy automatically

### Database (Supabase)
- Use Supabase's managed PostgreSQL
- Configure connection pooling

## 📋 Features

- ✅ PDF upload and text extraction
- ✅ Form validation with real-time feedback
- ✅ AI-powered semantic validation
- ✅ Single agent architecture for efficiency
- ✅ Type-safe APIs with tRPC
- ✅ Responsive design with Tailwind CSS

## 🔍 API Endpoints

### User Management
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user by ID

### File Upload
- `POST /api/upload` - Upload PDF file
- `GET /api/upload/history` - Get upload history

### Validation
- `POST /api/validation` - Validate CV
- `GET /api/validation/results` - Get validation results

## 🛠️ Tech Stack

### Backend
- Node.js 18+
- Express.js
- tRPC
- Prisma ORM
- LangChain.js
- OpenAI GPT-4

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- React Hook Form
- tRPC Client

### Database & Storage
- Supabase PostgreSQL
- Supabase Storage

## 📝 License

MIT License 