const { speedoID } = require('../config.json');

module.exports = {
    name: 'reload',
    description: 'Reload a command.',
    aliases: ['refresh'],
    args: true,
    usage: '<command>',
    cooldown: 0,
    execute(message, args) {
        if (message.author.id === speedoID) {
            const commandName = args[0].toLowerCase();
            const command = message.client.commands.get(commandName)
                || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    
            if (!command) return message.channel.send(`Lmfao there is no command with name or alias \`${commandName}\`.`);

            delete require.cache[require.resolve(`./${command.name}.js`)];

            try {
                const newCommand = require(`./${command.name}.js`);
                message.client.commands.set(newCommand.name, newCommand);
            } catch (error) {
                console.error('Error reloading command:', error);
                message.reply(`oof, error reloading command \`${command.name}\`:\n\`${error.message}\`.`);
            } finally {
                message.channel.send(`Command \`${command.name}\` was successfully reloaded!`);
            }
        } else {
            return message.reply('hey dummy you aren\'t the owner of this bot!');
        }
    },
};