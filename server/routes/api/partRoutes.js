const { Router } = require('express');
const partsController = require('../../controllers/partsControllers');
const { verifyUser, checkGuest } = require('../../middleware/authMiddleware');

const router = Router();

// /api/parts...

// auth middleware
router.use(verifyUser);

// Get all part data
router.get('/', partsController.parts_all_get);

// Get specific part
router.get('/:id', partsController.part_get);

// Add a new part
router.post('/', checkGuest, partsController.part_post);

// Update part data
router.put('/', checkGuest, partsController.part_put);

// Remove item
router.delete('/:id', checkGuest, partsController.part_delete);

router.all((req, res) => {
    res.sendStatus(404);
});


module.exports = router;