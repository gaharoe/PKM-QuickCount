const jwt = require("jsonwebtoken");

function verifyTPSAuth(req, res, next) {
    const token = req.cookies.tpsToken;
    if (!token) {
        return res.redirect("/login");
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.tpsID = decoded.tpsID;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
}

function verifyAdminAuth(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect("/admin/login");
    }
    try {
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // req.user = decoded.user;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

}
module.exports = {verifyAdminAuth ,verifyTPSAuth};