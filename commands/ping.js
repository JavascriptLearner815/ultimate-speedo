module.exports = {
    name: 'ping',
    description: 'Get the bot\'s current websocket connection ping.',
    aliases: ['latency'],
    cooldown: 10,
    execute(message, args) {
        message.channel.send(`:ping_pong: Pong! ${message.client.ws.ping}ms.`);
    },
};