import { Router } from "express";
import { getUser, getUsers } from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get("/", getUsers);

userRouter.get("/:id", authorize, getUser);

userRouter.post("/", (req, res) => res.json({ title: "Create new user" }));

userRouter.put("/:id", (req, res) => res.json({ title: "Update user " }));

userRouter.delete("/:id", (req, res) => res.json({ title: "delete user " }));

export default userRouter;