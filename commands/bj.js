const mysql = require("mysql");
const database = require("../database.json");
const { SlashCommandBuilder, Embed } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');


module.exports = {




    data: new SlashCommandBuilder()
        .setName('blackjask')
        .setDescription('Blackjack game')
        .addIntegerOption(option => option.setName('bet').setDescription('Your bet ammount!')),

    async execute(interaction) {
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
        var botdice = between(2, 20);
        var userdice = between(2, 20);
        const bet = interaction.options.getInteger('bet');

        const exampleEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Blackjack')
            .setDescription('You have to hit 21.')
            .setThumbnail('https://i.imgur.com/AfFp7pu.png')
            .addFields(
                { name: 'Your hand', value: `${botdice}`, inline: true },
                { name: 'Dealer hand', value: `${userdice}`, inline: true },
            )
            .setTimestamp()


        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('hit')
                    .setLabel('Hit')
                    .setStyle('PRIMARY'),
            );

        return interaction.reply({ content: 'Pong!', ephemeral: true, embeds: [exampleEmbed], components: [row] });


        if (botdice >= userdice) {
            con.query(`SELECT Money FROM economy WHERE IDUser = '${users}'`, (err, rows) => {
                if (err) throw err;
                if (rows.length > 0) {
                    for (let index = 0; index < rows.length; index++) {
                        var money = rows[index].Money;
                        money = money + bet;
                        con.query(`UPDATE economy SET Money = "${money}"WHERE IDUser = "${users}" `);
                        return interaction.reply(`You won ${bet}`)

                    }

                } else {

                    con.query(`INSERT INTO economy (IDUser, Money, Username) VALUES ("${users}","${bet}","${username}") `);
                    return interaction.reply(`You won ${bet}`)
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
                        return interaction.reply(`You lost ${bet}`)

                    }

                } else {

                    con.query(`INSERT INTO economy (IDUser, Money, Username) VALUES ("${users}","${bet}","${username}") `);
                    return interaction.reply(`You lost ${bet}`)
                };

            });

        }

    },
};
