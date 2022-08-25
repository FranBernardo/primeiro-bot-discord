const { SlashCommandBuilder } =  require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('eu')
    .setDescription('jogo with pong!'),
    async execute(interaction) {
        await interaction.reply('te amo')
    }
}