# Zyra (Social Media Platform)

![Zyra Logo](src/assets/ZYRA_LOGO.png)

A modern, feature-rich social media application built with React, Vite, and Redux Toolkit. Zyra is designed to be a complete social experience, incorporating features inspired by modern platforms like Instagram and Twitter.

---

## 📸 Features

Based on the project structure, Zyra includes the following features:

* **🛡️ Authentication:** Secure user sign-up, sign-in, and forgot password functionality.
* **👤 User Profiles:** View and edit user profiles, including profile pictures and user details.
* **🚶‍♂️ Follow System:** Follow and unfollow other users, with suggestions for new users to follow.
* **📰 Main Feed:** A central feed (`Feed.jsx`) to display posts (`Post.jsx`) from followed users.
* **📱 Stories:** Instagram-like stories (`Story.jsx`, `StoryCard.jsx`) for temporary, 24-hour content.
* **🎥 Loops:** A short-form video feature (`Loops.jsx`, `LoopCard.jsx`), similar to Reels or TikToks.
* **💬 Real-time Messaging:** A complete chat system (`Messages.jsx`, `MessageArea.jsx`) with real-time updates using WebSockets (`socket.js`).
* **🔔 Notifications:** Real-time notifications (`Notifications.jsx`) for likes, follows, and messages.
* **🔍 Search:** Functionality to search for other users or content.
* **⬆️ Upload:** A dedicated page (`Upload.jsx`) for users to create new posts, stories, or loops.
* **🔄 Global State Management:** Uses **Redux Toolkit** (`src/redux`) to manage application-wide state for users, posts, messages, stories, loops, and socket connections.
* **🎣 Custom Hooks:** Organized data-fetching logic into custom hooks (`src/hooks`) for clean and reusable code (e.g., `getAllPost.jsx`, `getCurrentUser.jsx`).

---

## 🛠️ Tech Stack

* **Frontend:** **React.js**
* **Build Tool:** **Vite**
* **State Management:** **Redux Toolkit**
* **Real-time:** **Socket.io-client**
* **Styling:** **CSS** (as seen in `App.css`, `index.css`)

---

## 🚀 Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

* Node.js (v18 or newer)
* npm (or yarn)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd your-repo-name
    ```

3.  **Install dependencies:**
    ```sh
    npm install
    ```

4.  **Set up environment variables:**

    Create a file named `.env` in the root of your project and add the necessary environment variables. Vite requires a `VITE_` prefix for variables to be exposed to the frontend.

    ```.env
    # Example: Your backend API server URL
    VITE_BACKEND_URL=http://localhost:8000/api/v1
    
    # Example: Your Socket.io server URL
    VITE_SOCKET_URL=http://localhost:8000
    ```

5.  **Run the development server:**
    ```sh
    npm run dev
    ```
    Your application should now be running on `http://localhost:5173` (or another port if 5173 is busy).

---

## 📂 Project Structure

The project follows a standard React application structure, organizing files by their feature or type.