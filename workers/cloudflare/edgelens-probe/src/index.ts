export default {
  async fetch(request: Request): Promise<Response> {
    const start = Date.now();

    // Simulate probe logic
    const region = 'Texas';
    const colo = 'IAH';
    const latency = Date.now() - start;
    const timestamp = new Date().toISOString();

    const payload = { colo, region, timestamp, latency };

    // Post to local backend
    await fetch('/api/probe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    return new Response(JSON.stringify(payload), {
      headers: { 'Content-Type': 'application/json' },
    });
  },
};



