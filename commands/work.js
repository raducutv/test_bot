const mysql = require("mysql");
const database = require("../database.json");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {

    


	data: new SlashCommandBuilder()
		.setName('work')
		.setDescription('Get free money.'),

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
        var newm = between(10,20);

        con.query(`SELECT Money FROM economy WHERE IDUser = '${users}'`, (err, rows) =>{
            if(err) throw err;
            if (rows.length > 0){
                for (let index = 0; index < rows.length; index++) {
                    var money = rows[index].Money;
                    money = money + newm;
                    console.log(money)
                    con.query(`UPDATE economy SET Money = "${money}"WHERE IDUser = "${users}" `);
                    return interaction.reply(`You got ${newm}`)

                }
            }else{
                con.query(`INSERT INTO economy (IDUser, Money, Username) VALUES ("${users}","${newm}","${username}") `);
                return interaction.reply(`You got ${newm}`)};
            
        });
        

        //databbase insert


        

     
        
	},
};
