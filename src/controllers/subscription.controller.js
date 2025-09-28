import { workflowClient } from "../config/upstash.js";
import Subscription from "../models/subscription.model.js";
import mongoose from "mongoose";


export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id
        });

        const { workflowRunId } = await workflowClient.trigger({
            url: `${process.env.SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription.id
            },
            headers: {
                'content-type': 'application/json',
            },
            retries: 0,
        });

        res.status(201).json({
            success: true,
            data: {
                subscription, workflowRunId
            }
        });

    } catch (error) {
        next(error);
    }
}

export const getUserSubscription = async (req, res, next) => {
    try {
        // only user logged in subscripiton
        if (req.user._id != req.params.id) {
            const error = new Error("You are not the owner");
            error.status = 401;
            throw error;
        }

        const subscripitons = await Subscription.find({ user: req.params.id });
        res.status(200).json({
            success: true,
            data: subscripitons
        });

    } catch (error) {
        next(error);
    }
}


// Authenticated user subscriptions without pass the id 
export const getUserAuthSubscription = async (req, res, next) => {
    try {

        const subscripitons = await Subscription.find({ user: req.user._id });

        if (!subscripitons) {
            const error = new Error("No subscriptions for this user");
            error.status = 401;
            throw error;
        }
        res.status(200).json({
            success: true,
            message: "without passing the user id",
            data: subscripitons
        });

    } catch (error) {
        next(error);
    }
}


export const cancelSubscription = async (req, res, next) => {
    try {

        const { id } = req.params;

        //  Validate ID early
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid subscription ID" });
        }

        //  Fetch subscription
        const subscription = await Subscription.findById(id);
        if (!subscription) {
            return res.status(404).json({ success: false, message: "Subscription not found" });
        }

        // 3. Ownership / role check
        const isOwner = subscription.user.toString() === req.user._id.toString();
        if (!isOwner) {
            return res.status(403).json({ success: false, message: "Not authorized to cancel this subscription" });
        }

        //  Update if not already cancelled
        if (subscription.status !== "cancelled") {
            subscription.status = "cancelled";
            await subscription.save();
        }

        return res.status(200).json({
            success: true,
            message: "Subscription cancelled successfully",
            data: subscription.toObject() // or just subscription if you need mongoose doc
        });

    } catch (error) {
        next(error);
    }
}


export const getUpcomingRenewals = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // Define a time window for “upcoming” (e.g., next 30 days)
        const now = new Date();
        const next30 = new Date();
        next30.setDate(now.getDate() + 30);

        const subscriptions = await Subscription.find({
            user: userId,
            status: "active",
            renwalDate: { $gte: now, $lte: next30 }
        })
            .sort({ renwalDate: 1 }) // soonest first
            .lean();

        return res.status(200).json({
            success: true,
            data: subscriptions
        });
    } catch (error) {
        next(error);
    }
};