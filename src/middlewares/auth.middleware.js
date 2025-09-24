import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// * Request -> Authorize Middleware -> verify -> If Valid -> next -> get user details 
// *  Flow :
// ?  Get token from the request --> decode it and get the userId (what we sgined before (Login  , SginUp)) 
// ?  --> get the user by Id --> attach it in the request , so the controller can know who the user that take the action.

const authorize = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            res.status(401).json({ message: "Unauthorized , No token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);

        if (!user) {
            res.status(401).json({ message: "Unauthorized , No user" });
        }

        req.user = user;

        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized ", error: error.message });
    }
}


export default authorize;