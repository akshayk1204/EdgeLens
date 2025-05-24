// pingProbes.js
const axios = require('axios');
const yargs = require('yargs');

const WORKER_URL = 'https://edgelens-probe.edg-akulkarni.workers.dev'; // ← Replace with your actual Worker URL
const BACKEND_API = 'http://localhost:3001/api/probe';


const argv = yargs.option('region', {
  type: 'string',
  demandOption: true,
  describe: 'Region code (e.g. SJC, FRA, LAX)',
}).argv;

const REGION = argv.region.toUpperCase();

async function fetchFromCloudflare() {
  const start = Date.now();
  try {
    const response = await axios.get(WORKER_URL, { timeout: 5000 });
    const latency = Date.now() - start;

    const { colo, city } = response.data || {};

    const probe = {
      colo: colo || 'UNKNOWN',
      region: REGION,
      latency,
      timestamp: new Date().toISOString()
    };

    return probe;
  } catch (err) {
    return {
      colo: 'ERROR',
      region: REGION,
      latency: null,
      timestamp: new Date().toISOString(),
      error: err.message || 'Unknown error'
    };
  }
}

async function postToBackend(probe) {
  try {
    const res = await axios.post(BACKEND_API, probe);
    console.log(`✅ Probe sent for region ${probe.region}:`, res.data.message);
  } catch (err) {
    console.error(`❌ Failed to POST to backend:`, err.message);
  }
}

async function run() {
  const probe = await fetchFromCloudflare();
  console.log('📡 Probe result:', probe);

  if (!probe.error) {
    await postToBackend(probe);
  } else {
    console.error('⚠️ Skipping backend POST due to error.');
  }
}

run();
