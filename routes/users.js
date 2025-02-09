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
  const findUser = await prisma.users.findFirst({
    where: { username },
  });
  console.log(findUser);
  if (!findUser) {
    res.json({
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

  const token = generateToken({ id: findUser.id, username });
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
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
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
  console.log({
    user: req.user,
  });
  res.json({
    success: true,
  });
});

module.exports = router;
