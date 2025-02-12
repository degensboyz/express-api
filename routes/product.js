const { Router } = require("express");
const { prisma } = require("./../utils/prisma.js");
const router = Router();

router.get("/category", async (req, res) => {
    const category = await prisma.category.findMany();
    res.json({
        success: true,
        message: "Category fetched successfully",
        data: category
    });
});

router.get("/product", async (req, res) => {
    const product = await prisma.product.findMany();
    res.json({
        success: true,
        message: "Product fetched successfully",
        data: product
    });
});

router.get("/sub/:id", async (req, res) => {
    const product = await prisma.subProduct.findMany({
        where: {
            productId: Number(req.params.id)
        }
    });
    res.json({
        success: true,
        message: "SubProduct fetched successfully",
        data: product
    });
});

router.get('/stock/:id', async (req, res) => {
    const stock = await prisma.subProductStock.findMany({
        where: {
            subProductId: req.params.id,
            status: 'PENDING'
        }
    });
    res.json({
        success: true,
        message: "Stock fetched successfully",
        data: stock
    });
});


router.post("/addCategory", async (req, res) => {
    const { name } = req.body;
    try {
        const category = await prisma.category.create({
            data: { name }
        });
        res.json({
            success: true,
            message: "Category added successfully",
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error adding category",
            error: error.message
        });
    }
});

router.post("/addProduct", async (req, res) => {
    const { name, image, description, price, categoryId } = req.body;
    try {
        const product = await prisma.product.create({
            data: { name, image, description, price, categoryId }
        });
        res.json({
            success: true,
            message: "Product added successfully",
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error adding product",
            error: error.message
        });
    }
});

router.post("/addSubProduct", async (req, res) => {
    const { productId, name, price } = req.body;
    try {
        const subProduct = await prisma.subProduct.create({
            data: { productId, name, price }
        });
        res.json({
            success: true,
            message: "SubProduct added successfully",
            data: subProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error adding subProduct",
            error: error.message
        });
    }
});

router.post("/addProductStock", async (req, res) => {
    const { subProductId, data, status } = req.body;
    try {
        const stock = await prisma.subProductStock.create({
            data: { subProductId, data, status }
        });
        res.json({
            success: true,
            message: "Product stock added successfully",
            data: stock
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error adding product stock",
            error: error.message
        });
    }
});
module.exports = router;

