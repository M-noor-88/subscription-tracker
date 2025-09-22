import { Router } from "express";

const userRouter = Router();

userRouter.get("/", (req, res) => res.json({ title: "Get All Users" }));

userRouter.get("/:id", (req, res) => res.json({ title: "Get User by id" }));

userRouter.post("/", (req, res) => res.json({ title: "Create new user" }));

userRouter.put("/:id", (req, res) => res.json({ title: "Update user " }));

userRouter.delete("/:id", (req, res) => res.json({ title: "delete user " }));

export default userRouter;