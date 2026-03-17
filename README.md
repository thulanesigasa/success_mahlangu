# Our Love Story Website — Secure Full-Stack Edition

A premium, SEO-optimized, secure full-stack web application designed as a personal repository for relationship timelines and memories. Built with **Node.js, Express, and SQLite**.

## 🎨 Design & Aesthetic
- Strict **Beige Theme** (`#F5F0EB`) with rose-gold glassmorphism accents.
- Responsive design tailored for mobile devices first.
- WCAG compliant typography (*Playfair Display* & *Lato*) and contrast.

## 🔒 Comprehensive Security Features (OWASP Compliant)
This application employs strict top-tier security measures:
1. **HTTPS Enforcement**: SSL/TLS configured out of the box.
2. **Authentication Gateway**: Isolated entry portal (`/login`).
3. **Bcrypt Credential Storage**: Only hardcoded approved encrypted users are allowed (`success` and `thulane`).
4. **Session Management**: Secure, HTTP-Only, SameSite cookies to mitigate CSRF.
5. **Content Security Policy (CSP)**: Powered by `helmet` to mitigate XSS and injection attacks.
6. **Rate Limiting / DDoS Mitigation**: IP-based rate limiting via `express-rate-limit`.
7. **SQL Injection Protection**: Strict parameterized queries on SQLite operations.
8. **XSS Sanitization**: Input fields are sanitized via the `xss` library before database insertion.

## 📈 Search Engine Optimization (SEO)
- **Technical SEO**: Lighthouse audited, fast initial load.
- **Structured Data**: JSON-LD Schema markup implemented.
- **Semantic HTML**: Proper elements (`<nav>`, `<main>`, `<article>`, breadcrumbs).
- **Metadata**: Unique tags, `<title>`, and descriptions. Robots `<meta>` carefully tuned (e.g. `noindex` on login page).
- **Media Optimization**: Dynamic alt-generation based on memory titles.

---

## 🚀 Setup & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Development SSL Certificates
Required to enable HTTPS locally.
```bash
npm run certs
# Or run manually: ./scripts/generate-certs.sh
```

### 3. Start the Secure Server
```bash
npm start
# OR for development with hot-reload:
npm run dev
```

The application will be securely available at: **https://localhost:3000**

### 4. Authentication Access
The gateway accepts only two authorized users:
- Username: **`success`** | Password: **`success_mahlangu`**
- Username: **`thulane`** | Password: **`thulane_sigasa`**

---

## 🛠️ Maintenance Scripts

We have provided built-in utilities in the `scripts/` directory:
- **`./scripts/backup.sh`**: Creates a timestamped snapshot of your SQLite database inside a `backups/` folder.
- **`./scripts/audit.sh`**: Runs dependency security scans (`npm audit`).
- **`./scripts/generate-certs.sh`**: Generates new local SSL keys.
