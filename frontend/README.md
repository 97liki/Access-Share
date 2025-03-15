# Access Share Frontend

A modern React application for connecting people with healthcare resources and assistive devices.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Copy `.env.example` to `.env` and update the variables:
```bash
cp .env.example .env
```

Required environment variables:
- `VITE_API_URL`: Backend API URL (default: http://localhost:8000/api/v1)
- `VITE_API_TIMEOUT`: API timeout in milliseconds (default: 30000)

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

5. Preview production build:
```bash
npm run preview
```

## Technology Stack

- React 18
- TypeScript
- Vite
- TailwindCSS
- Framer Motion
- React Router
- React Query
- Axios

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts (Auth, etc.)
├── hooks/         # Custom React hooks
├── pages/         # Page components
├── services/      # API services
├── styles/        # Global styles
├── types/         # TypeScript types
└── utils/         # Utility functions
```

## Production Deployment

1. Update `.env` with production API URL
2. Build the project: `npm run build`
3. Deploy the `dist` directory to your hosting service

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
