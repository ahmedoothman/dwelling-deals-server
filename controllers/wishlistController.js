const Wishlist = require('../model/wishlistModel');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
exports.getAllWishlists = factory.getAll(Wishlist);
exports.getWishlist = factory.getOne(Wishlist);

exports.updateWishlist = factory.updateOne(Wishlist);
exports.deleteWishlist = factory.deleteOne(Wishlist);

exports.createWishlist = factory.createOne(Wishlist);

exports.addToMyWishlist = catchAsync(async (req, res, next) => {
    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
        wishlist = await Wishlist.create({
            user: req.user.id,
            houses: [req.body.houseId],
        });
    } else {
        wishlist.houses.push(req.body.houseId);
        await wishlist.save();
    }
    res.status(201).json({
        status: 'success',
        data: wishlist,
    });
});

exports.getMyWishlist = catchAsync(async (req, res, next) => {
    const wishlist = await Wishlist.findOne({ user: req.user.id });

    res.status(200).json({
        status: 'success',
        data: wishlist,
    });
});

exports.removeFromMyWishlist = catchAsync(async (req, res, next) => {
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
        return next(new AppError('No wishlist found with that ID', 404));
    }
    wishlist.houses = wishlist.houses.filter((house) => {
        return house._id.toString() !== req.params.houseId;
    });

    console.log(wishlist.houses);
    await wishlist.save();

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
