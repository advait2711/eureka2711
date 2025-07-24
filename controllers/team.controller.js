// controllers/team.controller.js

import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";

// Renders the main dashboard showing all teams
export const renderDashboard = async (req, res) => {
  try {
    const teams = await getDB().collection("teams").find().toArray();
    res.render("dashboard", { teams });
  } catch (error) {
    res.status(500).send("Error fetching teams.");
  }
};

// Renders the form to create a new team
export const renderCreateTeamForm = (req, res) => {
  res.render("create-team");
};

// Handles the creation of a new team
export const handleCreateTeam = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).send("Team name is required.");
  }
  await getDB().collection("teams").insertOne({ name, members: [] });
  res.redirect("/dashboard");
};

// Renders the page to view/edit a single team
export const renderTeamPage = async (req, res) => {
  try {
    const teamId = new ObjectId(req.params.id);
    const team = await getDB().collection("teams").findOne({ _id: teamId });

    if (!team) {
      return res.status(404).send("Team not found.");
    }

    
    const teamMembers = await getDB().collection("employees").find({
      _id: { $in: team.members.map(id => new ObjectId(id)) }
    }).toArray();

    
    const availableEmployees = await getDB().collection("employees").find({
      _id: { $nin: team.members.map(id => new ObjectId(id)) }
    }).toArray();
    
   
    const projects = await getDB().collection("projects").find({ teamId: teamId }).toArray();

    res.render("team-details", { team, teamMembers, availableEmployees, projects });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching team details.");
  }
};

// Adds a selected employee to a team
export const addEmployeeToTeam = async (req, res) => {
  try {
    const teamId = new ObjectId(req.params.id);
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).send("No employee was selected.");
    }

    await getDB().collection("teams").updateOne(
      { _id: teamId },
      { $addToSet: { members: new ObjectId(employeeId) } }
    );
    res.redirect(`/teams/${teamId}`);
  } catch (error) {
    console.error("Error adding employee to team:", error);
    res.status(500).send("Error adding employee to team.");
  }
};

// Removes an employee from a team
export const removeEmployeeFromTeam = async (req, res) => {
  try {
    const { teamId, employeeId } = req.params;
    await getDB().collection("teams").updateOne(
      { _id: new ObjectId(teamId) },
      { $pull: { members: new ObjectId(employeeId) } }
    );
    res.redirect(`/teams/${teamId}`);
  } catch (error) {
    res.status(500).send("Error removing employee from team.");
  }
};

// Deletes a team
export const handleDeleteTeam = async (req, res) => {
  try {
    const teamId = new ObjectId(req.params.id);
    await getDB().collection("teams").deleteOne({ _id: teamId });
    // Bonus: also delete projects associated with the team
    await getDB().collection("projects").deleteMany({ teamId: teamId });
    res.redirect("/dashboard");
  } catch (error) {
    res.status(500).send("Error deleting team.");
  }
};



// Handles the creation of a new project for a team
export const handleCreateProject = async (req, res) => {
  try {
    const teamId = new ObjectId(req.params.id);
    const { name, description, startDate, endDate } = req.body;

    if (!name || !startDate || !endDate) {
      return res.status(400).send("Project name, start date, and end date are required.");
    }

    await getDB().collection("projects").insertOne({
      name,
      description: description || "No description provided.",
      startDate,
      endDate,
      teamId: teamId,
    });

    res.redirect(`/teams/${teamId}`);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).send("Error creating project.");
  }
};

// Handles deleting a project
export const handleDeleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await getDB().collection("projects").findOne({ _id: new ObjectId(projectId) });

        if (!project) {
            return res.status(404).send("Project not found.");
        }

        await getDB().collection("projects").deleteOne({ _id: new ObjectId(projectId) });
        res.redirect(`/teams/${project.teamId}`);
    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).send("Error deleting project.");
    }
};