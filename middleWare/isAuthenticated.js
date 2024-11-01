// import jwt from "jsonwebtoken";

// const isAuthenticated = async (req, res, next) => {
//     try{
//         // console.log('token-', req.header("Authorization"));
//         const authHeader = req.header("Authorization");
        
//         const token = authHeader.replace("Bearer ", "");
//         console.log(token)
        
//       if(!token || token == undefined){
//         return res.status(401).json({
//             success: false,
//             message: 'Token Missing'
//         })
//       }
//       try{
//         const decode = jwt.verify(token,process.env.SECRET_KEY)
//         req.user = decode;
//         console.log("decode",decode)
//       }catch(err){
//         console.error(err,'Error occured at verifying auth token')
//         return res.status(401).json({
//             success:false,
//             message:'Token Invalid'
//         })
//       }
//       next();
//     }
//     catch(err){
//         console.log('error at auth checkin')
//         return res.status(401).json({
//             success:false,
//             message:err.message
//         })

//     }
// };

// export default isAuthenticated;



import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        // Access token from the cookies
        const token = req.cookies.token;

        // Check if token exists
        if (!token) {
            return res.status(401).json({
                message: "No token found, please login",
                success: false
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Attach user info to request object
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "Invalid token",
            success: false
        });
    }
};

export default isAuthenticated;
