# 📝 Blog Version Control System (Blog-VCS)

A modern full-stack blog editing platform built with **Next.js 15**, **TypeScript**, **MongoDB**, and **TipTap** rich text editor. It features **version control**, allowing users to track, compare, and restore changes in blog posts — similar to Git for content writing.

---

## 🚀 Features

- ✍️ Rich Text Editor (TipTap)
- 💾 Save Versions with Timestamps
- 🕒 View History of Changes
- 🔄 Revert to Previous Versions
- 🧠 Visual Diff Viewer for Comparing Versions
- 🗃 MongoDB for Storing Blogs & Versions
- 📦 Next.js App Router with Full-stack API Routes
- 🎨 TailwindCSS + ShadCN UI for Interface

---

## 📁 Project Structure

```
blog-vcs/
├── app/
│   ├── editor/               # Editor Page
│   ├── versions/             # Version History
│   ├── compare/              # Compare Two Versions
│   └── api/                  # API Routes for saving, fetching
├── components/               # UI Components
├── lib/                      # DB & Helper Functions
├── models/                   # Mongoose Models
├── public/                   # Static Assets
├── styles/                   # Global Styles
├── .env.local                # Environment Variables
├── next.config.js            # Next.js Config
├── tailwind.config.ts        # Tailwind Config
└── README.md                 # You're here!

````

---

## ⚙️ Tech Stack

| Tool         | Purpose                        |
|--------------|--------------------------------|
| Next.js 15   | Full-stack React framework     |
| TypeScript   | Type safety                    |
| MongoDB      | NoSQL database                 |
| Mongoose     | MongoDB ODM                    |
| TipTap       | Rich text editor               |
| Tailwind CSS | Utility-first styling          |
| ShadCN UI    | Component library              |
| Diff-Match-Patch | Version comparison engine  |

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/coderooz/Blog-Version-Control-System.git
cd Blog-Version-Control-System
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/blogvcs
```

### 4. Run the Development Server

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## ✨ Usage Guide

### ✍️ Writing Blogs

* Navigate to `/editor`
* Use the rich text interface to write content.
* Click **Save Version** to snapshot the content.

### 📜 View Blog Versions

* Go to `/versions`
* See all saved versions by time.
* Select and view any past version.

### 🔍 Compare Versions

* Navigate to `/compare`
* Choose two versions to view a side-by-side diff.

### ♻️ Revert Version

* While viewing a past version, click **Revert** to make it the current version.

---

## 🧪 Project Scripts

| Script          | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Build for production     |
| `npm start`     | Start production server  |
| `npm run lint`  | Run ESLint               |

---

## 🧠 Future Plans

* Markdown Export/Import
* GitHub Backup Sync
* Collaborative Editing
* Comment & Annotations
* Autosave Drafts
* Authentication & Roles

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature-name`)
3. Make your changes
4. Commit and push (`git commit -am 'Add new feature' && git push origin feature-name`)
5. Open a Pull Request

---

## 📄 License

MIT License © [Coderooz](https://github.com/coderooz)

---

## 🌐 Live Demo

Coming soon...

