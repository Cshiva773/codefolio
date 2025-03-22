import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import companyRoutes from './routes/company.routes.js';
import statsRoutes from './routes/stats.routes.js';
import searchRoutes from './routes/search.routes.js';
import { validateComment,validateFilterParams,validateReply,validateCreatePost,validateUpdatePost } from './middlewares/post.middleware.js';
const app=express()
app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true
}))

app.use(express.json({
    limit:"16kb"
}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static('public'))
app.use(cookieParser())

// // Apply validation middleware
// app.use((req, res, next) => {
//     if (req.method === 'POST' && req.path === '/api/posts') {
//       return validateCreatePost(req, res, next);
//     }
//     if (req.method === 'PUT' && /^\/api\/posts\/[a-zA-Z0-9]+$/.test(req.path)) {
//       return validateUpdatePost(req, res, next);
//     }
//     if (req.method === 'POST' && /^\/api\/posts\/[a-zA-Z0-9]+\/comments$/.test(req.path)) {
//       return validateComment(req, res, next);
//     }
//     if (req.method === 'POST' && /^\/api\/posts\/[a-zA-Z0-9]+\/comments\/[a-zA-Z0-9]+\/replies$/.test(req.path)) {
//       return validateReply(req, res, next);
//     }
//     if (req.method === 'GET' && req.path === '/api/posts/filter') {
//       return validateFilterParams(req, res, next);
//     }
//     next();
//   });

// Root Route
app.get("/", (req, res) => {
    res.json({ message: "Server is running successfully!" });
});


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api", postRoutes);
app.use('/api', companyRoutes);
app.use('/api', statsRoutes);
app.use('/api', searchRoutes);

export { app }