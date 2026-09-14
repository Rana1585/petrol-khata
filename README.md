# ⛽ Petrol Khata

Petrol Khata is a simple fuel-expense tracking web application.

It allows users to:

* Add fuel expenses
* View all fuel entries
* Delete fuel entries
* Calculate total spending
* Store data permanently in a SQLite database

## 🛠️ Technologies Used

* React — Frontend
* Vite — Frontend development tool
* Express.js — Backend API
* SQLite — Database
* Node.js — JavaScript runtime
* Git & GitHub — Version control

## 📋 Requirements

Before running the project, install:

* Node.js
* npm
* Git

Check your installations:

```bash
node -v
npm -v
git --version
```

## 📁 Project Structure

```text
petrol-khata/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── Navbar.jsx
│   │   ├── AddEntry.jsx
│   │   ├── EntriesTable.jsx
│   │   └── index.css
│   └── ...
│
├── backend/
│   ├── server.js
│   ├── database.js
│   ├── package.json
│   └── petrol-khata.db
│
├── .gitignore
└── README.md
```

## 🚀 Installation

Clone the repository:

```bash
git clone https://github.com/Rana1585/petrol-khata.git
```

Go into the project:

```bash
cd petrol-khata
```

### Install Backend Dependencies

```bash
cd backend
npm install
```

### Install Frontend Dependencies

Open another terminal:

```bash
cd ~/petrol-khata/frontend
npm install
```

## ▶️ Running the Application

Petrol Khata needs both the backend and frontend running.

### 1. Start the Backend

Open a terminal:

```bash
cd ~/petrol-khata/backend
node server.js
```

The backend will run on:

```text
http://localhost:5000
```

### 2. Start the Frontend

Open a second terminal:

```bash
cd ~/petrol-khata/frontend
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

Open the frontend URL in your browser.

## 🔗 How the Application Works

The application follows this structure:

```text
React Frontend
       ↓
Express Backend
       ↓
SQLite Database
```

### React

React provides the user interface.

When you add a fuel entry, React collects:

* Date
* Petrol pump
* Price per litre
* Total price

### Express

React sends the data to the Express backend using HTTP requests.

For example:

```text
POST /entries
```

The backend receives the data and saves it into SQLite.

### SQLite

SQLite permanently stores the fuel entries.

When the application starts, React requests the saved entries:

```text
GET /entries
```

The backend gets the data from SQLite and sends it back to React.

## 🔄 API Routes

| Method | Route          | Purpose                           |
| ------ | -------------- | --------------------------------- |
| GET    | `/`            | Check that the backend is running |
| GET    | `/entries`     | Get all fuel entries              |
| POST   | `/entries`     | Add a new fuel entry              |
| DELETE | `/entries/:id` | Delete a fuel entry               |

## ✅ Current Features

* Add fuel entries
* View fuel entries in a table
* Delete entries
* Total number of entries
* Total spending calculation
* SQLite database persistence
* React frontend
* Express backend
* CORS enabled

## 🔐 Important

The SQLite database contains application data and should not be uploaded to GitHub.

The `.gitignore` file should contain:

```text
node_modules/
.env
*.db
```

## 📤 Updating the GitHub Repository

After making changes:

```bash
cd ~/petrol-khata
git status
```

Add the changes:

```bash
git add .
```

Create a commit:

```bash
git commit -m "Update Petrol Khata"
```

Push to GitHub:

```bash
git push
```

## 📌 Project Status

Petrol Khata currently has a working React frontend, Express backend, and SQLite database.

Future improvements may include:

* Edit existing entries
* Better form validation
* Search and filtering
* Date-based expense summaries
* Charts and statistics
* User authentication
