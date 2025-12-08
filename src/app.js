import express from "express";

import cors from "cors";

// your routes
const app = express(); // create express app
app.use(cors());
app.use(express.json());
app.use("/api/v1/post", postRouter);

//
//routes import
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import adminRouter from "./routes/admin.route.js";

// routes declaration
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/users", userRouter); // example route:http://localhost:4000/api/v1/users/register
app.use("/api/v1/post", postRouter); // route:http://localhost:4000/api/v1/post/user/create

export default app;
