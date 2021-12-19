const mysql = require("mysql");
const database = require("../database.json");
const { SlashCommandBuilder, Embed } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');

//embeds
//embed flipcoin


module.exports = {
	name: 'interactionCreate',
	execute(interaction) {

		if (interaction.isButton()) {
			if (interaction.customId === "hit") {
				var con = mysql.createConnection({
					host: database.host,
					user: database.user,
					password: database.password,
					database: database.database
				});

				con.connect(err => {
					if (err) throw err;
				});

				function between(min, max) {
					return Math.floor(
						Math.random() * (max - min) + min
					)
				}

				var users = interaction.user.id;
				var username = interaction.user.username;
				var botdice = between(2, 10);
				var userdice = between(2, 10);

				while (userdice > 21) {
					var botdice = between(2, 10);
					var userdice = between(2, 10);

					const exampleEmbed = new MessageEmbed()
						.setColor('#0099ff')
						.setTitle('Blackjack')
						.setDescription('You have to hit 21.')
						.setThumbnail('https://i.imgur.com/AfFp7pu.png')
						.addFields(
							{ name: 'Your hand', value: `${userdice}`, inline: true },
							{ name: 'Dealer hand', value: `${botdice}`, inline: true },
						)
						.setTimestamp()


					const row = new MessageActionRow()
						.addComponents(
							new MessageButton()
								.setCustomId('hit')
								.setLabel('Hit')
								.setStyle('PRIMARY'),
						);

					return interaction.reply({ ephemeral: true, embeds: [exampleEmbed], components: [row] });
				}

			}

			// coinfilp
			if (interaction.customId === "Playagain") {
				var con = mysql.createConnection({
					host: database.host,
					user: database.user,
					password: database.password,
					database: database.database
				});

				con.connect(err => {
					if (err) throw err;
				});

				function between(min, max) {
					return Math.floor(
						Math.random() * (max - min) + min
					)
				}

				var users = interaction.user.id;
				var botdice = between(2, 20);
				var userdice = between(2, 20);
				var bet = 10;
				// get bet user
				con.query(`SELECT BetUser FROM economy WHERE IDUser = '${users}'`, (err, rows) => {
					if (err) throw err;
					if (rows.length > 0) {
						for (let index = 0; index < rows.length; index++) {
							var betuser = rows[index].BetUser;
							bet = betuser;
						}

					}

				});

				const row = new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setCustomId('Playagain')
							.setLabel('Play Again!')
							.setStyle('PRIMARY'),
					);

				if (botdice >= userdice) {
					con.query(`SELECT Money FROM economy WHERE IDUser = '${users}'`, (err, rows) => {
						if (err) throw err;
						if (rows.length > 0) {
							for (let index = 0; index < rows.length; index++) {
								var money = rows[index].Money;
								money = money + bet;
								con.query(`UPDATE economy SET Money = "${money}"WHERE IDUser = "${users}" `);
								return interaction.reply({ content: `You won ${bet}`, ephemeral: true, components: [row] });

							}

						} else {

							con.query(`INSERT INTO economy (IDUser, Money, Username) VALUES ("${users}","${bet}","${username}") `);
							return interaction.reply({ content: `You won ${bet}`, ephemeral: true, components: [row] })
						};

					});

				} else {
					con.query(`SELECT Money FROM economy WHERE IDUser = '${users}'`, (err, rows) => {
						if (err) throw err;
						if (rows.length > 0) {
							for (let index = 0; index < rows.length; index++) {
								var money = rows[index].Money;
								money = money - bet;
								con.query(`UPDATE economy SET Money = "${money}"WHERE IDUser = "${users}" `);
								return interaction.reply({ content: `You lost ${bet}`, ephemeral: true, components: [row] })

							}

						} else {

							con.query(`INSERT INTO economy (IDUser, Money, Username) VALUES ("${users}","${bet}","${username}") `);

							return interaction.reply({ content: `You lost ${bet}`, ephemeral: true, components: [row] })
						};

					});

				}
			}

		}
	},

};
