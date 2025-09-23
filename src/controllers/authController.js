import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const signUp = async (req, res, next) => {
    let session = await mongoose.startSession();
    // this mongo session , to apply session transaction (Atomic : All done! or Nothing)
    session.startTransaction();

    try {
        const { name, email, password } = req.body;

        // Check if user exist
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const error = new Error("This user Already Exist");
            error.statusCode = 409;
            throw error;
        }


        // Not ! , Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create([{ name, email, password: hashedPassword }], { session });

        const token = jwt.sign({ userId: newUser[0]._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN });



        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success: true,
            message: "User Created",
            data: {
                Token: token,
                User: newUser
            }
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error("This user Already Exist");
            error.statusCode = 409;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const error = new Error("Password not valid");
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN });

        res.status(200).json({
            success: true,
            message: "Sgined in",
            Token: token,
        });

    } catch (error) {
        next(error);
    }
};

export const signOut = (req, res, next) => {

};