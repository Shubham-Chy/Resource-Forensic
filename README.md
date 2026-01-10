
# 鑑識 // Resource Forensic

Resource Forensic is a minimalist, high-performance web archive for premium editing assets (Software, Plugins, Anime Clips). It uses a "Forensic Data Pipeline" to manage resources securely.

## 🛠 Architecture
- **Frontend**: React 19 + Tailwind CSS
- **Data Engine**: Virtual JSON Vault (Local + Static Sync)
- **Deployment**: Optimized for Netlify/Vercel via GitHub CI/CD

## 📡 The Update Protocol
This site uses a hybrid data model to ensure global performance without a heavy database:

1. **Local Entry**: Admin adds items via the `/admin` terminal. These are stored in `localStorage` for immediate preview.
2. **Global Sync**: To push updates to all users:
   - Enter the Admin Panel -> **Registry**.
   - Click **PREPARE_GLOBAL_DEPLOYMENT**.
   - Copy the generated TypeScript code.
   - Replace the contents of `data/resources.ts` with this code.
   - **Push to GitHub**.
3. **Automated Deploy**: GitHub triggers a Netlify build, making your new items live globally.

## 🔐 Security
The Admin Panel is protected by a multi-stage authentication protocol. Credentials are encrypted within the `AdminLogin.tsx` logic.

---
*Created for the elite editing community.*
