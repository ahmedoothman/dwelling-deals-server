const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wishlistSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    houses: [{ type: Schema.Types.ObjectId, ref: 'House' }],
});

wishlistSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'houses',
        select: 'title description price type rate address',
    });
    next();
});
module.exports = mongoose.model('Wishlist', wishlistSchema);
