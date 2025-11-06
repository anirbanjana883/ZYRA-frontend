🌀 ZYRA — Social Media Platform (Frontend)

ZYRA is a modern, full-featured social media web application frontend built using React, Vite, and Redux Toolkit.
It offers a smooth, dynamic, and responsive user experience similar to popular platforms like Instagram or X (Twitter), featuring stories, posts, messaging, notifications, and real-time updates.

🚀 Features

🧑‍🤝‍🧑 User Authentication – Sign up, Sign in, and Forgot Password flows

🏠 Home Feed – Dynamic feed showing posts and stories

🎥 Video Player – Smooth video playback inside posts or stories

💬 Real-Time Messaging – One-on-one chat using sockets

📰 Notifications System – Get instant updates for follows, likes, and comments

🧵 Loops – Threaded posts (similar to Twitter threads)

🧑‍🎨 User Profile – View and edit user profile and uploaded media

📷 Story & Post Upload – Post images, videos, and short stories

🔍 Search – Discover users and posts

🌐 Responsive Design – Optimized for both mobile and desktop

🏗️ Project Structure

ZYRA-frontend/
├── public/                 # Static files (favicon, icons)
├── src/
│   ├── assets/             # Images, logos, static visuals
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks for API fetching and logic
│   ├── pages/              # Major app pages (Home, Profile, Messages, etc.)
│   ├── redux/              # Redux Toolkit slices and global store
│   ├── App.jsx             # Root component
│   ├── main.jsx            # Entry point
│   ├── socket.js           # Socket.io client setup for real-time features
│   ├── index.css, App.css  # Global & modular styles
├── .gitignore
├── package.json
├── vite.config.js
└── README.md

⚙️ Tech Stack
Category	                        Technologies
Frontend Framework	                React (Vite)
State Management	                Redux Toolkit
Styling	                            CSS / Tailwind (if applicable)
Real-Time	                        Socket.io-client
Routing	                            React Router
API Calls	                        Axios / Fetch
Build Tool	                        Vite
Icons	                            React Icons

🧩 Core Components

Nav.jsx → Navigation bar

Feed.jsx → Main feed of posts

StoryCard.jsx / StoryDp.jsx → Stories UI

VideoPlayer.jsx → Handles video rendering

MessageArea.jsx, ReceiverMessage.jsx, SenderMessage.jsx → Chat interface

NotificationCard.jsx → Notification rendering

FollowButton.jsx, OtherUser.jsx → Social interactions

🔁 Redux Slices Overview

    Slice	            Purpose
userSlice.js	Handles authentication and current user state
postSlice.js	Manages all posts
storySlice.js	Controls stories and uploads
loopSlice.js	Manages thread-like post structures
messageSlice.js	Manages chat and messages
socketSlice.js	Socket connection state

🪝 Custom Hooks

    Hook	                    Description
getCurrentUser.jsx	        Fetches logged-in user details
getAllPost.jsx	            Retrieves all posts for feed
getAllStories.jsx	        Loads stories for home screen
getAllNotification.jsx	    Fetches user notifications
getSuggestedUser.jsx	    Suggests users to follow
getFollowingList.jsx	    Fetches following list
getPrevChatUsers.jsx	    Loads previous chat sessions
getAllLoops.jsx	            Loads loop

🧠 Setup & Installation

1️⃣ Clone the Repository

git clone https://github.com/anirbanjana883/ZYRA-frontend.git
cd ZYRA-frontend


2️⃣ Install Dependencies

VITE_BACKEND_URL=http://localhost:8000  # or your deployed backend API

4️⃣ Run the Development Server

npm run dev

5️⃣ Build for Production

npm run build

🔗 Backend Integration

ZYRA Frontend works seamlessly with the ZYRA Backend (ZYRA-backend) project, which handles:

Authentication (JWT)

Posts, Stories, Loops, Notifications

WebSocket connections (Socket.io)

Database (MongoDB)

Make sure the backend server is running before starting the frontend.

🧰 Scripts

Command	Description
npm run dev	Start dev server
npm run build	Create production build
npm run preview	Preview production build
npm run lint	Run ESLint checks

🧑‍💻 Contributing

Contributions are welcome!
To contribute:

Fork this repo

Create a new branch (feat/your-feature-name)

Commit changes

Open a Pull Request

🪪 License

This project is licensed under the MIT License.
You’re free to use, modify, and distribute it with attribution.

💬 Author

👤 Anirban Jana

🔗 GitHub