// Cloudflare Worker — HuggingFace Space keep-alive ping
// Fires every 20 minutes via cron trigger
// Prevents HF free tier Space from sleeping after 48h inactivity

export default {
  async scheduled(event, env, ctx) {
    const HF_URL = "https://amitmaurya01-amit-maurya-digital-twin.hf.space/";

    try {
      const res = await fetch(HF_URL, {
        method: "GET",
        signal: AbortSignal.timeout(15000),
        headers: { "User-Agent": "CF-Keepalive/1.0" }
      });
      console.log(`[keepalive] ping OK — status ${res.status}`);
    } catch (e) {
      console.error(`[keepalive] ping failed — ${e.message}`);
    }
  }
};
