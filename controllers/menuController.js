const Menu = require('../models/menu');
const CircularJSON = require('circular-json');
const Chef = require('../models/chef');

// Create a new menu
// exports.createMenu = async (req, res) => {
//   try {
//     const { chefId, type, platEntrer, platPrincipal, dessert, date } = req.body;
//     const menu = await Menu.create({
//       chef: chefId,
//       type,
//       platEntrer,
//       platPrincipal,
//       dessert,
//       date,
//     });
//     res.json({ menu });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

exports.createMenu = async (req, res) => {
  try {
    const { chefId, type, platEntrer, platPrincipal, dessert, date } = req.body;

    // Vérifier s'il y a déjà un menu pour cette date
    const existingMenu = await Menu.findOne({
      date,
      type,
    });

    if (existingMenu) {
      // S'il y a déjà un menu pour cette date et ce type, retourner une erreur
      return res.status(400).json({ message: 'Il existe déjà un menu de même type pour cette date.' });
    } else {
      // Sinon, créer un nouveau menu avec le type correct (déjeuner ou dîner)
      const menu = await Menu.create({
        chef: chefId,
        type,
        platEntrer,
        platPrincipal,
        dessert,
        date,
      });
      res.json({ menu });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




exports.getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find().populate('chef', 'lastname');
    res.send({ menus });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update an existing menu
exports.updateMenu = async (req, res) => {
  try {
    const { chefId, type, platEntrer, platPrincipal, dessert, date } = req.body;
    const menu = await Menu.findByIdAndUpdate(
      req.params.id,
      {
        chef: chefId,
        type,
        platEntrer,
        platPrincipal,
        dessert,
        date,
      },
      { new: true }
    );
    res.json({ menu });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a menu
exports.deleteMenu = async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: 'Menu deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
