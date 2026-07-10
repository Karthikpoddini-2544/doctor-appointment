# 🏥 MediBook — Book a Doctor App

A full-stack MERN (MongoDB, Express, React, Node.js) healthcare appointment booking platform.

---

## Project Structure

```
book-a-doctor/
├── client/          # React + Vite frontend (port 5173)
└── server/          # Express.js backend (port 8001)
```

---

## Prerequisites

Make sure you have installed:
- **Node.js v16+** — [Download](https://nodejs.org)
- **npm v8+** (comes with Node.js)
- **MongoDB** — [Download](https://www.mongodb.com/try/download/community) or use MongoDB Atlas

---

## Setup & Run

### 1. Start MongoDB
Make sure your MongoDB service is running:
```bash
# Windows (if installed as a service):
net start MongoDB

# Or use MongoDB Compass / Atlas
```

### 2. Start the Backend

```bash
cd server
npm install
npm run dev
```

Server runs at: **http://localhost:8001**

### 3. Start the Frontend

```bash
cd client
npm install
npm run dev
```

App runs at: **http://localhost:5173**

---

## Environment Variables

The `.env` file is pre-configured in `server/`:

```env
MONGO_URI=mongodb://localhost:27017/book-a-doctor
JWT_SECRET=bookadr_super_secret_jwt_key_2024
PORT=8001
```

> 💡 If using **MongoDB Atlas**, replace `MONGO_URI` with your Atlas connection string.

---

## Features

| Feature | Description |
|---------|-------------|
| 🔐 Auth | JWT-based register & login for patients/admins |
| 👨‍⚕️ Doctor Browsing | Browse all approved doctors with specialty & details |
| 📅 Appointment Booking | Book with date/time + document upload |
| 🔔 Notifications | In-app unread/read notifications system |
| 🩺 Doctor Dashboard | Approve/reject patient appointment requests |
| 🛡️ Admin Panel | Approve/reject doctor applications, view all users |
| 📋 Appointment History | Full history with status tracking |

---

## User Flows

1. **Register** → Choose role (Patient or Admin)
2. **Login** → Redirected to appropriate dashboard
3. **Patient**: Browse doctors → Book appointment → View notifications
4. **Doctor**: Review requests → Approve/reject appointments
5. **Admin**: Review doctor applications → Approve/reject → View all data

---

## API Endpoints

### User (`/api/user`)
- `POST /register` — Register new user
- `POST /login` — Login
- `POST /getUserData` — Get auth user info
- `GET /getallusers` — Admin: list users
- `GET /getallnotifications` — Get notifications
- `POST /markallread` — Mark notifications read
- `POST /deleteallnotifications` — Clear read notifications

### Doctor (`/api/doctor`)
- `POST /applydoctor` — Apply as doctor
- `GET /getalldoctors` — Get approved doctors
- `GET /getalldoctorsforadmin` — Admin: all doctors
- `POST /approvedoctor/:id` — Approve doctor
- `POST /rejectdoctor/:id` — Reject doctor
- `GET /getdoctorappointments` — Doctor's appointments
- `POST /approveappointment/:id` — Approve appointment
- `POST /rejectappointment/:id` — Reject appointment

### Appointment (`/api/appointment`)
- `POST /bookappointment` — Book (with file upload)
- `GET /getallappointments` — Admin: all appointments
- `GET /getuserappointments` — Patient's appointments
