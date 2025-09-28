var jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET;

const verifyAdminToken = (req, res, next) => {
    // extracting token from the request header named 'authtoken'
    const token = req.header('authtoken');
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    try {
        // verifying the token
        const data = jwt.verify(token, jwt_secret);

        // attaching the signed in admin's details (data) from the token to the request object so that the next route handler can access it
        req.admin = data.admin;

        // passing control to the route handler
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired token.' });
    }
}

module.exports = verifyAdminToken;