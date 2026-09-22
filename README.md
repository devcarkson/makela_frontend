# Makela Frontend

React + TypeScript + Vite e-commerce frontend for the Makela cosmetics store.

## Tech Stack
- React 18 + TypeScript
- Vite build tool
- Tailwind CSS + shadcn/ui
- React Router DOM
- React Query for data fetching
- Flutterwave payment integration

## Getting Started

```bash
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

### Required Variables
- `VITE_API_BASE_URL` - Backend API base URL
- `VITE_MEDIA_BASE_URL` - Media files base URL
- `VITE_FLUTTERWAVE_PUBLIC_KEY` - Flutterwave public key

## Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```