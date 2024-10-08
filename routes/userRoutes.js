const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:code', authController.resetPassword);
router.patch('/verifyEmail/:code', authController.verifyEmail);

router.use(authController.protect); //all the comming is protected

//must use protect for the comming routes for two reasons , 1) to make sure of the user , 2) and put the info in the req as use
router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser); // we use getMe to get id form req.user.id and put it in req.user.param
router.patch(
    '/updateMe',
    authController.protect,
    userController.updateMe
); /* upload saves the photo and put the info in the req body */
router.delete('/deleteMe', authController.protect, userController.deleteMe);

router.use(authController.restrictTo('admin')); // must be restricted to admin to use the comming routes
router.route('/').get(userController.getAllUsers);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
