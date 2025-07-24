// controllers/employee.controller.js

import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";

// Renders the page with all employees
export const renderEmployeeListPage = async (req, res) => {
    
    const employees = await getDB().collection("employees").find().project({ photo: 0 }).toArray();
    res.render("employees", { employees });
};

// Renders the form to create a new employee
export const renderCreateEmployeeForm = (req, res) => {
    res.render("create-employee");
};

// Handles creating a new employee, storing the photo in MongoDB
export const handleCreateEmployee = async (req, res) => {
    const { name, position, level } = req.body;
    const newEmployee = { name, position, level };

    
    if (req.file) {
        newEmployee.photo = {
            data: req.file.buffer,
            contentType: req.file.mimetype
        };
    }

    await getDB().collection("employees").insertOne(newEmployee);
    res.redirect("/employees");
};

// Renders the form to edit an employee
export const renderEditEmployeeForm = async (req, res) => {
    const id = new ObjectId(req.params.id);
    
    const employee = await getDB().collection("employees").findOne({ _id: id }, { projection: { photo: 0 } });
    res.render("edit-employee", { employee });
};

// Handles updating an employee's details 
export const handleUpdateEmployee = async (req, res) => {
    const id = new ObjectId(req.params.id);
    const { name, position, level } = req.body; 
    const updateData = { name, position, level };

    if (req.file) {
        updateData.photo = {
            data: req.file.buffer,
            contentType: req.file.mimetype
        };
    }

    await getDB().collection("employees").updateOne(
        { _id: id },
        { $set: updateData }
    );
    res.redirect("/employees");
};

// Handles deleting an employee
export const handleDeleteEmployee = async (req, res) => {
    const id = new ObjectId(req.params.id);

    
    await getDB().collection("teams").updateMany(
        {},
        { $pull: { members: new ObjectId(id.toString()) } } 
    );

    
    await getDB().collection("employees").deleteOne({ _id: id });
    res.redirect("/employees");
};

// Serves the employee's photo from the database
export const renderEmployeePhoto = async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const employee = await getDB().collection("employees").findOne({ _id: id });

        if (!employee || !employee.photo || !employee.photo.data) {
            
            return res.status(404).send('Photo not found.');
        }

        res.contentType(employee.photo.contentType);
       
        res.send(employee.photo.data.buffer);

    } catch (error) {
        console.error("Error fetching employee photo:", error);
        res.status(500).send("Error fetching photo.");
    }
};