# 🚀 Complete Deployment Guide: Nashik Kumbh Mela Companion

Follow this step-by-step guide to connect your codebase to **Git/GitHub**, setup a **MongoDB Atlas Cloud Database**, deploy the **Node.js/Express Backend to Render**, and host the **React/Vite Frontend on Vercel**.

---

## 📌 STEP 1: Connect Project to Git & GitHub

### 1.1 Open Terminal in Root Directory (`d:\Kumbhamela`)
Run the following commands in your terminal:

```bash
# 1. Initialize Git repository
git init

# 2. Add all project files
git add .

# 3. Create your initial commit
git commit -m "Initial commit: Nashik Kumbh Mela Companion Fullstack Platform"
```

### 1.2 Create Repository on GitHub & Push Code
1. Go to [GitHub.com](https://github.com) and click **New Repository**.
2. Name your repository: `nashik-kumbh-mela-companion` (Select **Public** or **Private**).
3. Do **NOT** check "Add a README file" or ".gitignore" (we already created `.gitignore`).
4. Click **Create repository**.
5. Copy and run the generated commands in your terminal:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/nashik-kumbh-mela-companion.git
git push -u origin main
```

---

## 🍃 STEP 2: Setup MongoDB Atlas (Cloud Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in/create a free account.
2. Click **Build a Database** and select the **M0 Free Cluster**.
3. **Database Access (User Creation)**:
   - Go to **Security → Database Access** → Click **Add New Database User**.
   - Set Username: `kumbh_admin`
   - Set Password: `YourSecurePassword123` (Save this!).
   - Role: `Read and write to any database`.
4. **Network Access (IP Whitelist)**:
   - Go to **Security → Network Access** → Click **Add IP Address**.
   - Click **ALLOW ACCESS FROM ANYWHERE** (`0.0.0.0/0`) so your Render backend can connect.
5. **Get Connection URI**:
   - Go to **Database → Connect → Drivers**.
   - Copy the MongoDB URI string:
     ```text
     mongodb+srv://kumbh_admin:<password>@cluster0.xxxxx.mongodb.net/kumbh_mela?retryWrites=true&w=majority
     ```
   - Replace `<password>` with `YourSecurePassword123`.

---

## 🖥️ STEP 3: Deploy Backend to Render

1. Log in to [Render.com](https://render.com).
2. Click **New +** → Select **Web Service**.
3. Connect your GitHub account and select your repository: `nashik-kumbh-mela-companion`.
4. Fill in the deployment details:
   - **Name**: `kumbh-mela-backend`
   - **Region**: Oregon (US West) or Frankfurt (EU) or Singapore (Asia)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`

5. Scroll down to **Environment Variables** and add:
   | Key | Value |
   |---|---|
   | `PORT` | `5000` |
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | `mongodb+srv://kumbh_admin:YourSecurePassword123@cluster0.xxxxx.mongodb.net/kumbh_mela?retryWrites=true&w=majority` |
   | `JWT_SECRET` | `KumbhMelaSecureJwtSecret2026_Key#99` |
   | `CLIENT_URL` | `https://nashik-kumbh-mela.vercel.app` |

6. Click **Create Web Service**. Render will build and deploy your API!
7. Once finished, copy your Live Backend URL (e.g., `https://kumbh-mela-backend.onrender.com`).

---

## 🌐 STEP 4: Deploy Frontend to Vercel

1. Log in to [Vercel.com](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Import your GitHub repository: `nashik-kumbh-mela-companion`.
4. Configure Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Expand **Environment Variables** and add:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://kumbh-mela-backend.onrender.com/api` |

6. Click **Deploy**. Vercel will build your React application in ~1 minute!
7. Once deployed, Vercel will give you your live URL (e.g., `https://nashik-kumbh-mela.vercel.app`).

---

## 🌾 STEP 5: Seed MongoDB Database (Optional)

After your Render backend is live, you can populate your MongoDB database with initial Nashik Kumbh Mela data (Ghats, Temples, Parking, Emergency Contacts):

Run locally from your `backend` directory:
```bash
cd d:\Kumbhamela\backend
# Set your MongoDB Atlas URI in backend/.env then run:
node seed.js
```

---

## 🎯 Verification & Summary

- **Frontend**: `https://nashik-kumbh-mela.vercel.app` (Pilgrims & Mobile App)
- **Backend API**: `https://kumbh-mela-backend.onrender.com/api/health`
- **Admin Dashboard**: `https://nashik-kumbh-mela.vercel.app/admin/login`
  - Demo Admin Email: `admin@kumbhmela.gov.in`
  - Password: `Admin@123456`
