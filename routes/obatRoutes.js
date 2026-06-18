const express = require('express');
const router = express.Router();
const obatController = require('../controllers/obatController');

router.get('/', obatController.getAll);
router.get('/:id', obatController.getById);
router.post('/', obatController.create);
router.put('/:id', obatController.update);
router.delete('/:id', obatController.delete);

module.exports = router;
