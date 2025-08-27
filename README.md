# 📝 Node Blog App

**Welcome to the Node Blog App!**

A modern, full-stack E-Learning platform **specifically designed for universities and colleges**, focusing on knowledge sharing and community building. This app empowers students and developers to connect, collaborate, and engage through technical content and discussions, all within their institution. Users can interact, clarify doubts, and grow together via a robust post and comment system. The platform features three interfaces: Student, Coordinator, and Admin.

---

## 👩‍🎓 Student Interface

- **Explore Technical Content**: Browse, learn, and engage with posts across tech communities.
- **Interactive Discussions**: Comment on posts and join lively discussions.
- **Personalized Experience**: Follow favorite communities and authors, and receive tailored notifications.
- **Stay Informed**: Get real-time announcements about events and sessions.

## 👨‍🏫 Coordinator Interface

- **Content Creation & Management**: Publish, edit, or delete technical posts.
- **AI-Powered Grammar Checker**: Ensure content quality using integrated AI tools.
- **Event Management**: Plan and schedule announcements for meetings and events.

## 🛡️ Admin Interface

- **Platform Oversight**: Manage users, roles, and permissions.
- **Activity Monitoring**: Verify and monitor student and coordinator activities.
- **Comprehensive Control**: Oversee and configure all aspects of the platform.

---

## ✨ Key Features

- **User Authentication**: Secure registration, login, and account management.
- **Create & Edit Posts**: Add, update, or delete blog posts with ease.
- **Category Management**: Organize content with flexible categories.
- **Image Uploads (AWS S3)**: Efficient image storage and retrieval.
- **Comments Section**: Foster engagement through discussions.
- **Search & Filter**: Quickly find posts by title, author, or category.
- **Responsive UI**: Modern, mobile-friendly design using React.js and Tailwind CSS.

---

## 🗂️ Monorepo Structure

Both backend and frontend are organized for modularity and scalability:

```
Node-Blog-App/
├── backend/    # Node.js + Express + MongoDB API
├── frontend/   # React.js + Tailwind CSS client
├── README.md
└── ...
```

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Frontend:** React.js, Tailwind CSS
- **Image Storage:** AWS S3

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v14+
- [MongoDB](https://www.mongodb.com/) (local or cloud)
- [AWS Account](https://aws.amazon.com/) (for S3 integration)

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
   npm run dev
   ```

### Frontend Setup

```bash
cd frontend
npm install
```

1. Create a `.env` file in the `frontend/` directory if needed (e.g., for API base URL).
2. Start the frontend server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔗 Related Backend Services

- [web-Socket.io](https://github.com/YUGESHKARAN/web-socket.io.git): Live post comment implementation.
- [blog_chat_app](https://github.com/YUGESHKARAN/blogChat-backend.git): Content manipulator services.
- [Recommendation-System](https://github.com/YUGESHKARAN/recommendation-system.git): Author recommendation engine.

---

## 🤝 Contributing

Contributions are welcome!  
Fork the repository and submit a pull request, or open an issue to discuss significant changes.

---

## 📬 Contact

Created with ❤️ by [YUGESHKARAN](https://github.com/YUGESHKARAN).  
Feel free to reach out for questions or suggestions!

---
