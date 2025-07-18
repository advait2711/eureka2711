// A temporary script to create your first admin. Run it once.
import bcrypt from 'bcrypt';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const saltRounds = 10;
const plainPassword = 'adminpassword'; // Change this
const username = 'admin'; // Change this

async function createAdmin() {
    const client = new MongoClient(process.env.ATLAS_URI);
    await client.connect();
    const db = client.db('employees_db');
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    await db.collection('admins').insertOne({ username, password: hashedPassword });
    console.log('Admin user created successfully.');
    client.close();
}
createAdmin();