# 📰 Material Blog

Material Blog is a modern, full-stack, feature-rich blogging platform designed for developers, writers, and content creators. Built with the powerful **MERN stack** (MongoDB, Express, React, Node.js), it features an elegant Material UI-based interface, seamless user experience, and a fully-functional admin panel for content management.

[🌐 Live Demo](https://materialblog.vercel.app)

---

## 🚀 Features

- 🔐 Role-based authentication (admin/user)
- 📝 Create, edit, delete posts (with rich text + images)
- 💬 Comment system with nested replies, likes, and moderation
- 📚 Category and tag filtering
- 🌙 Dark mode, responsive layout, mobile support
- 📦 Cloudinary image upload (cover + content)
- 📊 Admin dashboard and content management
- ❤️ Post interactions: like/save
- 🧠 Redux-powered state management

---

## 🛠 Tech Stack

| Layer        | Technologies                                                        |
| ------------ | ------------------------------------------------------------------- |
| **Frontend** | React, Redux Toolkit, Material UI, React Router, React Quill, Axios |
| **Backend**  | Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt                 |
| **Other**    | Cloudinary, dotenv, cors                                            |

---

## 📁 Folder Structure

### `src/components/`

```
components/
├── comment/
│   ├── CommentItem.js
│   └── CommentSection.js
├── common/
│   └── PageTransitionWrapper.js
├── footer/
│   ├── Footer.js
│   ├── FooterAbout.js
│   ├── FooterLinks.js
│   └── FooterSubscribe.js
├── header/
│   ├── Header.js
│   ├── LeftMenu.js
│   ├── MobileDrawer.js
│   └── RightMenu.js
├── postDetail/
│   ├── AuthorInfo.js
│   ├── ScrollProgressBar.js
│   ├── TableOfContents.js
│   └── interactionBar/
│       ├── EmbeddedInteractionBar.js
│       ├── FloatingInteractionBar.js
│       └── InteractionBarBase.js
├── sidebar/
│   ├── CategoryList.js
│   ├── Sidebar.js
│   ├── SidebarTags.js
│   └── SocialMediaBox.js
├── HomeSlider.js
├── Layout.js
├── PostCard.js
├── ScrollTopButton.js
├── SearchDialog.js
```

### `server/`

```
server/
  .env
  .gitignore
  index.js
  package-lock.json
  package.json

  models/
    Category.js
    comment.model.js
    Post.js
    Settings.js
    Tags.js
    User.js

  routes/
    auth.js
    categoryRoutes.js
    comments.js
    dashboardRoutes.js
    postRoutes.js
    settings.js
    tagRoutes.js
    userRoutes.js
```

---

## ⚙️ Installation

```bash
# Frontend
git clone https://github.com/semihkececioglu/materialblog.git
cd materialblog
npm install
npm run dev

# Backend
git clone https://github.com/semihkececioglu/materialblog-server.git
cd materialblog-server
npm install
npm run start:dev
```

### .env example:

```env
MONGO_URI=your_mongo_connection
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

---

## 📸 Screenshots

### 🌐 Homepage (Light & Dark)

![Homepage](./screenshots/home.jpg)
![Homepage Dark](./screenshots/home-dark.jpg)

### 🔐 Authentication

![Login](./screenshots/login.jpg)
![Register](./screenshots/register.jpg)

### 👤 User Profile

![Profile](./screenshots/profile.jpg)
![Edit Profile](./screenshots/editprofile.jpg)

### 🔎 Search Dialog

![Search Dialog](./screenshots/searchdialog.jpg)

### 🧾 Post UI

![Post Card](./screenshots/postcard.jpg)
![Post Detail](./screenshots/postdetail.jpg)
![Author Info](./screenshots/authorinfo.png)
![Table of Contents](./screenshots/tableofcontents.png)
![Interaction Bar](./screenshots/interactionbar.png)
![Prev/Next Navigation](./screenshots/prev-next-posts.png)
![Comments Section](./screenshots/comments.png)

### 🛠 Admin Panel

![Admin Dashboard](./screenshots/admin-dashboard.png)
![Admin Posts](./screenshots/admin-posts.png)
![Admin Editor](./screenshots/admin-post-editor.png)
![Admin Categories](./screenshots/admin-categories.png)
![Admin Tags](./screenshots/admin-tags.png)
![Admin Comments](./screenshots/admin-comments.png)
![Admin Settings](./screenshots/admin-settings.png)
![Admin Users](./screenshots/admin-users.png)

### 📱 Mobile View

![Mobile Home](./screenshots/mobile-home.png)
![Mobile Drawer](./screenshots/mobile-drawer.png)

---

## 📌 Roadmap

- [ ] Backend search + pagination
- [ ] SEO improvements (meta tags, sitemap)
- [ ] Admin role: user management (edit/delete)
- [ ] Unit tests & CI

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👤 Author

Built by **Semih Keçecioğlu**  
semihkecec@gmail.com
