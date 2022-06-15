const Mongoose = require('mongoose');
const Profile = require('./profile.js');

class Mongo {
    /**
     * Constructor function. Connects to the db
     * @param {MongoURI} url
     */
    constructor(url) {
        Mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        this.mongoose = Mongoose;
        this.profile = new Profile(Mongoose);
    }
}
/*

const history = {
    model: model('history', new Schema({
        _id: String,
        bans: Number,
        warns: Number,
        mutes: Number,
        kicks: Number,
    })),
};
*/
module.exports = Mongo;