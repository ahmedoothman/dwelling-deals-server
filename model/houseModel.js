const mongoose = require('mongoose');
const { Schema } = mongoose;

const houseSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        type: { type: String, enum: ['rent', 'sale'], required: true },
        realtor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        imageUrl: { type: String },
        address: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            governorate: { type: String, required: true },
        },
        approved: { type: Boolean, default: false },
    },
    { timestamps: true }
);
houseSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'realtor',
        select: 'name email phoneNumber', // Select fields to populate
    });
    next();
});

module.exports = mongoose.model('House', houseSchema);
