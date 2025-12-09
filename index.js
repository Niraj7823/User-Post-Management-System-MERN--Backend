import dotenv from "dotenv";
import connectDB from "./src/config/database.js";
import app from "./src/app.js";

dotenv.config();
const startServer = async () => {
  try {
    await connectDB();
    app.on("error", (error) => {
      console.log("ERROR", error);
      throw error;
    });
    app.get("/", (req, res) => {
      res.send("API running");
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running :${process.env.PORT}`);
    });
  } catch (error) {
    console.log("MongoDB connection error", error);
  }
};
startServer();
export default app;
