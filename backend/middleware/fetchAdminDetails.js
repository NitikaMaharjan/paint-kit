var jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET;

const fetchAdminDetails = (req, res, next) => {
    // extracting token from the request header named 'authtoken'
    const token = req.header('authtoken');
    if (!token) {
        return res.status(401).send({ error: 'Please provide a valid token!' });
    }
    try {
        // verifying the token
        const data = jwt.verify(token, jwt_secret);

        // attaching the signed in admin's details (data) from the token to the request object so that the next route handler can access it
        req.admin = data.admin;

        // passing control to the route handler
        next();
    } catch (err) {
        res.status(401).send({ error: 'Please provide a valid token!' });
    }
}

module.exports = fetchAdminDetails;