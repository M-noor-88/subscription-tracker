import { Router } from "express";
import authorize from '../middlewares/auth.middleware.js';
import {
    createSubscription,
    getUserAuthSubscription,
    getUserSubscription,
    cancelSubscription,
    getUpcomingRenewals
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/", (req, res) => res.json({ title: "all subscription  " }));

subscriptionRouter.get("/upcomming-renewals", authorize, getUpcomingRenewals);

subscriptionRouter.get("/:id", (req, res) => res.json({ title: "get subscription details  " }));

subscriptionRouter.post("/", authorize, createSubscription);

subscriptionRouter.put("/:id", (req, res) => res.json({ title: "update subscription  " }));

subscriptionRouter.delete("/:id", (req, res) => res.json({ title: "delete subscription  " }));

// get subscription for user 
subscriptionRouter.get("/user/:id", authorize, getUserSubscription);
subscriptionRouter.get("/auth/auth", authorize, getUserAuthSubscription);

subscriptionRouter.put("/:id/cancel", authorize, cancelSubscription);




export default subscriptionRouter;