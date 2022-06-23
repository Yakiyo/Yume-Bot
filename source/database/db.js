const Mongoose = require('mongoose');
const Profile = require('./profile.js');
const History = require('./history.js');

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
        this.history = new History(Mongoose);
    }
}

module.exports = Mongo;