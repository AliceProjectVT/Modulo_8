const { Router } = require('express');
const userRoutes = require('./user.routes');
const bootcampRoutes = require('./bootcamp.routes');

const router = Router();

router.use('/api', userRoutes);
router.use('/api', bootcampRoutes);

module.exports = router;