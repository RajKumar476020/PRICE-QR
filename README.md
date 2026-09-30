<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Poppins&weight=700&size=42&duration=3000&pause=1000&color=D4AF37&center=true&vCenter=true&width=700&lines=PRICE-QR;Scan.+Browse.+Buy." alt="PRICE-QR" />

### 📱 One QR Code. Your Entire Business. Always Up To Date.

**A production-ready QR-based Digital Business Profile & Price List Platform** — built for shopkeepers, studios, restaurants, and small businesses who want a premium digital presence without printing a new catalogue every time a price changes.

<br/>

![React](https://img.shields.io/badge/React-0B0B0F?style=for-the-badge&logo=react&logoColor=D4AF37)
![NestJS](https://img.shields.io/badge/NestJS-0B0B0F?style=for-the-badge&logo=nestjs&logoColor=D4AF37)
![Prisma](https://img.shields.io/badge/Prisma-0B0B0F?style=for-the-badge&logo=prisma&logoColor=D4AF37)
![TypeScript](https://img.shields.io/badge/TypeScript-0B0B0F?style=for-the-badge&logo=typescript&logoColor=D4AF37)
![License](https://img.shields.io/badge/License-MIT-D4AF37?style=for-the-badge&labelColor=0B0B0F)

<br/>

[✨ Features](#-features) • [🧱 Tech Stack](#-tech-stack) • [🚀 Quick Start](#-quick-start) • [📂 Project Structure](#-project-structure) • [📜 Scripts](#-available-scripts) • [📄 License](#-license)

</div>

---

## 🌟 About The Project

**PRICE-QR** turns a simple QR code into a beautiful, always-fresh digital storefront.

Customers scan the QR code placed on your counter, menu card, visiting card, flex banner, or product packaging — and instantly see your **business profile** and your **latest price list** on their phone. No app to install. No PDF to download. No outdated rate cards.

Update a price once from your dashboard — every printed QR shows the new price immediately.

> 💡 **Perfect for:** Restaurants & cafés • Printing & advertising studios • Salons & spas • Retail & wholesale shops • Service providers • Freelancers & agencies

---

## ✨ Features

| | Feature | Description |
|---|---|---|
| 🔳 | **Dynamic QR Codes** | Generate a QR code for your business once — print it anywhere, update content anytime |
| 🏪 | **Digital Business Profile** | A polished public page with your business details, contact info, and branding |
| 💰 | **Live Price List** | Organised catalogue of items and services with prices that update in real time |
| ⚡ | **Instant Access** | Opens directly in the browser after a scan — zero installs, zero friction |
| 📱 | **Mobile-First Design** | Crafted for the phone screen your customers actually use |
| 🛠️ | **Owner Dashboard** | Manage your profile, categories, and prices from one place |
| 🔐 | **Secure Backend** | Structured NestJS API with a type-safe Prisma data layer |
| 🚢 | **Production-Ready** | Separate client/server builds with one-command production start |

---

## 🧱 Tech Stack

<div align="center">

| Layer | Technology |
|:---:|:---:|
| **Frontend** | React (Vite-style client build) |
| **Backend** | NestJS (Node.js, TypeScript) |
| **ORM / Database Layer** | Prisma |
| **Tooling** | npm scripts, monorepo-style `client` + `server` layout |

</div>

---

## 📂 Project Structure

```text
PRICE-QR/
├── client/          # React frontend (public profile page + owner dashboard)
├── server/          # NestJS backend API + Prisma schema & seed
└── package.json     # Root scripts to install, run, and build everything
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- A database supported by Prisma, with its connection string ready

### 1️⃣ Clone the repository

```bash
git clone https://github.com/RajKumar476020/PRICE-QR.git
cd PRICE-QR
```

### 2️⃣ Install all dependencies

One command installs both the server and the client:

```bash
npm run install:all
```

### 3️⃣ Configure environment variables

Create a `.env` file inside the `server/` folder and add your database connection string:

```env
DATABASE_URL="your-database-connection-string"
```

### 4️⃣ Set up the database

```bash
npm run prisma:push     # Sync the Prisma schema to your database
npm run prisma:seed     # (Optional) Load starter data
```

### 5️⃣ Run in development

Open two terminals:

```bash
# Terminal 1 — Backend
npm run dev:server

# Terminal 2 — Frontend
npm run dev:client
```

### 6️⃣ Build & run for production

```bash
npm run build
npm start
```

---

## 📜 Available Scripts

| Command | What it does |
|---|---|
| `npm run install:all` | Installs dependencies for both `server` and `client` |
| `npm run dev:server` | Starts the NestJS backend in watch/development mode |
| `npm run dev:client` | Starts the React frontend dev server |
| `npm run build:server` | Builds the backend for production |
| `npm run build:client` | Builds the frontend for production |
| `npm run build` | Builds both server and client |
| `npm run prisma:push` | Pushes the Prisma schema to the database |
| `npm run prisma:seed` | Seeds the database with initial data |
| `npm start` | Runs the production server (`server/dist/main`) |

---

## 🔄 How It Works

```text
   ┌──────────────┐      ┌────────────────┐      ┌──────────────────────┐
   │  Owner adds  │ ───▶ │  QR code is    │ ───▶ │  Customer scans QR   │
   │ profile &    │      │  generated &   │      │  and sees the live   │
   │ price list   │      │  printed once  │      │  profile + prices    │
   └──────────────┘      └────────────────┘      └──────────────────────┘
                                  ▲                          │
                                  └────── update anytime ────┘
```

---

## 🗺️ Roadmap

- [ ] Multi-language support (Hindi / English toggle)
- [ ] Custom themes & brand colours per business
- [ ] Item photos and categories with search
- [ ] WhatsApp "Order / Enquire" button
- [ ] Scan analytics for business owners
- [ ] Downloadable QR in print-ready formats (PNG / SVG / PDF)

---

## 🤝 Contributing

Contributions, ideas, and feedback are always welcome!

1. Fork the repository
2. Create your feature branch — `git checkout -b feature/amazing-feature`
3. Commit your changes — `git commit -m "Add amazing feature"`
4. Push to the branch — `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">

### ⭐ If PRICE-QR helps your business, give it a star!

**Made with ❤️ in India**

[Report Bug](https://github.com/RajKumar476020/PRICE-QR/issues) • [Request Feature](https://github.com/RajKumar476020/PRICE-QR/issues)

</div>
