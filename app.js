import express from "express";
import dotenv from "dotenv";
import { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import dbConnect from "./src/config/dbConnect.js";
import authRouter from "./src/routes/auth.routes.js";
import subscriptionRouter from "./src/routes/subscription.routes.js";
import userRouter from "./src/routes/user.routes.js";
import errorMiddleware from "./src/middlewares/error.middleware.js";
import arjectMiddleware from "./src/middlewares/arcjet.middleware.js";
import workflowRouter from "./src/routes/workflow.routes.js";

// config
dotenv.config();
const app = express();



// Moddleware
app.use(urlencoded({ extended: false })); // For form body requests
app.use(cookieParser());
app.use(json());
app.use("/api/v1/workflows", workflowRouter);

app.use(arjectMiddleware);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscription", subscriptionRouter);


app.use(errorMiddleware); // should e in the end always 




// Routes 
app.get("/", (req, res) => {
    res.send("Welcome to subscription tracker ! ");
});



// Start The Server
const PORT = process.env.PORT || 7000;
app.listen(PORT, async () => {
    console.log(`Server is Running on PORT : ${PORT}`);

    // connect to db
    await dbConnect();
});

export default app;