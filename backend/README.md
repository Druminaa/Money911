# The Financial Atelier — Python Backend

## Tech Stack
- **FastAPI** — Python web framework
- **MongoDB** — Database (via Motor async driver)
- **JWT** — Authentication
- **Pydantic** — Data validation

## Setup

### 1. Install MongoDB
```bash
# Ubuntu/Debian
sudo apt install mongodb
sudo systemctl start mongodb

# macOS
brew install mongodb-community
brew services start mongodb-community
```

### 2. Create virtual environment
```bash
cd backend
python -m venv venv
source venv/bin/activate      # Linux/macOS
venv\Scripts\activate         # Windows
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure environment
Edit `.env` file:
```
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=financial_atelier
SECRET_KEY=your-super-secret-key-change-in-production
```

### 5. Run the server
```bash
uvicorn main:app --reload --port 8000
```

## API Docs
- Swagger UI: http://localhost:8000/docs
- ReDoc:       http://localhost:8000/redoc

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login & get token |
| GET | /api/transactions | Get all transactions |
| POST | /api/transactions | Create transaction |
| DELETE | /api/transactions/:id | Delete transaction |
| GET | /api/transactions/summary | Income/expense summary |
| GET | /api/budgets | Get all budgets |
| POST | /api/budgets | Create budget |
| DELETE | /api/budgets/:id | Delete budget |
| GET | /api/goals | Get all goals |
| POST | /api/goals | Create goal |
| PATCH | /api/goals/:id | Update goal progress |
| DELETE | /api/goals/:id | Delete goal |
| GET | /api/cash | Get cash entries |
| POST | /api/cash | Add cash entry |
| DELETE | /api/cash/:id | Delete cash entry |
| GET | /api/cash/summary | Cash balance summary |
| GET | /api/loans | Get all loans |
| POST | /api/loans | Create loan |
| DELETE | /api/loans/:id | Delete loan |
| GET | /api/analytics/summary | Analytics overview |
| GET | /api/analytics/monthly | Monthly breakdown |
| GET | /api/analytics/categories | Category breakdown |
| GET | /api/users/me | Get current user |
| PATCH | /api/users/me | Update profile |

## Database Collections
- `users` — User accounts
- `transactions` — Income & expense records
- `budgets` — Budget categories
- `goals` — Financial goals
- `cash` — Cash in/out entries
- `loans` — Lending & borrowing records
