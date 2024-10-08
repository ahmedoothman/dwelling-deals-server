const express = require('express');

const authController = require('../controllers/authController');
const houseController = require('../controllers/houseController');
const multerConfig = require('../utils/multerConfig');
const router = express.Router();

router.route('/').get(houseController.getAllHouses);
router.route('/:id').get(houseController.getHouse);
router.use(authController.protect);

router.use(authController.restrictTo('realtor', 'admin'));
router
    .route('/myhouses/realtor')
    .get(houseController.getMyHouses)
    .post(
        multerConfig.uploadHouseImages,
        multerConfig.resizeAndUploadImages,
        houseController.addToMyHouse
    );

router
    .route('/myhouses/:id')
    .patch(
        multerConfig.uploadHouseImages,
        multerConfig.resizeAndUploadImages,
        houseController.updateMyHouse
    );
router.route('/myhouses/:id').delete(houseController.deleteMyHouse);

router.use((req, res, next) => {
    console.log('house routes');
    next();
}, authController.restrictTo('admin'));
router.route('/').post(houseController.createHouse);
router.patch('/admin/approve/:id', houseController.approveHouse);
router.route('/:id').patch(houseController.updateHouse);
router.route('/:id').delete(houseController.deleteHouse);

module.exports = router;
