const Mongoose = require('mongoose');
const { Schema, model } = Mongoose;
require('dotenv').config();

Mongoose.connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const profileSchema = new Schema({
    _id: String,
    xp: Number,
});

const profileModel = model('profiles', profileSchema);

const profiles = {
    model: profileModel,
    async getProfile(id) {
        const profile = await profileModel.findById(id, function (err, value) {
            if (err) return null;
            return value;
        });
        return profile;
    },
};

const mongoose = {
    profiles: profiles,
};

module.exports = mongoose;
