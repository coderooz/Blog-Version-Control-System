# Blog Version Control System (Blog VCS)

**Version**: V1 — scalable foundation for rich blog versioning.

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS 4+
- TipTap (rich text editor)
- MongoDB + Mongoose
- `diff-match-patch` for diffing versions
- Optional: Shadcn UI components, Zustand for state management

---

## Directory Structure

```

blog-vcs/
├── app/
│   ├── layout.tsx         ← Root layout & navigation
│   ├── page.tsx           ← Redirects to editor
│   ├── editor/page.tsx    ← Blog editing UI
│   ├── versions/page.tsx  ← Version list & preview
│   ├── compare/page.tsx   ← Version comparison UI
│   └── api/               ← CRUD APIs for versions
├── components/blocks/     ← Reusable UI components
│   ├── Editor.tsx
│   ├── VersionList.tsx
│   ├── DiffViewer.tsx
│   └── Notification.tsx
├── lib/                   ← App business logic
│   ├── db.ts
│   └── versionControl.ts
├── models/                ← Mongoose schemas
│   ├── BlogPost.ts
│   └── Version.ts
├── styles/                ← Global CSS
│   └── globals.css
├── next.config.js
├── postcss.config.cjs
├── package.json
└── README.md

````

---

## Getting Started

1. **Clone**

   ```bash
   git clone https://github.com/coderooz/Blog-Version-Control-System.git
   cd Blog-Version-Control-System
````

2. **Install**

   ```bash
   npm install
   ```

3. **Configure Environment**

   Create a `.env.local` file with:

   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run in Development**

   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000/editor](http://localhost:3000/editor) to start editing.

---

## Features (V1)

* Rich text editing with TipTap.
* Version saving (creates a snapshot on save).
* Version listing, preview, and timestamp.
* Version diffing using `diff-match-patch`.
* Reverting—restores content and creates a new version.
* Clean UI with Tailwind CSS; ready for Shadcn UI enhancements.

---

## Future roadmap (beyond V1)

* **V2**: Authentication (e.g., NextAuth.js), multi-user, permissions.
* **V3**: Markdown support + side-by-side diff view.
* **V4**: UI polish with Shadcn UI components, mobile responsiveness.
* **V5**: CI/CD, testing (unit + integration), code quality tools.

---

## Contributing

Contributions, issues, and feature requests are welcome! Let’s make Blog VCS even better together.

---

## License

MIT License

---