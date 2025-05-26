# 🌐 EdgeLens

EdgeLens is a global edge monitoring solution that measures latency from multiple geographic regions to Cloudflare Points of Presence (POPs). It helps you gain real-world insight into CDN edge performance using lightweight scripts deployed on cloud VMs or serverless functions.

---

## 🚀 Features

- 🌍 Measure real-time latency from different global regions  
- 🌐 Supports Cloudflare Workers for edge endpoint probes  
- 📡 Pushes latency metrics to a centralized backend API  
- 🧠 Detects regional performance anomalies or slow POPs  
- 💾 Stores data in PostgreSQL or compatible DBs  
- 📊 Can be integrated with Grafana or Superset for visualization  

---

## 🧩 Architecture Overview

┌──────────────┐ ┌────────────────────┐ ┌───────────────────────┐
│ Global VM │ ──▶ │ Cloudflare Worker │ ──▶ │ EdgeLens Backend │
│ (e.g. SJC) │ └────────────────────┘ └────────┬──────────────┘
└──────────────┘ ▲ │
│ ▼
┌──────────────┐
│ PostgreSQL DB │
└──────────────┘


---

## 📦 Installation

### 1. Deploy Cloudflare Worker (Probe Endpoint)


export default {
  async fetch(request) {
    return new Response("pong", {
      headers: { "Content-Type": "text/plain" },
    });
  },
};


Deploy via Cloudflare Workers Dashboard or Wrangler CLI:

wrangler publish

🐳 Build Docker Images
From the root directory of the project:

# Build frontend Docker image
docker build -t edgelens-frontend ./frontend/dashboard

# Build backend Docker image
docker build -t edgelens-backend ./backend

🏁 Run Containers

# Start backend container
docker run -d -p 3001:3001 --name edgelens-backend edgelens-backend

# Start frontend container
docker run -d -p 3000:80 --name edgelens-frontend edgelens-frontend

🌍 Visit the App
Frontend: http://your-server-ip:3000

Backend API: http://your-server-ip:3001/api/probe

3. Deploy Probe Script on Global VM

# On your cloud VM
git clone https://github.com/akshayk1204/EdgeLens
cd EdgeLens/workers/cloudflare/edgelens-probe
npm install
node index.js --region SJC

The script pings the Worker URL, calculates latency, and posts results to your backend:

POST /api/probe
{
  "colo": "SJC",
  "region": "us-west",
  "latency": 102,
  "timestamp": "2025-05-22T22:00:00.000Z"
}


📈 Visualization
Use a PostgreSQL-compatible dashboard (e.g., Grafana, Superset) to visualize latency trends and anomalies by region and colo.

📄 License
MIT © Akshay Kulkarni

