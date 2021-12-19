const { SlashCommandBuilder } = require('@discordjs/builders');
const mysql = require("mysql");
const database = require("../database.json");
const { MessageEmbed } = require('discord.js');



module.exports = {
    data: new SlashCommandBuilder()
        .setName('matchup')
        .setDescription('Let you select a specific matchup')
     //   .addStringOption(option => option.setName('your').setDescription('Type the name of your champion'))
        .addStringOption(option => option.setName('enemy').setDescription('Type the name of enemy champion')),

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

        const yourchamp = "shen";
        const enemychamp = interaction.options.getString('enemy');

        // Description 


        con.query(`SELECT Description,Difficulty  FROM matchups WHERE YourChamp = '${yourchamp}' AND EnemyChamp = '${enemychamp}' `, (err, rows) => {
            if (err) {interaction.reply({ content: `This matchup dosent exist in our database, sorry!`, ephemeral: true})
        };
            
            if (rows.length > 0) {
                for (let index = 0; index < rows.length; index++) {
                    var Description = rows[index].Description;
                    var Difficulty = rows[index].Difficulty;

                    // embed 
                    const exampleEmbed = new MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('Matchup!')
                        .setDescription('Matchups guide by iONUT op.gg - https://eune.op.gg/summoner/userName=Reyyαn) & Colosalu - op.gg https://eune.op.gg/summoner/userName=colosalu')
                        .addField(`${yourchamp} vs ${enemychamp} `, `${Description}`)
                        .addField(`** Difficulty level ** `, `${Difficulty}`)

                        .setTimestamp()
                        .setFooter('Bot created by Raducu');

                    return interaction.reply({ embeds: [exampleEmbed], ephemeral: true });
                }

            }

        });

    },
};
