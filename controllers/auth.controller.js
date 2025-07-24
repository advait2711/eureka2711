// controllers/auth.controller.js

import bcrypt from "bcrypt";
import { getDB } from "../config/db.js";

// Renders the login page
export const renderLoginPage = (req, res) => {
  res.render("login");
};

// Handles the login form submission
export const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  const admin = await getDB().collection("admins").findOne({ username });

  if (!admin) {
    return res.status(401).send("Invalid username or password");
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  if (isMatch) {
    req.session.userId = admin._id; 
    res.redirect("/dashboard");
  } else {
    res.status(401).send("Invalid username or password");
  }
};

// Handles admin logout
export const handleLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Could not log out.");
    }
    res.redirect("/login");
  });
};

// Middleware to protect routes
export const isAdmin = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.redirect("/login");
  }
};