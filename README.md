# Success Mahlangu's Romantic Birthday Website

A premium, SEO-optimized, romantic birthday website built with Vanilla HTML, CSS, and JS, featuring stickman animations.

## SEO Optimizations
- Complex meta tags for indexing.
- `robots.txt` and `sitemap.xml` included.
- Semantic HTML5 structure.

## SSL and Security
To ensure a secure connection with dynamic SSL certificates, it is recommended to use **Certbot** with **Let's Encrypt** if hosting on a VPS (like Nginx/Apache), or enable Managed SSL if using platforms like Vercel, Netlify, or AWS Amplify.

### Dynamic SSL with Nginx & Certbot
1. Install Certbot: `sudo apt install certbot python3-certbot-nginx`
2. Run Certbot: `sudo certbot --nginx -d yourdomain.com`
3. Certbot will automatically handle renewals via a cron job.

## Setup
1. Clone the repository.
2. Open `src/index.html` in your browser or serve using a local server.

## Folder Structure
- `src/`: Source code (HTML, CSS, JS).
- `public/`: SEO files and static assets.
- `statics/`: Images and other static media.
