const { Client, Collection,  GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.commands = new Collection();
const commandPath = path.join(__dirname, 'commands');
const commandFile = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'))

for(const file of commandFile){
    const filePath = path.join(commandPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command)
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});




client.login(token);