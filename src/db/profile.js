const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { xp } = require('../config.json');

/**
 * Represents a user model
 * @typedef {Object} User
 * @property {string} id
 * @property {number} xp
 * @property {string} tagline
 * @property {Date} updatedAt
 */

class Profile {
    constructor() {
        return;
    }

    /**
     * Create's a new User instance
     * @param {string} id
     * @returns User
     */
    async create(id) {
        if (!id || typeof id !== 'string') throw new Error('Param id is either missing or is not a string');
        return await prisma.user.create({
            data: {
                userId: id,
            },
        });
    }

    /**
     * Find's a User object
     * @param {string} id
     * @returns User
     */
    async find(id) {
        return await prisma.user.findUnique({
            where: {
                userId: id,
            },
        }) || null;
    }

    /**
     * Increment's a user's xp
     * @param {string} id
     * @returns User
     */
    async increment(id) {
        return await prisma.user.upsert({
            where: {
                userId: id
            },
            update: {
                xp: {
                    increment: Math.floor(Math.random() * (xp.max - xp.min) + xp.min),
                }
            },
            create: {
                userId: id,
            }
        });
    }
}

module.export = Profile;