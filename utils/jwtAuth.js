const jwt = require("jsonwebtoken");

function verifyTPSAuth(req, res, next) {
    const token = req.cookies.tps_auth;
    if (!token) {
        return res.redirect("/TPS");
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.tpsID = decoded.tpsID;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
}

module.exports = verifyTPSAuth;