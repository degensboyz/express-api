const express = require("express");
const config = require("./config.js");
const { prisma } = require("./utils/prisma.js");
const jwt = require("./utils/jwt.js");
const bcrypt = require("bcryptjs");
const app = express();
// json to object
app.use(express.raw());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// ------------------login-------------------------------------------------------
app.post("/login", async (req, res) => {
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
  const token = jwt.encode(username, findUser.id);
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
app.post("/register", async (req, res) => {
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
// =====================HOMEWORK=================================
// -----------------CREATE BOOK-----------------------------------
app.post("/createbook", async (req, res) => {
  const { bookName, category, price } = req.body;
  if (!bookName) {
    res.json({
      success: false,
      message: "Book name is required!",
    });
    return;
  }
  if (!category) {
    res.json({
      success: false,
      message: "Category is required!",
    });
    return;
  }
  if (!price) {
    res.json({
      success: false,
      message: "Price is requied!",
    });
    return;
  }
  const findBook = await prisma.book.findFirst({
    where: { bookName },
  });
  if (findBook) {
    res.json({
      success: false,
      message: "Book already exist!",
    });
    return;
  }
  // บันทึกข้อมูลใน model book
  const createBook = await prisma.book.create({
    data: {
      bookName,
      category,
      price,
    }
  });
  if (createBook) {
    res.json({
      success: true,
      message: "Create Book Successfully!",
    });
    return;
  }
});
// ---------------------------UPDATE BOOK------------------------------
app.put("/updatebook", async (req, res) => {
  const { id, bookName, category, price } = req.body;
  if (!id) {
    res.json({
      success: false,
      message: "Book ID is required!"
    });
  }
  const updateBook = await prisma.book.update({
    where: { id },
    data: {
      bookName,
      category,
      price,
    }
  });
  if (updateBook) {
    res.json({
      success: true,
      message: "Update Book Successfully!",
    });
    return;
  }
});

app.listen(config.PORT, () => {
  console.log(`Application started on http://localhost:${config.PORT}`);
});
