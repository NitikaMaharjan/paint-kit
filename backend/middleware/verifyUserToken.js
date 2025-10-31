var jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET;

const verifyUserToken = (req, res, next) => {

    // extract token from the request header named 'authtoken'
    const token = req.header('authtoken');
    if(!token){
        return res.status(401).json({ success: false, error: 'Access denied. No token provided.' });
    }
    
    try{
        // verify the token
        const data = jwt.verify(token, jwt_secret);
        // attach the signed in user's details (data) from the token to the request object so that the next route handler can access it
        req.user = data.user;
        // pass control to the route handler
        next();
    }catch(err){
        res.status(401).json({ success: false, error: 'Invalid or expired token.' });
    }
}

module.exports = verifyUserToken;