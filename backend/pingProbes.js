// pingProbes.js
const axios = require('axios');
const yargs = require('yargs');

const WORKER_URL = 'https://edgelens-probe.edg-akulkarni.workers.dev'; 
const BACKEND_API = 'https://edgelens.letsdemo.co/api/probe';

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
