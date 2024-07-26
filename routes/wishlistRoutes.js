const express = require('express');

const authController = require('../controllers/authController');
const wishlistController = require('../controllers/wishlistController');

const router = express.Router();

router.use(authController.protect);

router
    .route('/')
    .get(wishlistController.getMyWishlist)
    .post(wishlistController.addToMyWishlist);

router.route('/:houseId').delete(wishlistController.removeFromMyWishlist);

router.route('/').get(wishlistController.getAllWishlists);

module.exports = router;
