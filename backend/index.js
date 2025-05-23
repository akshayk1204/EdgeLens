// backend/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// In-memory probe results
const probes = [];

// POST /api/probe — Submit probe result
app.post('/api/probe', (req, res) => {
  const { colo, region, timestamp, latency } = req.body;

  if (!colo || !region || !timestamp || latency === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  probes.push({ colo, region, timestamp, latency });
  res.status(201).json({ message: 'Probe saved' });
});

// GET /api/probes — All probe data
app.get('/api/probes', (req, res) => {
  res.json(probes);
});

// Optional: GET /api/probes/search?region=XYZ
app.get('/api/probes/search', (req, res) => {
  const { region } = req.query;
  const results = region
    ? probes.filter(p => p.region.toLowerCase() === region.toLowerCase())
    : probes;
  res.json(results);
});

app.listen(PORT, () => {
  console.log(`✅ EdgeLens backend running at http://localhost:${PORT}`);
});

