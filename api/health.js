const express = require('express');
const router = express.Router();

router.get('/health', async (req, res, next) => {
    res.send("server is Healthy");
});

module.exports = router;