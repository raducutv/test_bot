const mysql = require("mysql");
const database = require("../database.json");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {

    


	data: new SlashCommandBuilder()
		.setName('bal')
		.setDescription('Your ballance.'),

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

        var appuserid = interaction.user.id;

        //databbase querry

        con.query(`SELECT Money FROM economy WHERE IDUser = '${appuserid}'`, (err, rows) =>{
            if(err) throw err;
            console.log(rows.length);
            if (rows.length > 0){
                for (let index = 0; index < rows.length; index++) {
                    const money = rows[index];
                    
                    return interaction.reply(`You have ${money.Money}`)

                }
            }else{
                return interaction.reply(`You dont have money!`)
            };
            
        });

        
	},
};
