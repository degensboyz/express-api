const { Router } = require("express");
const { prisma } = require("./../utils/prisma.js");
const { Authenticated } = require("../middlewares/auth.js");
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

router.get("/product/:id", async (req, res) => {
    const id = req.params.id;
    const product = await prisma.product.findFirst({
        where: {
            id: Number(id)
        },
        include: {
            ProductStock: true
        }
    });
    res.json({
        success: true,
        message: "Product",
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
    const { name, image, price, description, categoryId } = req.body;
    try {
        const product = await prisma.product.create({
            data: { name, price, image, description, categoryId }
        });
        res.json({
            success: true,
            message: "Product added successfully",
            data: product
        });
    } catch (error) {
        console.error(error);
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

router.post("/checkout", Authenticated, async (req, res) => {
    const { productId } = req.body;
    const product = await prisma.product.findFirst({
        where: {
            id: Number(productId)
        }
    });
    if (!product) {
        res.status(400).json({
            success: false,
            message: "Product not found"
        });
        return;
    }
    const user = await prisma.users.findFirst({
        where: {
            id: req.user.id
        }
    });
    if (!user) {
        res.status(400).json({
            success: false,
            message: "User not found"
        });
        return;
    }
    if (user.credit < product.price) {
        res.status(400).json({
            success: false,
            message: "ยอดเงินของคุณไม่เพียงพอ กรุณาเติมเงินแล้วทำรายการใหม่อีกครั้ง"
        });
        return;
    }
    const stockEntry = await prisma.productStock.findFirst({
        where: {
            productId: product.id,
        },
    });

    if (stockEntry) {
        await prisma.productStock.update({
            where: {
                id: stockEntry.id,
            },
            data: {
                stock: {
                    decrement: 1,
                },
            },
        });
    }



    const transaction = await prisma.transactionBuyProduct.create({
        data: {
            productId: product.id,
            userId: user.id,
            price: product.price,
            quantity: 1
        }
    });
    await prisma.users.update({
        where: {
            id: user.id
        },
        data: {
            credit: {
                decrement: product.price
            }
        }
    });
    res.json({
        success: true,
        message: "Checkout successfully",
        data: product
    });
});
module.exports = router;

