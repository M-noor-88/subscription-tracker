import { Router } from "express";

const authRouter = Router();

authRouter.post("/sign-up", (req, res) => { res.json({ title: "Sign UP" }) });
authRouter.post("/sign-in", (req, res) => { res.json({ title: "Sign In" }) });
authRouter.post("/sign-out", (req, res) => { res.json({ title: "Sign Out" }) });


export default authRouter;