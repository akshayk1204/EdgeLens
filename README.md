# 🌐 EdgeLens

**EdgeLens** is a global edge monitoring solution that measures latency from multiple geographic regions to Cloudflare Points of Presence (POPs). It helps you gain real-world insight into CDN edge performance using lightweight scripts deployed on cloud VMs or serverless functions.

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
│ Global VM │────▶│ Cloudflare Worker │────▶│ EdgeLens Backend │
│ (e.g. SJC) │ └────────────────────┘ └────────┬──────────────┘
└──────────────┘ │
▲ ▼
┌──────────────┐ ┌──────────────┐
│ Global VM │────▶ Periodic Probe Script ─────▶│ PostgreSQL DB │
│ (e.g. FRA) │ └──────────────┘
└──────────────┘


---

## 📦 Installation

### 1. Deploy Cloudflare Worker (Probe Endpoint)

```js
// worker.js
export default {
  async fetch(request) {
    return new Response("pong", {
      headers: { "Content-Type": "text/plain" },
    });
  },
};

### Deploy via Cloudflare Workers Dashboard or wrangler CLI:

wrangler publish

Example endpoint: https://edgelens-probe.yourdomain.workers.dev

2. Deploy Probe Script on Global VM
bash
Copy
Edit
# Connect to your VM
git clone https://github.com/YOUR_ORG/edgelens
cd edgelens/probe
npm install
node index.js
The script pings the Worker URL, calculates latency, and posts results to your backend:

json
Copy
Edit
POST /api/probe
{
  "colo": "SJC",
  "region": "us-west",
  "latency": 102,
  "timestamp": "2025-05-22T22:00:00.000Z"
}
You can automate this via cron or systemd.

3. Backend API Setup
A simple Express server with PostgreSQL:

bash
Copy
Edit
cd backend
npm install
node server.js
Example Route:

js
Copy
Edit
POST /api/probe
{
  "colo": "SJC",
  "region": "us-west",
  "latency": 128,
  "timestamp": "2025-05-22T23:01:10Z"
}
Update db.js with your PostgreSQL credentials.
