import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Root Route
app.get("/", (req, res) => {
    res.json({ message: "Server is running successfully!" });
});


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

export { app };

