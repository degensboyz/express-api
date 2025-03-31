const { Router } = require("express");
const bcrypt = require("bcryptjs");
const router = Router();
const jwt = require("./../utils/jwt.js");
const { prisma } = require("./../utils/prisma.js");
const { AuthenticatedAdmin } = require("./../middlewares/admin-auth.js");


router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
    }
    const admin = await prisma.adminAccount.findUnique({
        where: {
            username: username
        }
    });
    if (!admin) {
        return res.status(400).json({ success: false, message: "Admin not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
        return res.status(400).json({ success: false, message: "Invalid password" });
    }
    const token = jwt.generateToken({ id: admin.id, username: admin.username, role: admin.role });
    res.json({
        success: true,
        message: "Login successful",
        data: {
            username: admin.username,
            role: admin.role,
            token: token
        }
    });
});
router.get("/me", AuthenticatedAdmin, (req, res) => {
    res.json({
        success: true,
        data: {
            user: req.user.username
        }
    });
});

module.exports = router;