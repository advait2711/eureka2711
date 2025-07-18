// controllers/employee.controller.js

import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";

// Renders the page with all employees
export const renderEmployeeListPage = async (req, res) => {
  const employees = await getDB().collection("employees").find().toArray();
  res.render("employees", { employees });
};

// Renders the form to create a new employee
export const renderCreateEmployeeForm = (req, res) => {
  res.render("create-employee");
};

// Handles creating a new employee
export const handleCreateEmployee = async (req, res) => {
  const { name, position, level } = req.body;
  await getDB().collection("employees").insertOne({ name, position, level });
  res.redirect("/employees");
};

// Renders the form to edit an employee
export const renderEditEmployeeForm = async (req, res) => {
  const id = new ObjectId(req.params.id);
  const employee = await getDB().collection("employees").findOne({ _id: id });
  res.render("edit-employee", { employee });
};

// Handles updating an employee's details
export const handleUpdateEmployee = async (req, res) => {
  const id = new ObjectId(req.params.id);
  const { name, position, level } = req.body;
  await getDB().collection("employees").updateOne(
    { _id: id },
    { $set: { name, position, level } }
  );
  res.redirect("/employees");
};

// Handles deleting an employee
export const handleDeleteEmployee = async (req, res) => {
  const id = new ObjectId(req.params.id);
  // Also remove this employee from any teams they might be in
  await getDB().collection("teams").updateMany(
      {},
      { $pull: { members: id } }
  );
  await getDB().collection("employees").deleteOne({ _id: id });
  res.redirect("/employees");
};