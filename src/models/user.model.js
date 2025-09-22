import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User name is required '],
        trim: true,
        minLength: 2,
        maxLength: 30
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
    },

    password: {
        type: String,
        required: [true, 'password is required '],
        minLength: 6
    }


}, { timestamps: true });

const User = mongoose.model('User' , userSchema);

export default User;