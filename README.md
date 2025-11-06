# 🌐 ZYRA — Social Media Platform (Frontend)

ZYRA is a modern social media web application frontend built using **React**, **Vite**, and **Redux Toolkit**.  
It provides a smooth, responsive user experience featuring posts, stories, messaging, notifications, and real-time interactions — similar to Instagram or X.

---

## 🚀 Features

- 🔐 User Authentication (Sign Up / Sign In / Forgot Password)
- 🏠 Dynamic Home Feed with Posts & Stories
- 💬 Real-Time Chat with Socket.io
- 🎥 Video and Image Upload Support
- 🔔 Notifications & Follow System
- 🧵 Loops (Thread-like Posts)
- 🧑‍🎨 User Profiles and Editing
- 🔍 Search for Users & Posts
- 🌐 Fully Responsive Design
- ⚡ Fast Development & Build with Vite

---

## 🧱 Folder Structure


ZYRA-frontend/
├── public/                 # Static assets (favicon, icons)
├── src/
│   ├── assets/             # Logos, images, static files
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Main app pages
│   ├── redux/              # Redux store and slices
│   ├── App.jsx             # Root component
│   ├── main.jsx            # Entry point
│   ├── socket.js           # Socket.io setup
│   ├── App.css / index.css # Stylesheets
├── .gitignore
├── package.json
├── vite.config.js
└── README.md


⚙️ Installation & Setup

1️⃣ Clone the Repository
git clone https://github.com/anirbanjana883/ZYRA-frontend.git
cd ZYRA-frontend

2️⃣ Install Dependencies
npm install

3️⃣ Create Environment Variables

In the project root, create a .env file:

VITE_BACKEND_URL=http://localhost:8000

4️⃣ Run the Development Server
npm run dev


App will run on: http://localhost:5173

5️⃣ Build for Production
npm run build

🧩 Tech Stack

React (Vite)

Redux Toolkit

Socket.io Client

React Router DOM

Axios

Tailwind / CSS

ESLint

🧠 Redux Slices Overview

userSlice.js → Handles authentication and user state

postSlice.js → Manages posts

storySlice.js → Handles stories

loopSlice.js → Manages loop/thread posts

messageSlice.js → Handles chats and messages

socketSlice.js → Manages socket connection

store.js → Configures Redux store

🪝 Custom Hooks

getCurrentUser.jsx → Fetch logged-in user data

getAllPost.jsx → Fetch all posts

getAllStories.jsx → Fetch stories

getAllNotification.jsx → Fetch notifications

getSuggestedUser.jsx → Suggest users to follow

getFollowingList.jsx → Get following users

getPrevChatUsers.jsx → Get previous chat sessions

getAllLoops.jsx → Fetch loops

🧩 Key Components

Nav.jsx → Navigation bar

Feed.jsx → Main feed view

StoryCard.jsx / StoryDp.jsx → Stories UI

VideoPlayer.jsx → Plays videos

MessageArea.jsx → Chat UI

NotificationCard.jsx → Renders notifications

FollowButton.jsx → Follow / Unfollow functionality

OtherUser.jsx → Displays other user profiles

🔗 Backend Integration

ZYRA Frontend connects with the ZYRA Backend, which manages:

JWT Authentication

Posts, Stories, and Loops

Notifications

Real-Time Messaging (Socket.io)

MongoDB Database

Ensure the backend server is running before starting the frontend.

🧰 Available Scripts
npm run dev       # Start local dev server
npm run build     # Build app for production
npm run preview   # Preview production build
npm run lint      # Run ESLint checks

🧑‍💻 Contributing

Fork the repository

Create a feature branch (feat/your-feature-name)

Commit your changes

Push and open a Pull Request

🪪 License

This project is licensed under the MIT License.
You are free to use, modify, and distribute it with proper attribution.

👤 Author

Anirban Jana
GitHub Profile