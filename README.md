# ❤️ NGO Social Media Management Platform

### Social Media Management System for an NGO — University Project

<p align="center">
  A centralized web platform for creating, managing, approving, scheduling,
  and analyzing social media content.
</p>

---

## 📌 About the Project

The **NGO Social Media Management Platform** is a web-based application developed as part of a **university Software Engineering assignment**.

For this project, the **Red Cross** was selected as the case-study NGO to demonstrate how a non-governmental organization could manage its social media activities through a centralized digital platform.

The system provides an organized environment for managing social media posts, content approvals, scheduling, campaigns, analytics, users, and security.

> **Academic Disclaimer:** This project was created solely for educational and academic purposes. The Red Cross is used only as a case-study NGO. This application is not an official Red Cross product and is not affiliated with or endorsed by the Red Cross.

---

## 🌐 Live Demo

The application is deployed using **Firebase Hosting**.

### 🔗 Live Application

https://redcross-social-media-platform.web.app/login

---

## 🎯 Project Scenario

NGOs rely heavily on social media to communicate with the public, promote awareness campaigns, share community activities, publish important information, and engage with supporters.

Managing these activities can become difficult when content creation, approval, scheduling, campaigns, and analytics are handled separately.

This project demonstrates how a centralized **Social Media Management Platform** could help an NGO organize these activities more effectively.

The Red Cross was selected as the example NGO for demonstrating the proposed system.

---

## ✨ Key Features

### 📊 Dashboard
Provides a centralized overview of social media activities and important information.

### ✍️ Create Post
Allows users to create and prepare social media content through an organized interface.

### 📄 All Posts
Provides a central location for viewing and managing created social media posts.

### ✅ Approvals
Supports a content approval process where posts can be reviewed before being approved.

### 📅 Schedule
Allows approved content to be organized and scheduled for future publication.

### 📢 Campaigns
Helps organize social media content according to different NGO campaigns and activities.

### 📈 Analytics
Provides information and statistics related to social media activities and content performance.

### 🌍 Explore
Provides an additional area for discovering and managing relevant content.

### 🛡️ Security
Provides security-related functionality for protecting the management platform.

### 👥 User Management
Allows authorized users to manage platform users and access.

### 🔐 Authentication
Provides controlled access to the system through a login interface.

---

## 🔄 Content Management Workflow

The platform follows a structured content management process:

```text
                    ┌───────────────┐
                    │     Login     │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │   Dashboard   │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │  Create Post  │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │   All Posts   │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │   Approval    │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │   Schedule    │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │    Publish    │
                    └───────────────┘
```

This workflow demonstrates how social media content can move through different stages before publication.

---

# 🛠️ Tech Stack

<p align="left">

<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>

<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>

<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>

<img src="https://img.shields.io/badge/Firebase-DD2C00?style=for-the-badge&logo=firebase&logoColor=white" alt="Firebase"/>

<img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Git"/>

<img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>

</p>

---

## 💻 Technologies Used

| Technology | Purpose |
|---|---|
| **React** | Building the component-based user interface |
| **Vite** | Frontend development and build tool |
| **JavaScript** | Application logic and interactivity |
| **React Icons** | Icons used throughout the interface |
| **Firebase** | Cloud/backend services used by the project |
| **Firebase Hosting** | Hosting the deployed web application |
| **Git** | Version control |
| **GitHub** | Source-code management |

---

# 🧩 Main System Modules

The application contains several modules accessible through the main navigation system.

```text
📊 Dashboard
│
├── ✍️ Create Post
├── 📄 All Posts
├── ✅ Approvals
├── 📅 Schedule
├── 📢 Campaigns
├── 📈 Analytics
├── 🌍 Explore
├── 🛡️ Security
├── 👥 Users
└── 🚪 Logout
```

---

# 📁 Project Structure

A simplified representation of the project structure:

```text
social-media-platform/
│
├── public/
│
├── src/
│   │
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

> The exact structure may change as the application continues to be developed.

---

# ⚙️ Installation & Setup

## Prerequisites

Before running the project, make sure you have installed:

- Node.js
- npm
- Git
- Visual Studio Code or another code editor

Check your Node.js version:

```bash
node --version
```

Check npm:

```bash
npm --version
```

---

## 1️⃣ Clone the Repository

Clone the project from GitHub:

```bash
git clone https://github.com/Hithesh2/social-media-platform.git
```

Move into the project directory:

```bash
cd social-media-platform
```

---

## 2️⃣ Install Dependencies

Install the required packages:

```bash
npm install
```

---

## 3️⃣ Start the Development Server

Run:

```bash
npm run dev
```

Vite will provide a local development address similar to:

```text
http://localhost:5173/
```

Open the provided address in your browser.

---

## 4️⃣ Production Build

To generate an optimized production build:

```bash
npm run build
```

The generated production files will normally be available inside:

```text
dist/
```

---

# 🔥 Firebase Hosting

The project is deployed using **Firebase Hosting**.

Live deployment:

```text
https://redcross-social-media-platform.web.app/
```

A typical deployment workflow is:

```bash
npm run build
firebase deploy
```

---

# 📸 Application Screenshots

Screenshots of the completed application can be added here.

## Login

<p align="center">
  <i>Add Login Screenshot Here</i>
</p>

## Dashboard

<p align="center">
  <i>Add Dashboard Screenshot Here</i>
</p>

## Content Management

| Create Post | All Posts |
|:---:|:---:|
| Add Screenshot | Add Screenshot |

## Management

| Approvals | Schedule |
|:---:|:---:|
| Add Screenshot | Add Screenshot |

## Campaigns & Analytics

| Campaigns | Analytics |
|:---:|:---:|
| Add Screenshot | Add Screenshot |

---

# 🎯 Project Objectives

The main objective of this project is to demonstrate how a centralized web application can support the social media management requirements of an NGO.

The project focuses on:

- Centralizing social media management activities
- Simplifying content creation
- Providing an organized content approval workflow
- Supporting content scheduling
- Organizing NGO social media campaigns
- Providing analytics-related information
- Managing platform users
- Providing controlled access to management functionality
- Demonstrating modern web application development practices

---

# 💡 Why an NGO?

NGOs regularly communicate information related to:

- Humanitarian activities
- Awareness programs
- Community events
- Emergency information
- Volunteer activities
- Fundraising campaigns
- Educational content
- Public announcements

A centralized social media management system can help organize these different types of content and provide a more structured workflow for the people responsible for managing them.

---

# 🚀 Future Improvements

The platform could be extended with additional functionality such as:

- 🔔 Real-time notifications
- 🤖 AI-assisted content generation
- 📊 Advanced analytics
- 📅 Interactive content calendar
- 🔗 Integration with external social media APIs
- 💬 Internal team collaboration
- 📝 Comments on posts during the approval process
- 👤 Advanced role-based access control
- 📈 Campaign performance comparison
- 📱 Improved mobile responsiveness
- 🔍 Advanced search and filtering
- 🤖 AI-based content recommendations

---

# 🔒 Security Considerations

A social media management platform may handle user information and access credentials, so security is an important consideration.

The project considers concepts such as:

- Authentication
- Controlled access
- User management
- Secure handling of application data
- Protection of sensitive configuration information

Sensitive information such as passwords, private API credentials, service-account credentials, and access tokens should **never be committed to a public GitHub repository**.

Environment variables can be stored using:

```text
.env
```

Sensitive files should also be excluded through:

```text
.gitignore
```

---

# 📚 Academic Context

This project was developed as part of a **Software Engineering university assignment**.

It demonstrates practical knowledge of:

- Frontend web development
- React component architecture
- Social media platform concepts
- Content management workflows
- User interface design
- User management
- Authentication concepts
- Cloud services
- Web application deployment
- Version control using Git and GitHub

The Red Cross was selected only as the **case-study NGO** for demonstrating the system.

---

# ⚠️ Disclaimer

This repository contains an **academic prototype**.

The use of the Red Cross as the case-study organization is solely for educational and demonstration purposes.

**This project is not an official Red Cross application and is not affiliated with, authorized by, sponsored by, or endorsed by the Red Cross or any related organization.**

All trademarks, names, and branding belong to their respective owners.

---

# 👨‍💻 Developer

### Hithesh Maheepala

**Software Engineering Undergraduate**

Interested in:

`Software Development` • `Web Development` • `Mobile Development` • `Cloud Technologies` • `UI/UX`

---

# 🤝 Contributions

This repository was primarily developed for academic purposes.

For development or experimentation, create a separate branch:

```bash
git checkout -b feature/new-feature
```

After making changes:

```bash
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
```

---

# ⭐ Project Status

🚧 **Academic Project / Prototype**

The system is developed for educational purposes and may continue to receive improvements.

---

<p align="center">
  <b>❤️ NGO Social Media Management Platform</b>
</p>

<p align="center">
  Create • Manage • Approve • Schedule • Analyze
</p>

<p align="center">
  <i>Developed as a Software Engineering university project.</i>
</p>
