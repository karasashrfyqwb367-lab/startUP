import mongoose from "mongoose";
import { config } from "dotenv";
import { resolve } from "node:path";
config({ path: resolve("./config/.env.development") });

import { JobApplicationModel } from "./src/DB/model/JobApplication.js";
import JobModel from "./src/DB/model/Jop.Model.js";
import { UserModel } from "./src/DB/model/User.model.js";

async function check() {
    await mongoose.connect(process.env.DB_URI);
    console.log("Connected to DB");

    const apps = await JobApplicationModel.find().populate('job').populate('user');
    console.log("Total Applications:", apps.length);

    apps.forEach(app => {
        console.log(`Job: ${app.job?.title}, User: ${app.user?.username}, Status: ${app.status}`);
        console.log(`Job ID in App: ${app.job?._id}`);
    });

    const jobs = await JobModel.find();
    console.log("Total Jobs:", jobs.length);
    jobs.forEach(j => {
        console.log(`Job: ${j.title}, ID: ${j._id}`);
    });

    await mongoose.disconnect();
}

check();
