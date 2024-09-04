# Evercrow Bird Name Counter

Evercrow is a specialized platform for birdwatchers, focusing on B2B (bird-to-bird) users who need to manage their collection of bird-related documents. This application allows users to upload PDF documents and count occurrences of bird names within them.

## Live Demo

The application is deployed and can be accessed at: [https://evercrow-pi.vercel.app/](https://evercrow-pi.vercel.app/)

Feel free to try it out and explore the features!

## Features

- PDF upload and processing
- OCR (Optical Character Recognition) for text extraction from PDFs
- Fuzzy search for bird name occurrences
- "Did you mean" suggestions for potential misspellings
- Modern UI built with Next.js and shadcn/ui components

## Tech Stack

- Frontend: Next.js 14, React, TypeScript
- UI Components: shadcn/ui
- Styling: Tailwind CSS
- Backend: Next.js API Routes
- OCR: Nanonets API
- File Storage: Amazon S3
- Database: Supabase
- Deployment: Vercel

## Local Development Setup

If you want to run the project locally for development purposes, follow these steps:

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or later)
- npm (v6 or later)

You'll also need accounts and API keys for:
- Nanonets (for OCR)
- Amazon S3 (for file storage)
- Supabase (for database)

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/your-username/evercrow.git
   cd evercrow
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following:
   ```
   NANONETS_API_KEY=your_nanonets_api_key
   AWS_ACCESS_KEY_ID=your_aws_access_key_id
   AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
   AWS_REGION=your_aws_region
   S3_BUCKET_NAME=your_s3_bucket_name
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Visit [https://evercrow-pi.vercel.app/](https://evercrow-pi.vercel.app/) or your local development server.
2. Upload a PDF document using the file input.
3. Once the document is processed, enter a bird name in the search field.
4. Click "Count Occurrences" to see how many times the bird name appears in the document.
5. If there's a potential misspelling, the app will suggest a correction.

## Project Structure

```
/evercrow
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── upload-and-ocr/
│   │   │   └── query-text/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── FileUpload.tsx
│   │   └── ResultDisplay.tsx
│   └── lib/
│       ├── utils.ts
│       ├── s3.ts
│       ├── ocr.ts
│       └── supabase.ts
├── public/
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
