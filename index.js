const Discord = require("discord.js");
const config = require("./config.json");
const mysql_connection = require("./mysql_connection");


const client = new Discord.Client();
const sqlconnection = new mysql_connection(config);

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
        const pseudo = args[0];
        if (!pseudo) {
            message.reply(`Vous devez fournir un pseudo valide.`);
        }
        let setResult = sqlconnection.setPseudo(message.member.id, pseudo);
        if (setResult) {
            message.reply(`Merci ! Ton pseudo ${pseudo} a bien été enregistré.`);
        }
    } else if (command === "page") {
        let setResult = sqlconnection.getPseudo(message.member.id);
        for (var i in setResult) {
            console.log('oui !');
            console.log(setResult[i][metamob_pseudo]);
        }
        if (setResult) {
            let metamob_pseudo = setResult.metamob_pseudo;
            message.reply(`J'ai trouvé ton pseudo Metamob: ${metamob_pseudo} !`);
        }
    }

});

client.login(config.BOT_TOKEN);