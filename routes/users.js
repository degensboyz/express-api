const { Router } = require("express");
const { prisma } = require("./../utils/prisma.js");
const { generateToken } = require("./../utils/jwt.js");
const bcrypt = require("bcryptjs");
const { Authenticated } = require("./../middlewares/auth.js");

const router = Router();
// ------------------login-------------------------------------------------------
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username) {
    res.status(400).json({
      success: false,
      message: "Username is required.",
    });
    return;
  }
  if (!password) {
    res.json({
      success: false,
      message: "Password is required.",
    });
    return;
  }
  const findUser = await prisma.users.findFirst({
    where: { username },
  });
  // console.log(findUser);
  if (!findUser) {
    res.status(400).json({
      success: false,
      message: "Username is not exists.",
    });
    return;
  }
  const checkPassword = await bcrypt.compare(password, findUser.password);
  if (!checkPassword) {
    res.json({ 
      success: false,
      message: "Password is invalid.",
    });
    return;
  }

  const token = generateToken({ id: findUser.id, username, role: 'USER' });
  res.cookie('accessToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,

  })
  res.json({
    success: true,
    message: "Logged in successfully.",
    data: {
      id: findUser.id,
      username,
      token,
    },
  });
  return;
});
// ---------register---------------------------------------------------------------------
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username) {
    res.json({
      success: false,
      message: "Username is required.",
    });
    return;
  }
  if (!password) {
    res.json({
      success: false,
      message: "Password is required.",
    });
    return;
  }
  //check username is already use or not
  const findUser = await prisma.users.findFirst({
    where: { username },
  });
  console.log(findUser);
  if (findUser) {
    res.json({
      success: false,
      message: "Username is already exists.",
    });
    return;
  }
  //create user data
  const hashedPassword = await bcrypt.hash(password, 10);
  const createUser = await prisma.users.create({
    data: {
      username,
      password: hashedPassword,
    },
  });
  if (createUser) {
    res.json({
      success: true,
      message: "Register Successfully.",
    });
    return;
  }
});
// Middleware Function
// What is middleware

router.get("/me", Authenticated, (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user.username
    }
  });
});

router.post('/change-password', Authenticated, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = req.user;
  const findUser = await prisma.users.findUnique({
    where: { id: user.id }
  });
  if (!findUser) {
    res.json({
      success: false,
      message: "ไม่พบบัญชีผู้ใช้งาน"
    });
    return;
  }
  const checkPassword = await bcrypt.compare(oldPassword, findUser.password);
  if (!checkPassword) {
    res.json({
      success: false,
      message: "รหัสผ่านเดิมไม่ถูกต้อง"
    });
    return;
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const updateUser = await prisma.users.update({
    where: { id: user.id },
    data: { password: hashedPassword }
  });
  if (updateUser) {
    res.json({
      success: true,
      message: "รหัสผ่านถูกเปลี่ยนเรียบร้อย"
    });
    return;
  }
  
});

module.exports = router;