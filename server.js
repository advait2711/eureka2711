// server.js

import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Route Imports
import authRoutes from "./routes/auth.routes.js";
import teamRoutes from "./routes/team.routes.js";
import employeeRoutes from "./routes/employee.routes.js";

// Controller/Middleware Imports
import { isAdmin } from "./controllers/auth.controller.js";
import connectDB from "./config/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "a secret key to sign the cookie",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.ATLAS_URI,
      dbName: "employees_db",
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// View Engine Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// --- Routes ---

// Public Routes (Login/Logout)
app.use("/", authRoutes);

// Protected Admin Routes (all routes below require login)
app.use("/", isAdmin, teamRoutes);
app.use("/", isAdmin, employeeRoutes);

// Redirect root URL to the dashboard if logged in, or login page if not
app.get("/", (req, res) => {
  if (req.session.userId) {
    res.redirect("/dashboard");
  } else {
    res.redirect("/login");
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});