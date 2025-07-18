// routes/auth.routes.js

import express from "express";
import { renderLoginPage, handleLogin, handleLogout } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/login", renderLoginPage);
router.post("/login", handleLogin);
router.get("/logout", handleLogout);

export default router;