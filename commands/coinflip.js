const mysql = require("mysql");
const database = require("../database.json");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');


module.exports = {

    


	data: new SlashCommandBuilder()
		.setName('coinflip')
		.setDescription('Coinflip game')
		.addIntegerOption(option => option.setName('bet').setDescription('Your bet ammount!')),

	async execute(interaction) {
        var con = mysql.createConnection({
            host: database.host,
            user: database.user,
            password: database.password,
            database: database.database
        });

        con.connect(err =>{
            if(err) throw err;
        });

        function between(min, max) {  
            return Math.floor(
              Math.random() * (max - min) + min
            )
          }

        var users = interaction.user.id;
        var username = interaction.user.username;
        var botdice = between(2,5);
        var userdice = between(2,20);
        const bet = interaction.options.getInteger('bet');
        con.query(`UPDATE economy SET BetUser = "${bet}"WHERE IDUser = "${users}" `);


        const row = new MessageActionRow()
							.addComponents(
								new MessageButton()
									.setCustomId('Playagain')
									.setLabel('Play Again!')
									.setStyle('PRIMARY'),
							);
		
           if (botdice >= userdice) {
            con.query(`SELECT Money FROM economy WHERE IDUser = '${users}'`, (err, rows) =>{
                if(err) throw err;
                if (rows.length > 0){
                    for (let index = 0; index < rows.length; index++) {
                        var money = rows[index].Money;
                        money = money + bet;
                        con.query(`UPDATE economy SET Money = "${money}"WHERE IDUser = "${users}" `);
                        return interaction.reply({content: `You won ${bet}`, ephemeral: true, components: [row] });
    
                    }

                }else{

                    con.query(`INSERT INTO economy (IDUser, Money, Username) VALUES ("${users}","${bet}","${username}") `);
                    return interaction.reply({content: `You won ${bet}`, ephemeral: true, components: [row] })};
                
            });
            
        } else {
            con.query(`SELECT Money FROM economy WHERE IDUser = '${users}'`, (err, rows) =>{
                if(err) throw err;
                if (rows.length > 0){
                    for (let index = 0; index < rows.length; index++) {
                        var money = rows[index].Money;
                        money = money - bet;
                        con.query(`UPDATE economy SET Money = "${money}"WHERE IDUser = "${users}" `);
                        return interaction.reply({content: `You lost ${bet}`, ephemeral: true, components: [row] })
    
                    }

                }else{

                    con.query(`INSERT INTO economy (IDUser, Money, Username) VALUES ("${users}","${bet}","${username}") `);
                    return interaction.reply({content: `You lost ${bet}`, ephemeral: true, components: [row] })};
                
            });
            
        }
        
	},
};
