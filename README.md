# Tickr 🚀📈

Welcome to **Tickr**, a free application which allows users to simulate trading in the stock market without the risk of losing real money. Whether you're a beginner wanting to learn how the stock market works or an experienced trader looking to test new strategies, this platform provides an interactive and educational environment for everyone.

---


## Technologies Used 🛠
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![DjangoREST](https://img.shields.io/badge/DJANGO-REST-ff1709?style=for-the-badge&logo=django&logoColor=white&color=ff1709&labelColor=gray)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

---

## Features

- **Simulated Stock Market**: Trade stocks and track their performance in real-time, just like in the actual market.
- **Risk-Free Environment**: No real money is involved—users can practice without any financial risk.
- **User-Friendly Interface**: Easy-to-use platform with a sleek and intuitive design to enhance the trading experience.
- **Market Data**: Get live market data and trends for real stocks.
- **Portfolio Management**: Monitor your portfolio, track gains and losses, and analyze performance.
- **Leaderboard**: Compete with others and see who is the best trader among the mock users.

---

## Getting Started

Follow these steps to get started with the Mock Trading Platform:

### 1. Clone the Repository

```bash
git clone https://github.com/mcrich921/tickr.git
```

### 2. Set up Virtual Environment 🧑‍💻
```bash
cd tickr
python3 -m venv env
```
Windows:
```bash
.\env\Scripts\activate
```
macOS/Linux
```bash
source env/bin/activate
```

### 3. Install Backend Dependencies 📦
```bash
pip install -r requirements.txt
```

### 4. Connect to PostgreSQL Database 🗄️
To connect your app to a PostgreSQL database, follow these steps:

Install PostgreSQL: If you don't already have PostgreSQL installed, follow the instructions on the [PostgreSQL website](https://www.postgresql.org/download/).

Create a Database: Once installed, create a new database for the project by running the following command:

```bash
psql -U postgres
CREATE DATABASE mock_trading;
```
Update Database Configuration:

Find database config file at tickr/backend/backend/settings.py
Update the PostgreSQL connection settings with your database credentials.

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mock_trading
DB_USER=your_username
DB_PASSWORD=your_password
```

Run Migrations from tickr/backend:

```bash
python manage.py migrate
```

### 4. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 5. Start the Application 🖥️
Once in Tickr folder, activate frontend
```bash
cd frontend
npm run dev
```

and then backend
```bash
cd ../backend
python3 manage.py runserver
```
---

NOTE:
NO REAL MONEY IS INVOLVED FOR DEPOSIT OR WITHDRAWAL IN THIS APPLICATION. IT IS PURELY A SIMULATION BASED ON LIVE STOCK DATA.
