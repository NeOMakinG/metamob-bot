const Discord = require("discord.js");
const config = require("./config.json");
const mysql = require('mysql');

const client = new Discord.Client();
const con = mysql.createConnection({
    host: config.DATABASE_HOST,
    user: config.DATABASE_USER,
    password: config.DATABASE_PASSWORD,
    database: config.DATABASE_BASE
});

con.connect(async function(err) {
    if (err) {
        await console.error('error connecting: ' + err.stack);
        return;
    }

    await console.log('connected as id ' + con.threadId);
});

const prefix = "!!";

client.on("message", function(message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    if (command === "ping") {
        message.reply(`Pong!`);
    } else if (command === "pseudo") {
        const metamob_pseudo = args[0];
        if (!metamob_pseudo) {
            message.reply(`Vous devez fournir un pseudo valide.`);
        }
        const discord_id = message.member.id;
        const discord_pseudo = message.member.displayName;
        //insert or update
        con.query("INSERT INTO users(`discord_id`, `discord_name`, `metamob_pseudo`) VALUES (?, ?, ?)" +
            "ON DUPLICATE KEY UPDATE `discord_id` = ?, `discord_name` = ?, `metamob_pseudo` = ?;",
            [discord_id, discord_pseudo, metamob_pseudo, discord_id, discord_pseudo, metamob_pseudo], function (error, results, fields) {
            if (error) {
                console.error('Erreur d\'insertion...');
                return;
            }
            console.log(`Utilisateur ${metamob_pseudo} a ete enregistré par ${discord_id} (${discord_pseudo})`);
            message.reply(`Merci ! Ton pseudo ${metamob_pseudo} a bien été enregistré.`);
        });

    } else if (command === "page") {
        con.query("SELECT * FROM users WHERE discord_id = ?;",
            [message.member.id], function (error, results, fields) {
                if (error) {
                    console.error('Utilisateur introuvable.');
                    return;
                }
                const resultat = results[0]['metamob_pseudo'];
                //api call
                const api_call_result = fetch();
                message.reply(`Ton pseudo est ${resultat}.`);
            });
    }

});

client.login(config.BOT_TOKEN);