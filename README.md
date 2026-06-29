Lost & Found Management System

A full-stack web application that helps students and staff report, search, and recover lost belongings efficiently within a campus environment.

Live Demo

Frontend: https://lost-and-found-final-ten.vercel.app/

Backend API: https://lost-and-found-final-m35j.onrender.com

---

Overview

The Lost & Found Management System provides a centralized platform for reporting and managing lost and found items. Users can post item details, browse listings, search for belongings, and connect with finders or owners.

---

Features

User Features

* Report Lost Items
* Report Found Items
* Upload Item Information
* Search and Filter Listings
* View Item Details
* Contact Item Owners/Finders
* Responsive User Interface

System Features

* REST API Integration
* MongoDB Database Storage
* Real-Time Data Management
* Secure Backend Architecture

---

Tech Stack

Frontend

* React.js
* Vite
* CSS

Backend

* Node.js
* Express.js

Database

* MongoDB Atlas

Deployment

* Vercel (Frontend)
* Render (Backend)

---

Project Structure


LOST-AND-FOUND-final/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── server.js
│   └── package.json
│
└── README.md


Local Setup

Clone Repository


git clone https://github.com/POOJIKASRI-V-29/LOST-AND-FOUND-final.git
cd LOST-AND-FOUND-final


### Backend Setup

```bash
cd backend
npm install
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Environment Variables

### Backend

Create a `.env` file inside the backend folder:

```env
MONGO_URI=your_mongodb_connection_string
PORT=3001
```

### Frontend

Create a `.env` file inside the frontend folder:

```env
VITE_API_URL=http://localhost:3001
```

---

## 📸 Screenshots

### Home Page

(Add Screenshot)

### Lost Item Submission

(Add Screenshot)

### Found Item Listing

(Add Screenshot)

### Search Results

(Add Screenshot)

---

## 🎯 Future Enhancements

* User Authentication
* Email Notifications
* AI-Based Item Matching
* Image Recognition
* QR-Based Claim Verification
* Mobile Application

---

## 👩‍💻 Author

**Poojikasri V**

GitHub: https://github.com/POOJIKASRI-V-29

---

## 📜 License

This project is intended for educational and academic purposes.
