# AccessShare

AccessShare is a comprehensive healthcare platform that connects people in need with those who can help. Whether you need blood donations, assistive devices, or caregiver services, we're here to make those connections happen.

This project won the second prize (senior cohort) in the Desis Ascend Educare 2024 Program by DE Shaw.


## Features

- Blood Donation System
- Assistive Device Marketplace
- Caregiver Services
- User Authentication
- Profile Management

## Tech Stack

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic
- Alembic (for database migrations)

### Frontend
- React
- TypeScript
- Tailwind CSS
- TanStack Query (formerly React Query)

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL
- npm

### Initial Setup

1. Clone the repository to your local machine:
```bash
git clone https://github.com/yourusername/access_share.git
cd access_share
```

2. Create a virtual environment in the project root:
```bash
python -m venv venv
```

3. Activate the virtual environment:
   - Windows:
   ```bash
   venv\Scripts\activate
   ```
   - macOS/Linux:
   ```bash
   source venv/bin/activate
   ```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the backend directory:
```bash
# Database Configuration
POSTGRES_SERVER=localhost
POSTGRES_USER=likithakonam
POSTGRES_PASSWORD=password
POSTGRES_DB=postgres
POSTGRES_PORT=5432

PROJECT_NAME=access_share
VERSION=1.0.0
API_V1_STR=/api/v1

# CORS
BACKEND_CORS_ORIGINS=["http://localhost:3000"]
```

4. Make sure PostgreSQL is running locally:
   - Windows: Check Services application to ensure the PostgreSQL service is running
   - macOS: `brew services list` to check if PostgreSQL is running
   - Linux: `sudo systemctl status postgresql` to check PostgreSQL status

5. Create the database:
```bash
# Using psql
psql -U postgres -c "CREATE DATABASE accessshare;"
```

6. Run database migrations:
```bash
python manage.py migrate
```
   This command applies all migrations to your database, creating the necessary tables and relationships. It's important to run this before starting the application to ensure your database schema is up-to-date.

7. Start the backend server:
```bash
python manage.py runserver
```
   The backend should now be running at http://localhost:8000

### Frontend Setup

1. Open a new terminal window/tab and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```bash
# Backend API Configuration
VITE_API_URL=http://localhost:8000/api/v1
VITE_API_TIMEOUT=30000

# Other Configuration
VITE_APP_NAME=Access Share
VITE_APP_DESCRIPTION=Connecting people with healthcare resources and assistive devices
```

4. Start the development server:
For first time
```bash
npm install
```

Then to run web server:
```bash
npm run dev
```
   The frontend should now be running at http://localhost:5173

## API Documentation

Once the backend server is running, you can access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Common Issues and Troubleshooting

### Backend Issues

1. **Database connection errors**:
   - Ensure PostgreSQL is running
   - Verify DATABASE_URL in your .env file
   - Make sure you've created the database

2. **Migration errors**:
   - If you encounter errors during migration, you can reset the migrations with:
   ```bash
   alembic downgrade base
   alembic upgrade head
   ```

3. **Module not found errors**:
   - Ensure your virtual environment is activated
   - Verify all dependencies are installed with `pip install -r requirements.txt`

### Frontend Issues

1. **Node module errors**:
   - Try deleting `node_modules` folder and `package-lock.json`, then run `npm install` again

2. **API connection errors**:
   - Verify the backend is running
   - Check that VITE_API_BASE_URL is set correctly in your .env file
   - Ensure CORS settings in the backend allow your frontend domain

## Development Workflow

1. Always activate the virtual environment before working on the backend:
```bash
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
```

2. After making changes to database models, create and apply migrations:
```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

## License

This project is licensed under the MIT License.

## Acknowledgments

- FastAPI documentation
- React documentation
- Tailwind CSS documentation
- TanStack Query documentation
