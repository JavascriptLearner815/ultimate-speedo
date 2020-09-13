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
            data.push('Here\'s a list of all commands:');
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\nUse \`${prefix}help [command]\` to get info about one.`);

            return message.author.send(data, { split: true })
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('I\'ve sent a DM with all commands.');
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply('I can\'t DM you. Lmao do you have DMs disabled?');
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('idiot, that\'s not a command.');
        }

        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** \`${prefix}${command.name} ${command.usage}\``);

        data.push(`**Cooldown:** ${command.cooldown || 1} second(s)`);

        message.author.send(data, { split: true })
        .then(() => {
            if (message.channel.type === 'dm') return;
            message.reply('I\'ve sent a DM with info about the command.');
        })
        .catch(error => {
            console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
            message.reply('I can\'t DM you. Lmao do you have DMs disabled?');
        });
    },
};