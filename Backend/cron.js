import cron from "node-cron";
import axios from "axios";

const PORT = process.env.PORT || 4000;

cron.schedule("*/10 7-23 * * *", async () => {
  try {
    const res = await axios.get(`http://localhost:${PORT}/api/health`);
    console.log("Request sent:", res.status);
  } catch (err) {
    console.error("Error sending request:", err.message);
  }
});
