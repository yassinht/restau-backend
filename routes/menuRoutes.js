const express = require('express');
const router = express.Router();
const Menu = require('../models/menu');
const menuController=require('../controllers/menuController')

// Create a new menu
router.post('/',menuController.createMenu );

router.get('/',menuController.getAllMenus);
// Update an existing menu
router.put('/:id', menuController.updateMenu);

// Delete a menu
router.delete('/:id',menuController.deleteMenu);

module.exports = router;
