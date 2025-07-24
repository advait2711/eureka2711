// routes/team.routes.js

import express from "express";
import {
  renderDashboard,
  renderCreateTeamForm,
  handleCreateTeam,
  renderTeamPage,
  addEmployeeToTeam,
  removeEmployeeFromTeam,
  handleDeleteTeam,
  handleCreateProject,
  handleDeleteProject,
} from "../controllers/team.controller.js";

const router = express.Router();

// GET routes
router.get("/dashboard", renderDashboard);
router.get("/teams/create", renderCreateTeamForm);
router.get("/teams/:id", renderTeamPage);
// Post routes
router.post("/teams/:id/add-member", addEmployeeToTeam);
router.post("/teams/create", handleCreateTeam);
router.post("/teams/:teamId/remove-member/:employeeId", removeEmployeeFromTeam);
router.post("/teams/delete/:id", handleDeleteTeam);
router.post('/teams/:id/projects/create', handleCreateProject);
router.post('/projects/delete/:projectId', handleDeleteProject);

export default router;