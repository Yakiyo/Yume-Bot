const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const Profile = require('./profile.js');

class Database {
    constructor() {
        this._connected = false;
        this.connect();
        this.prisma = prisma;
        this.profile = new Profile();
    }
    /**
     * Connects to the database
     * @private
     * @returns void
     */
    async connect() {
        if (this._connected) {
            console.log('Connection already established');
            return;
        } else {
            await prisma.$connect();
            this._connected = true;
            console.log('Successfully connected to the database');
            return;
        }
    }
}

module.exports = new Database();