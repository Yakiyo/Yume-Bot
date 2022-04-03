module.exports = {
    name: 'threadCreate',
    async execute(thread) {
        if (!thread.joinable) return;
        try {
            return await thread.join();
        } catch (error) {
            return console.log(`Could not join thead ${thread.name} \n\n\n ${error}`);
        }
    },
};