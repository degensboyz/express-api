const { Router } = require("express");
const { Authenticated } = require("../middlewares/auth");
const { prisma } = require("../utils/prisma");
const router = Router();

router.get("/buy", Authenticated, async (req, res) => {
    const { user } = req;
    const transactions = await prisma.transaction_buy_product.findMany({
        where: {
            userId: user.id
        },
        include: {
            product: true
        }
    });
    res.json({
        success: true,
        data: transactions
    });
});
module.exports = router;