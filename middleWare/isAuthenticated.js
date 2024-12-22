import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        // console.log("In authorization middleware");
        
        // Check for Authorization header
        const authHeader = req.header("Authorization");
        // console.log("header ",authHeader)

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization header missing"
            });
        }

        // Extract token
        const token = authHeader.replace("Bearer ", "").trim();
        
        // console.log("Token:", token);
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing"
            });
        }

        // Verify token
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.user = decoded;  // Attach decoded user info to request
            // console.log("Decoded token:", decoded);
        } catch (error) {
            console.error("Error during token verification:", error.message);
            return res.status(401).json({
                success: false,
                message: "Token invalid"
            });
        }

        // Proceed if token is valid
        next();
    } catch (error) {
        console.log("Error in authorization middleware:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export default isAuthenticated;
