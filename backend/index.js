const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'probes.json');

app.use(cors());
app.use(bodyParser.json());

// Load existing probes from file or initialize empty
let probes = [];
if (fs.existsSync(DATA_FILE)) {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    if (Array.isArray(data)) {
      probes = data;
      console.log(`📁 Loaded ${probes.length} probes from disk`);
    } else {
      console.warn('⚠️ probes.json is not an array. Resetting to empty array.');
      probes = [];
    }
  } catch (err) {
    console.error('❌ Failed to parse probes.json:', err);
    probes = [];
  }
}

// Save probes to disk
const saveProbesToDisk = () => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(probes, null, 2));
};

// POST /api/probe — Submit or update probe result
app.post('/api/probe', (req, res) => {
  const { colo, region, timestamp, latency } = req.body;

  if (!colo || !region || !timestamp || latency === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Replace existing probe for the same region
  const existingIndex = probes.findIndex(p => p.region === region);
  if (existingIndex !== -1) {
    probes[existingIndex] = { colo, region, timestamp, latency };
  } else {
    probes.push({ colo, region, timestamp, latency });
  }

  saveProbesToDisk();
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
