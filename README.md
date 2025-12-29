# 📚 AI Legal Document Search

> An intelligent legal document search platform powered by semantic search and AI-generated answers.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Vector_DB-green)](https://supabase.com/)
[![Groq](https://img.shields.io/badge/Groq-Llama_3.3-orange)](https://groq.com/)

## ✨ Features

- 🤖 **AI-Powered Answers** - Get instant, concise answers to legal questions using Llama 3.3 70B
- 🔍 **Semantic Search** - Find relevant documents based on meaning, not just keywords
- 📊 **Smart Ranking** - Documents ranked by similarity score (0-100%)
- 📖 **Comprehensive Library** - Browse 10+ legal documents across 6 categories
- 🎨 **Beautiful UI** - Modern, responsive interface with book-style cards
- ⚡ **Fast & Free** - Powered by Groq for lightning-fast AI responses

## 🎯 Use Cases

Ask questions like:

- "Can employees share confidential information?"
- "What are my GDPR privacy rights?"
- "What happens if I terminate my lease early?"
- "How do trademark licenses work?"

Get an AI-generated answer plus relevant source documents with similarity scores.

## 🏗️ Architecture

```
┌─────────────┐
│   User      │
│   Query     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│  HuggingFace Embeddings API     │
│  (all-MiniLM-L6-v2)            │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Supabase Vector Database       │
│  (pgvector + cosine similarity) │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Groq API (Llama 3.3 70B)      │
│  Generates brief answer         │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  AI Answer + Ranked Documents   │
└─────────────────────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account
- HuggingFace API key (free)
- Groq API key (free)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/legal-search.git
   cd legal-search
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file:

   ```bash
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # API Keys
   HUGGINGFACE_API_KEY=your_huggingface_key
   GROQ_API_KEY=your_groq_key
   ```

4. **Set up Supabase**

   Run these SQL commands in your Supabase SQL Editor:

   ```sql
   -- Enable pgvector extension
   CREATE EXTENSION IF NOT EXISTS vector;

   -- Create legal_library table
   CREATE TABLE legal_library (
     id SERIAL PRIMARY KEY,
     title TEXT NOT NULL,
     content TEXT NOT NULL,
     category TEXT NOT NULL,
     summary TEXT,
     author TEXT,
     date_published DATE,
     embedding vector(384),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create search function
   CREATE OR REPLACE FUNCTION match_library_documents(
     query_embedding vector(384),
     match_threshold float,
     match_count int
   )
   RETURNS TABLE (
     id int,
     title text,
     content text,
     category text,
     summary text,
     similarity float
   )
   LANGUAGE sql STABLE
   AS $$
     SELECT
       id,
       title,
       content,
       category,
       summary,
       1 - (embedding <=> query_embedding) as similarity
     FROM legal_library
     WHERE 1 - (embedding <=> query_embedding) > match_threshold
     ORDER BY embedding <=> query_embedding
     LIMIT match_count;
   $$;
   ```

5. **Seed the database with sample documents**

   Visit `/fix-embeddings` after starting the dev server to generate embeddings for your documents.

6. **Run the development server**

   ```bash
   npm run dev
   ```

7. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── chat/route.ts              # Search + AI answer endpoint
│   │   ├── library/
│   │   │   ├── route.ts               # Get all documents
│   │   │   └── [id]/route.ts          # Get single document
│   │   └── fix-embeddings/route.ts    # Generate embeddings
│   ├── library/
│   │   ├── page.tsx                   # Document library grid
│   │   └── [id]/page.tsx              # Document detail page
│   ├── ui/
│   │   ├── search/page.tsx            # Search interface
│   │   └── library/page.tsx           # Library interface
│   └── page.tsx                       # Landing page
├── lib/
│   └── supabase.ts                    # Supabase client
└── public/
```

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Mantine UI** - Component library

### Backend

- **Supabase** - PostgreSQL database with pgvector
- **HuggingFace** - Text embeddings (all-MiniLM-L6-v2)
- **Groq** - Fast AI inference (Llama 3.3 70B)

### AI/ML

- **Vector Embeddings** - 384-dimensional semantic representations
- **Cosine Similarity** - Document relevance scoring
- **RAG (Retrieval Augmented Generation)** - AI answers grounded in documents

## 🎨 Document Categories

- 📄 **Employment** - Contracts, confidentiality agreements
- 🔒 **Privacy** - GDPR policies, cookie policies
- 💼 **Commercial** - SLAs, software licenses
- 🏠 **Real Estate** - Lease agreements
- 🏢 **Corporate** - NDAs, governance documents
- 💡 **Intellectual Property** - Trademark licenses, patents

## 🔧 Configuration

### Adjusting Search Sensitivity

In `app/api/chat/route.ts`:

```typescript
const MIN_SIMILARITY = 0.15; // Lower = more results (0.10-0.25 recommended)
```

### Customizing AI Responses

In `app/api/chat/route.ts`:

```typescript
const systemPrompt = `Your custom instructions here...`;
```

## 📊 How It Works

1. **User asks a question** → "Can employees share confidential information?"

2. **Text → Vector** → HuggingFace converts the question to a 384-dimensional vector

3. **Vector Search** → Supabase finds similar document vectors using cosine similarity

4. **Ranking** → Documents sorted by similarity score (0-100%)

5. **AI Generation** → Groq's Llama 3.3 generates a brief answer using top 3 documents

6. **Display Results** → AI answer shown at top, relevant documents below

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Deploy to Netlify

```bash
npm run build
netlify deploy --prod
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [HuggingFace](https://huggingface.co/) for embeddings API
- [Groq](https://groq.com/) for fast AI inference
- [Supabase](https://supabase.com/) for vector database
- [Next.js](https://nextjs.org/) for the amazing framework

---

⭐ Star this repo if you find it helpful!
