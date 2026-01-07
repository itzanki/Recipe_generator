# Smart Recipe Generator 🍳

A full-stack web application that helps users discover, explore, and manage recipes using a modern frontend and a scalable backend.

---

## 🚀 Features

- Browse and explore recipes
- User authentication (JWT based)
- Favorite recipes
- Clean and responsive UI
- REST API backend
- Secure environment variable handling

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- JavaScript

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

---

## 📂 Project Structure

SMART_RECIPE/
│
├── Backend/
│ ├── config/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── services/
│ ├── server.js
│ ├── package.json
│ └── .env.example
│
├── Frontend/
│ ├── src/
│ ├── public/
│ ├── index.html
│ ├── vite.config.js
│ ├── package.json
│ └── .env.example
│
├── .gitignore
└── README.md

yaml
Copy code

---

## ⚙️ Environment Variables

This project uses environment variables for configuration.

### Backend (`Backend/.env`)
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development

shell
Copy code

### Frontend (`Frontend/.env`)
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=SmartRecipe

yaml
Copy code

> ⚠️ Never commit `.env` files. Use `.env.example` as reference.

---

## ▶️ Running the Project Locally

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/Recipe_generator.git
cd Recipe_generator
2️⃣ Backend setup
bash
Copy code
cd Backend
npm install
npm run dev
3️⃣ Frontend setup
bash
Copy code
cd Frontend
npm install
npm run dev
Frontend will run on:

arduino
Copy code
http://localhost:5173
Backend will run on:

arduino
Copy code
http://localhost:5000
🔒 Security Notes
Environment variables are protected using .gitignore

JWT is used for authentication

Sensitive data is never committed to GitHub

📌 Future Improvements
Recipe recommendations

User profiles

Image upload

Deployment (Vercel / Render)

Pagination & search filters

👤 Author
Ankit Kumar

⭐ If you like this project
Give it a star ⭐ on GitHub!