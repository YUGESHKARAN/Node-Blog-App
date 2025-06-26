# 📝 Node Blog App

**Welcome to the Node Blog App!**

A modern, full-stack E-Learning platform **specially designed for individual universities and colleges** ,  focused on exchaning knowledge, help students/developers build and engage with tech communities. It allows developers to collaborate with each other and connect with people who share similar interests by posting technical content across multiple domains in the same university. This enables viewers to learn, grow, and clarify their doubts through the comment section. The platform features three distinct interfaces: Student, Coordinator, and Admin.

## Student Interface <br>

**-->** Access and learn from technical content  <br>

**-->** Post comments and engage in discussions  <br>

**-->** Select and follow their preferred tech communities  <br>

**-->** Follow authors and receive updates  <br>

**-->** Get announcements from coordinators about upcoming events or live sessions  <br>

**-->** Receive notifications about new posts from followed communities  <br>

## Coordinator Interface <br>

**-->** Create and publish technical posts  <br>

**-->** AI powered content (grammer) checker.  <br>

**-->** Plan and schedule announcements for live meetings and future events  <br>

**-->** They can edit or delete their respective posts  <br>

## Admin Interface <br>

**-->** Manage and control the entire platform  <br>

**-->** Verify and monitors the students and coordinators activities  <br>

**-->** Oversee student and coordinator roles and permissions  <br>

---

## ✨ Features

- 🧑‍💻 **User Authentication**: Secure registration, login, and account management.
- 🖊️ **Create & Edit Posts**: Effortlessly add, update, or delete blog posts.
- 🗂️ **Category Management**: Organize your content with flexible categories.
- 📦 **Image Uploads (AWS S3)**: Seamless image storage and retrieval using Amazon S3.
- 💬 **Comments Section**: Foster interaction with readers via comments.
- 🔎 **Search & Filter**: Easily discover posts by title, author, or category.
- 📱 **Responsive UI**: Optimized for all devices with React.js and Tailwind CSS.

---

## 🗂️ Monorepo Structure

This repository contains both backend and frontend in separate folders for better modularity and scalability:

```
Node-Blog-App/
├── backend/          # Node.js + Express + MongoDB API
├── frontend/         # React.js + Tailwind CSS client
├── README.md
└── ...
```

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express, MongoDB, Mongoose, Passport.js
- **Frontend:** React.js, Tailwind CSS
- **Image Storage:** AWS S3

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v14+
- [MongoDB](https://www.mongodb.com/) (local or cloud)
- [AWS Account](https://aws.amazon.com/) for S3 integration

### Backend Setup

```bash
cd backend
npm install
```

1. Create a `.env` file in the `backend/` directory:
   ```
   MONGODB_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret
   PORT=5000
   AWS_BUCKET_NAME=your_bucket_name
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=your_aws_region
   ```
2. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

```bash
cd frontend
npm install
```

1. Create a `.env` file in the `frontend/` directory if needed (for API base URL or other secrets).
2. Start the frontend development server:
   ```bash
   npm start
   ```

3. Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🤝 Contributing

Contributions are welcome!  
Feel free to fork the repository and submit a pull request. For major changes, open an issue first to discuss what you would like to change.

---


---

## 📬 Contact

Created with ❤️ by [YUGESHKARAN](https://github.com/YUGESHKARAN)  
Feel free to reach out for questions or suggestions!

---
