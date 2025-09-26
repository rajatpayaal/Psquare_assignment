const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;