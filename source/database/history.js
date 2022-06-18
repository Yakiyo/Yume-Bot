class History {
    constructor(mongoose) {
        this.mongoose = mongoose;
        this.Schema = new mongoose.Schema({
            _id: String,
            bans: Number,
            warns: Number,
            mutes: Number,
            kicks: Number,
        });
        this.model = this.mongoose.model('history', this.Schema);
    }
    async create(id) {
        const val = await this.model.create({
            _id: id,
            bans: 0,
            warns: 0,
            mutes: 0,
            kicks: 0,
        });
        return val;
    }
    async fetch(id) {
        return await this.model.findById(id).exec() || null;
    }
    async update(id, type) {
        let history = await this.fetch(id);
        if (!history) {
            history = await this.create(id);
        }
        switch (type) {
            case 'warn': {
                history.warns += 1;
                await history.save();
                break;
            }
            case 'ban': {
                history.bans += 1;
                await history.save();
                break;
            }
            case 'mute': {
                history.mutes += 1;
                await history.save();
                break;
            }
            case 'kick': {
                history.kicks += 1;
                await history.save();
                break;
            }
            default:
                history = null;
                break;
        }
        return history;
    }
}

module.exports = History;