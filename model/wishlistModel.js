const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wishlistSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    houses: [{ type: Schema.Types.ObjectId, ref: 'House', default: [] }],
});

wishlistSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'houses',
    });
    next();
});
module.exports = mongoose.model('Wishlist', wishlistSchema);
