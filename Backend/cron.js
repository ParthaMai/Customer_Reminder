import cron from "node-cron";
import axios from "axios";

cron.schedule("*/10 * * * *", async () => {
  try {
    const res = await axios.get("http://localhost:4000/api/health");
    console.log("Request sent:", res.status);
  } catch (err) {
    console.error("Error sending request:", err.message);
  }
});
