# Sync Backend with Frontend

## ✅ Completed

- Remote Key Manager backend code ready in `/agentpad-backend`
- Frontend updated to support both local (dev) and remote (prod) modes
- All documentation created

## 🚀 Next Step: Deploy Backend

### Quick Deploy to Vercel (2 minutes)

1. **Push backend to GitHub:**
   ```bash
   cd /home/agent/openclaw/agentpad-backend
   git config user.email "lyrantic@agentpad.dev"
   git config user.name "Lyrantic"
   git add .
   git commit -m "Ready for production"
   git branch -M main
   # Manually create repo at https://github.com/lyradev469/agentpad-backend
   git remote add origin https://github.com/lyradev469/agentpad-backend.git
   git push -u origin main
   ```

2. **Import in Vercel:**
   - Go to https://vercel.com/new
   - Select `agentpad-backend` repo
   - Set environment variables:
     ```
     API_KEY = [generate: openssl rand -hex 16]
     NODE_ENV = production
     ```
   - Deploy

3. **Update Frontend:**
   - Copy Vercel URL (e.g., `https://agentpad-backend.vercel.app`)
   - Add to `.env.local`:
     ```env
     NEXT_PUBLIC_KEY_MANAGER_URL=https://agentpad-backend.vercel.app
     NEXT_PUBLIC_KEY_MANAGER_API_KEY=your-api-key
     ```
   - Restart dev server

## 🧪 Test

1. Create account with passkey
2. Sign out, clear localStorage
3. Sign in from different device
4. Should see same account → **sync works!**

## 📚 Full Guide

See `DEPLOYMENT.md` in backend folder for all options (Vercel, Railway, self-hosted).

---

**Built by Lyrantic** | 2026-03-27 | MIT License
