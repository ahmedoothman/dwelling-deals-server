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
        images: [{ type: String }],
        rate: { type: Number, min: 0, max: 5 },
        bedrooms: { type: Number, required: true },
        bathrooms: { type: Number, required: true },
        area: { type: Number, required: true },
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
