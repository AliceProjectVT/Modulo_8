const { Router } = require('express');
const bootcampController = require('../controllers/bootcamp.controller');
const router = Router();

router
    .post('/bootcamps', bootcampController.createBootcamp)
    .get('/bootcamps', bootcampController.findAll)
    .get('/bootcamps/:id', bootcampController.findById)
    .put('/bootcamps/:id', bootcampController.updateBootcampById)
    .delete('/bootcamps/:id', bootcampController.deleteBootcampById);

module.exports = router;