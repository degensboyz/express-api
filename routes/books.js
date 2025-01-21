const { Router } = require("express");
const { prisma } = require("./../utils/prisma.js");
const { Authenticated } = require("./../middlewares/auth.js");

const router = Router();
router.post("/createbook", Authenticated, async (req, res) => {
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
      user: {
        connect: {
          id: req.user.id,
        },
      },
    },
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
router.put("/updatebook", async (req, res) => {
  const { id, bookName, category, price } = req.body;
  if (!id) {
    res.json({
      success: false,
      message: "Book ID is required!",
    });
  }
  const updateBook = await prisma.book.update({
    where: { id },
    data: {
      bookName,
      category,
      price,
    },
  });
  if (updateBook) {
    res.json({
      success: true,
      message: "Update Book Successfully!",
    });
    return;
  }
});

router.delete("/deletebook", async (req, res) => {
  const { id, bookName } = req.body;
  if (!id || !bookName) {
    res.json({
      success: false,
      message: "Please field id or book name!",
    });
    return;
  }
  try {
    const deleteBook = await prisma.book.delete({
      where: { id, bookName },
    });
    if (deleteBook) {
      res.json({
        success: true,
        message: "Delete book successfully!",
      });
    }
  } catch (error) {
    if (error) {
      res.status(404).json({
        success: false,
        message: "Id or Book name doesn't exist",
        error: error.message,
      });
    }
  }
});
