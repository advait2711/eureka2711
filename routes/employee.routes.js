// routes/employee.routes.js

import express from "express";
import {
  renderEmployeeListPage,
  renderCreateEmployeeForm,
  handleCreateEmployee,
  renderEditEmployeeForm,
  handleUpdateEmployee,
  handleDeleteEmployee,
} from "../controllers/employee.controller.js";

const router = express.Router();

router.get("/employees", renderEmployeeListPage);
router.get("/employees/create", renderCreateEmployeeForm);
router.post("/employees/create", handleCreateEmployee);
router.get("/employees/edit/:id", renderEditEmployeeForm);
router.post("/employees/edit/:id", handleUpdateEmployee);
router.post("/employees/delete/:id", handleDeleteEmployee);

export default router;