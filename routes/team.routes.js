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

router.get("/dashboard", renderDashboard);
router.get("/teams/create", renderCreateTeamForm);
router.post("/teams/create", handleCreateTeam);
router.get("/teams/:id", renderTeamPage);
router.post("/teams/:id/add-member", addEmployeeToTeam);

router.post("/teams/:teamId/remove-member/:employeeId", removeEmployeeFromTeam);
router.post("/teams/delete/:id", handleDeleteTeam);
router.post('/teams/:id/projects/create', handleCreateProject);
router.post('/projects/delete/:projectId', handleDeleteProject);

export default router;