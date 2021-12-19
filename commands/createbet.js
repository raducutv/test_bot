const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('newbet')
		.setDescription('Create a new bet!')
        .addStringOption(option => option.setName('title').setDescription('Enter the bet title.'))
        .addStringOption(option => option.setName('bet1').setDescription('Enter the first bet option.'))
        .addStringOption(option => option.setName('bet2').setDescription('Enter the second bet option.')),

                


	async execute(interaction) {
        const title = interaction.options.getString('title');
        const bet1 = interaction.options.getString('bet1');
        const bet2 = interaction.options.getString('bet2');
        const exampleEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`${title}`)
        .setURL('https://discord.js.org/')
        .setDescription('You can bet using **bet**')
        .addFields(
            { name: 'Bet options are', value: '***Dont forget to place a betting ammount!*** ' },
            { name: '\u200B', value: '\u200B' },
            { name: `${bet1}`, value: `/bet ${bet1} <ammount>`, inline: true },
            { name: `${bet2}`, value: `/bet ${bet2} <ammount>`, inline: true },
        )
        .setTimestamp()





		return interaction.reply({ embeds: [exampleEmbed], ephemeral: true });
	},

};
