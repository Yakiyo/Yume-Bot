class Profile {
    /**
     * Creates schemas and models and other stuff from the base mongoose class
     * @param {Mongoose} mongoose
     */
    constructor(mongoose) {
        this.mongoose = mongoose;
        this.Schema = new mongoose.Schema({
            _id: String,
            xp: Number,
        });
        this.model = this.mongoose.model('profiles', this.Schema);
    }
    /**
     * Create's a profile document
     * @param {string} id
     */
    async create(id) {
        if (!id) throw new Error('Parameter ID is required');
        const val = await this.model.create({
            _id: id,
            xp: 0,
        });
        return val;
    }
    /**
     * Fetches a user profile from the database
     * @param {string} id
     */
    async fetch(id) {
        return await this.model.findById(id).exec() || null;
    }
    /**
     * Updates a user profile xp
     * @param {string} id
     * @returns Profile
     */
    async update(id) {
        const profile = await this.fetch(id);
        if (profile) {
            profile.xp += 1;
            await profile.save();
            return profile;
        } else {
            return null;
        }
    }
}

module.exports = Profile;