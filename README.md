# 🌿 Salmart — Sierra Leone's Digital Marketplace

> A web-based digital market system connecting local traders and buyers across Sierra Leone.  
> Built with HTML5, CSS3, and vanilla JavaScript —SAAS Firebasestudio backend and database, no frameworks.

---

## Project Overview

**Salmart** is a fully responsive, role-based digital marketplace tailored specifically for the Sierra Leonean context. It allows local traders (sellers) to list their products online and enables buyers to browse, search, filter, and add items to a cart — all stored in the browser using `localStorage`.

This project was built as a **Web Design 1 (DCOMP204)** assignment at **Limkokwing University of Creative Technology, Sierra Leone** — Faculty of Design Innovation, Semester 04.

---

## 🚀 Live Demo

🔗 [View on GitHub Pages](https://github.com/Bakeer-asc/FICT-SEMESTER-4-WEB-DESIGN-1-GROUP-J)

---

## Features

### Buyer Experience

- Browse a live product grid sourced from localStorage
- **Live search** — filters products in real time as you type
- **Category filters** — Produce, Crafts, Textiles, Seafood, Grains & Spices
- **Shopping cart** — add/remove items, view quantities and total in Sierra Leonean Leones (Le)
- Contact seller directly via phone number on each product card

### Seller Experience

- Register as a verified trader with your market location
- **Seller Dashboard** — add, edit, and delete your own product listings
- Products are saved to `localStorage` and appear live in the buyer marketplace instantly
- Dashboard is protected — only accessible when logged in as a seller

### Authentication System

- Separate **Buyer** and **Seller** signup flows
- Role-based login — buyers go to the marketplace, sellers go to the dashboard
- Session management via `localStorage` — stays logged in on refresh
- Route protection — unauthenticated users are redirected to the login page

### UI/UX

- Mobile-first responsive design (CSS Grid + Flexbox)
- Sierra Leone–inspired color palette (Emerald Green + Gold)
- Google Fonts — **Poppins** (headings) + **Open Sans** (body)
- Font Awesome 6 icons throughout
- Smooth transitions, hover effects, and toast notifications
- Clean card-based layout with product images from Unsplash

---

## 🛠️ Getting Started

### Option 1 — Open Locally (Simplest)

1. Clone or download this repository
2. Open `index.html` in any modern browser
3. No installation, build step, or server needed

```bash
git clone https://github.com/Bakeer-asc/FICT-SEMESTER-4-WEB-DESIGN-1-GROUP-J
cd salmart
# Open index.html in your browser
```

### Option 2 — Deploy to GitHub Pages

1. Push the project to a GitHub repository
2. Go to **Settings → Pages**
3. Set Source to `main` branch, root folder `/`
4. Click **Save** — your site will be live at:
   `https://github.com/Bakeer-asc/FICT-SEMESTER-4-WEB-DESIGN-1-GROUP-J`

---

## 🧪 Testing the System

### As a Buyer

1. Open `index.html` — browse the seeded product listings
2. Click **Sign Up** → choose **Buyer** → fill in details
3. Log in → search for products, apply category filters
4. Click **Add to Cart** on any product → open cart to view total

### As a Seller

1. Click **Sign Up** → choose **Seller** → select your market location
2. Log in → you'll be taken to the **Seller Dashboard**
3. Fill in the **Add Product** form and submit
4. Your product instantly appears in the buyer marketplace at `index.html`
5. Edit or delete your listings from the **My Listings** section

### Form Validation

All forms include custom JavaScript validation:

- Empty fields show inline error messages
- Phone numbers are validated against a Sierra Leone number pattern
- Duplicate email addresses are rejected at signup
- Successful actions show a green toast notification

---

## Design System

| Token             | Value     | Usage                                      |
| ----------------- | --------- | ------------------------------------------ |
| `--color-primary` | `#0B6E4F` | Emerald green — buttons, headings, accents |
| `--color-accent`  | `#C98A10` | Gold — cart badge, stats, highlights       |
| `--color-text`    | `#1F2933` | Charcoal — body text                       |
| `--color-bg`      | `#F7F8F9` | Light gray — page background               |
| `--font-heading`  | Poppins   | Navigation, headings, buttons              |
| `--font-body`     | Open Sans | Body text, labels, descriptions            |

---

## Dependencies (All via CDN — no npm needed)

| Library                                  | Version | Purpose                               |
| ---------------------------------------- | ------- | ------------------------------------- |
| [Google Fonts](https://fonts.google.com) | —       | Poppins + Open Sans typography        |
| [Font Awesome](https://fontawesome.com)  | 6.5.1   | Icons (nav, cart, categories, social) |
| [Unsplash](https://unsplash.com)         | —       | Product placeholder images            |

---

## Sierra Leone Context

SaloneMarket is designed specifically for the local Sierra Leonean market economy:

- **Markets covered:** King Jimmy, Lumley, Bo Town, Makeni Central, Kenema
- **Currency:** All prices displayed in **Sierra Leonean Leones (Le)**
- **Product categories** reflect local trade: produce, crafts, gara cloth, bonga fish, country rice
- **Phone-based contact** system suits the local mobile-first culture
- **Mobile-first design** optimized for the most common device type in Sierra Leone

---

## Limitations

This is an academic prototype. The following are known limitations for production consideration:

- `localStorage` is **browser-specific** — data does not sync across devices
- Passwords are stored in **plain text** — a real app would use server-side bcrypt hashing
- **No payment gateway** — buyers contact sellers by phone number
- Seller images require an **external image URL** (Unsplash or direct link)
- Data is **lost if the browser's localStorage is cleared**

---

## 📄 License

This project is licensed under the **MIT License** — free to use, modify, and distribute for educational and commercial purposes.

---
