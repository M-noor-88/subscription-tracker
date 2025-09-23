const errorMiddleware = (err, req, res, next) => {
    try {
        let error = { ...err };

        error.message = err.message;

        console.error(error);


        // Mongoose bad ObjectID
        if (err.name == 'CastError') {
            const message = 'Resource Not Found';

            error = new Error(message);
            error.statusCode = 404;
        }

        // Mongoose duplicate key
        if (err.code == 11000) {
            const message = 'Duplicate filed value';
            error = new Error(message);
            error.statusCode = 400;
        }

        // Mongoose Validation Error , Mapping more than error All of them
        if (err.name == 'ValidationError') {
            const message = Object.values(err.errors).map(val => val.message);
            error = new Error(message);
            error.statusCode = 400;
        }


        res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Server Error' });

    } catch (error) {
        next(error);
    }
}

export default errorMiddleware;


/**
findById → not found
    ↓
throw error
    ↓
catch (error) in same function
    ↓
next(error)
    ↓
Express core
    ↓
errorMiddleware(err, req, res, next)
    ↓
res.status(...).json(...)
*/


// ? عندك طريقنين حتى تطبق الهاندلر .
// * لما تستخدم هي الميدلوير

//  throw by itself does not send a response.

//  next(error) is what hands the error to Express.

//  You need the catch block because throw inside an async function will reject the promise,
//  but if you don't catch it, Express won't see it unless you wrap with something like catchAsync.

//  That’s why many people use a helper like
//  catchAsync(fn) to avoid writing try/catch and just throw—the helper catches and calls next automatically.

//  ! ---------------------------
// ? 1️⃣  Use try/catch yourself

// (what we already do)

//* =====================
/* export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            const err = new Error('User not found');
            err.statusCode = 404;
            throw err;
        }

        res.json({ success: true, data: user });
    } catch (err) {
        next(err);   // you manually pass error to Express
    }
};
*/

// ! -------------------------------

// ? 2️⃣ Use a helper to avoid repeating try/catch

// Create a small wrapper:

/*
    utils/catchAsync.js
    export const catchAsync = fn =>
        (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
*/

// Then use it:

/* 
import { catchAsync } from '../utils/catchAsync.js';

export const getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        const err = new Error('User not found');
        err.statusCode = 404;
        throw err; // catchAsync will catch and call next(err)
    }

    res.json({ success: true, data: user });
});
*/

// Here:

// No try/catch inside controller.

// Any thrown / rejected error is automatically sent to your errorMiddleware through next(err).

// 👉 Both approaches work.