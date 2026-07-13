const express = require('express');
const router = express.Router();
const { getUsers, updateUser, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../constants/roles');

router.use(protect, authorize(ROLES.ADMIN));

router.get('/', getUsers);
router.route('/:id').put(updateUser).delete(deleteUser);

module.exports = router;
