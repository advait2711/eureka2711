// routes/employee.routes.js
import express from "express";
import upload from '../middleware/upload.js'; 

import {
    renderEmployeeListPage,
    renderCreateEmployeeForm,
    handleCreateEmployee,
    renderEditEmployeeForm,
    handleUpdateEmployee,
    handleDeleteEmployee,
    renderEmployeePhoto,
} from "../controllers/employee.controller.js";

const router = express.Router();

// GET routes
router.get("/employees", renderEmployeeListPage);
router.get("/employees/create", renderCreateEmployeeForm);
router.get("/employees/edit/:id", renderEditEmployeeForm);
router.get('/employees/:id/photo', renderEmployeePhoto); 

// POST routes 
router.post("/employees/create", upload.single('profilePicture'), handleCreateEmployee);
router.post("/employees/edit/:id", upload.single('profilePicture'), handleUpdateEmployee);
router.post("/employees/delete/:id", handleDeleteEmployee);

export default router;
