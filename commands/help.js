const { prefix } = require('../config.json');

module.exports = {
    name: 'help',
    description: 'List all commands or info about one.',
    aliases: ['commands'],
    usage: '[command]',
    cooldown: 1,
    execute(message, args) {
        const data = [];
        const { commands } = message.client;

        if (!args.length) {
            data.push('\u200bHere\'s a list of all commands:');
            data.push(`\u200b${commands.map(command => command.name).join(', ')}`);
            data.push(`\u200b\nUse \`${prefix}help [command]\` to get info about one.`);

            return message.author.send(data, { split: true })
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('\u200bI\'ve sent a DM with all commands.');
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply('\u200bI can\'t DM you. Lmao do you have DMs disabled?');
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('\u200bidiot, that\'s not a command.');
        }

        data.push(`\u200b**Name:** ${command.name}`);

        if (command.aliases) data.push(`\u200b**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`\u200b**Description:** ${command.description}`);
        if (command.usage) data.push(`\u200b**Usage:** \`${prefix}${command.name} ${command.usage}\``);

        data.push(`\u200b**Cooldown:** ${command.cooldown || 1} second(s)`);

        message.author.send(data, { split: true })
        .then(() => {
            if (message.channel.type === 'dm') return;
            message.reply('\u200bI\'ve sent a DM with info about the command.');
        })
        .catch(error => {
            console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
            message.reply('\u200bI can\'t DM you. Lmao do you have DMs disabled?');
        });
    },
};