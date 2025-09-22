import { Router } from "express";

const subscriptionRouter = Router();

subscriptionRouter.get("/", (req, res) => res.json({ title: "all subscription  " }));

subscriptionRouter.get("/:id", (req, res) => res.json({ title: "get subscription details  " }));

subscriptionRouter.post("/", (req, res) => res.json({ title: "create subscription  " }));

subscriptionRouter.put("/:id", (req, res) => res.json({ title: "update subscription  " }));

subscriptionRouter.delete("/:id", (req, res) => res.json({ title: "delete subscription  " }));

// get subscription for user 
subscriptionRouter.get("/user/:id", (req, res) => res.json({ title: "all user subscription  " }));

subscriptionRouter.put("/:id/cancel", (req, res) => res.json({ title: "cancel specific subscription  " }));

subscriptionRouter.get("/upcomming-renewals", (req, res) => res.json({ title: "get upcomming renewals  " }));



export default subscriptionRouter;