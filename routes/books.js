// const { Router } = require("express");
// const { prisma } = require("./../utils/prisma.js");
// const { Authenticated } = require("./../middlewares/auth.js");
// const fs = require('fs');
// const path = require('path');
// const router = Router();
// const multer = require('multer');
// // settings for filter file type
// const fileFilter = (req, file, callback) => {
//     // Allowed file types
//     const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

//     if (allowedMimeTypes.includes(file.mimetype)) {
//         callback(null, true); // Accept the file
//     } else {
//         callback(null, false); // Reject file
//     }
// };
// // settings for image path and continue after upload
// const storage = multer.diskStorage({
//     destination: function (req, file, callback) {
//         callback(null, './uploads/') // folder ที่เราต้องการเก็บไฟล์
//     },
//     filename: function (req, file, callback) {
//         const mimeType = file.mimetype.split('/');
//         const dn = new Date().getTime() + '.' + mimeType[1]; // Generate new name using unixtimestamps from DateTime
//         callback(null, dn) // folder ที่เราต้องการเก็บไฟล์

//     },
// })
// // After import, create configuration for upload this file
// const upload = multer({
//     storage, // Import config path of uploads
//     fileFilter, // Import config allow file type
//     limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
// })


// router.post("/createbook", Authenticated, upload.single('image'), async (req, res) => {
//     const { bookName, category, price } = req.body;
//     const image = req.file;
//     if (!req.file) {
//         return res.status(400).json({ error: 'Only image files are allowed!' });
//     }
//     if (!bookName) {
//         res.json({
//             success: false,
//             message: "Book name is required!",
//         });
//         return;
//     }
//     if (!category) {
//         res.json({
//             success: false,
//             message: "Category is required!",
//         });
//         return;
//     }
//     if (!price) {
//         res.json({
//             success: false,
//             message: "Price is requied!",
//         });
//         return;
//     }

//     const findBook = await prisma.book.findFirst({
//         where: { bookName },
//     });
//     if (findBook) {
//         res.json({
//             success: false,
//             message: "Book already exist!",
//         });
//         return;
//     }
//     // บันทึกข้อมูลใน model book
//     const createBook = await prisma.book.create({
//         data: {
//             bookName,
//             bookImage: image.filename,
//             category,
//             price,
//             user: {
//                 connect: {
//                     id: req.user.id,
//                 },
//             },
//         },
//     });
//     if (createBook) {
//         res.json({
//             success: true,
//             message: "Create Book Successfully!",
//         });
//         return;
//     }
// });
// // ---------------------------UPDATE BOOK------------------------------
// router.put("/updatebook", Authenticated, upload.single('image'), async (req, res) => {
//     const { bookName, category, price } = req.body;
//     const id = Number(req.body.id);

//     if (!id) {
//         return res.status(400).json({
//             success: false,
//             message: "Book ID is required!",
//         });
//     }

//     try {
//         const book = await prisma.book.findFirst({
//             where: { id },
//         });

//         if (!book) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Book not found!",
//             });
//         }

//         // Check if the user owns the book
//         if (book.usersId !== req.user.id) {
//             return res.status(403).json({
//                 success: false,
//                 message: "You are not authorized to update this book!",
//             });
//         }

//         let updatedData = {
//             bookName: bookName,
//             category: category,
//             price: price
//         };

//         // Check if the user uploaded a new image
//         if (req.file) {
//             // Delete the old image if exists
//             if (book.bookImage) {
//                 const oldImagePath = path.join(__dirname, './../uploads', book.bookImage);
//                 fs.unlink(oldImagePath, (err) => {
//                     if (err && err.code !== 'ENOENT') { // Ignore file-not-found errors
//                         console.error('Error deleting old image:', err);
//                     } else {
//                         // console.log(err.code);
//                         console.log('Old image deleted:', book.bookImage);
//                     }
//                 });
//             }

//             // Assign new image
//             updatedData.bookImage = req.file.filename;
//         }

//         // Update the book record
//         const updateBook = await prisma.book.update({
//             where: { id },
//             data: updatedData,
//         });

//         if (updateBook) {
//             return res.json({
//                 success: true,
//                 message: "Book updated successfully!",
//                 book: updateBook
//             });
//         }
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: "Something went wrong!",
//             error: error.message,
//         });
//     }
// });


// router.delete("/deletebook/:id", Authenticated, async (req, res) => {
//     const { id } = req.params; // ใช้ req.params แทน req.body

//     if (!id) {
//         return res.status(400).json({
//             success: false,
//             message: "Please provide book ID",
//         });
//     }

//     try {
//         const bookOwnerId = await prisma.book.findUnique({
//             where: { id: Number(id) },
//         });

//         if (!bookOwnerId) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Book not found!"
//             });
//         }

//         if (bookOwnerId.usersId !== req.user.id) {
//             return res.status(403).json({
//                 success: false,
//                 message: "You are not authorized to delete this book!"
//             });
//         }

//         if (bookOwnerId.bookImage) {
//             const deleteImagePath = path.join(__dirname, './../uploads', bookOwnerId.bookImage);
//             fs.unlink(deleteImagePath, (err) => {
//                 if (err && err.code !== 'ENOENT') {
//                     console.error('Error deleting old image:', err);
//                 } else {
//                     console.log('Old image deleted:', bookOwnerId.bookImage);
//                 }
//             });
//         }

//         await prisma.book.delete({
//             where: { id: Number(id) },
//         });

//         res.json({
//             success: true,
//             message: "Delete book successfully!",
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "An error occurred while deleting the book",
//             error: error.message,
//         });
//     }
// });
// router.get('/books', async (req, res) => {
//     const books = await prisma.book.findMany({});
//     res.json({
//         success: true,
//         data: books
//     });
// });
// module.exports = router;
