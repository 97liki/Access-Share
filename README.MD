# AccessShare

AccessShare is a platform that connects people in need with those who can help. Whether you need blood, assistive devices, or caregiver services, we're here to make those connections happen.

## Features

- Blood Donation System
- Assistive Device Marketplace
- Caregiver Services
- Social Media Sharing
- User Authentication
- Real-time Notifications

## Tech Stack

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic
- JWT Authentication

### Frontend
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- React Query

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL
- npm or yarn

### Backend Setup

1. Create a virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Initialize the database:
```bash
# Create database
createdb accessshare

# Run migrations
alembic upgrade head
```

5. Run the development server:
```bash
uvicorn app.main:app --reload
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Run the development server:
```bash
npm run dev
```

## API Documentation

Once the backend server is running, you can access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- FastAPI documentation
- React documentation
- Tailwind CSS documentation
- Framer Motion documentation
