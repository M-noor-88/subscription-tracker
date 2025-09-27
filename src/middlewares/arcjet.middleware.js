import aj from "../config/arcjet.js";

const arjectMiddleware = async (req, res, next) => {
    try {
        const decesion = await aj.protect(req, { requested: 1 });

        if (decesion.isDenied()) {
            if (decesion.reason.isRateLimit()) {
                return res.status(429).json({ message: 'Rate limit exceeded' });
            }


            // ! Note , it's always block postman , As Bot detection , so we change the headr to act as browser
            // * User-Agent : Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36
            if (decesion.reason.isBot()) {
                return res.status(403).json({ message: 'Bot detected' });
            }

            return res.status(429).json({ message: 'Access Denied' });
        }

        next();
    } catch (error) {
        console.log(`Arject Middleware : ${error.message}`);
        next(error);
    }
}

export default arjectMiddleware;