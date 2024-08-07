const House = require('../model/houseModel');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllHouses = factory.getAll(House);
exports.getHouse = factory.getOne(House);

exports.updateHouse = factory.updateOne(House);

exports.deleteHouse = factory.deleteOne(House);

exports.createHouse = factory.createOne(House);

exports.addToMyHouse = catchAsync(async (req, res, next) => {
    req.body.realtor = req.user.id;
    const house = await House.create(req.body);

    res.status(201).json({
        status: 'success',
        data: house,
    });
});
exports.getMyHouses = catchAsync(async (req, res, next) => {
    const houses = await House.find({ realtor: req.user._id });

    res.status(200).json({
        status: 'success',
        results: houses.length,
        data: houses,
    });
});
exports.updateMyHouse = catchAsync(async (req, res, next) => {
    // search for the house by id and the realtor
    const house = await House.findOneAndUpdate(
        { _id: req.params.id, realtor: req.user.id },
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );
    if (!house) {
        return next(new AppError('No house found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: house,
    });
});

exports.deleteMyHouse = catchAsync(async (req, res, next) => {
    const house = await House.findOneAndDelete({
        _id: req.params.id,
        realtor: req.user.id,
    });

    if (!house) {
        return next(new AppError('No house found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

exports.approveHouse = catchAsync(async (req, res, next) => {
    const house = await House.findByIdAndUpdate(req.params.id, {
        approved: true,
    });

    if (!house) {
        return next(new AppError('No house found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: house,
        },
    });
});
