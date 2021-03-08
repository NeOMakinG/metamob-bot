const Discord = require("discord.js");
const config = require("./config.json");
const mysql = require('mysql');
const fetch = require('node-fetch');

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

client.on("message", async function(message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    if (command === "ping") {
        await message.reply(`Pong!`);
    } else if (command === "pseudo") {
        const metamob_pseudo = args[0];
        if (!metamob_pseudo) {
            await message.reply(`Vous devez fournir un pseudo valide.`);
        }
        const discord_id = message.member.id;
        const discord_pseudo = message.member.displayName;
        //insert or update
        con.query("INSERT INTO users(`discord_id`, `discord_name`, `metamob_pseudo`) VALUES (?, ?, ?)" +
            "ON DUPLICATE KEY UPDATE `discord_id` = ?, `discord_name` = ?, `metamob_pseudo` = ?, `updated_at` = NOW();",
            [discord_id, discord_pseudo, metamob_pseudo, discord_id, discord_pseudo, metamob_pseudo],
            async function (error, results, fields) {
            if (error) {
                await message.reply(`Il y a eu une erreur lors de l'enregistrement de ton pseudo Metamob.`);
                console.error(`Erreur d'insertion pour le `);
                return;
            }
            console.log(`Utilisateur ${metamob_pseudo} a ete enregistré par ${discord_id} (${discord_pseudo})`);
                await message.reply(`Merci ! Ton pseudo ${metamob_pseudo} a bien été enregistré.`);
        });

    } else if (command === "page") {
        await con.query("SELECT * FROM users WHERE discord_id = ?;",
            [message.member.id], async function (error, results, fields) {
                if (error) {
                    console.error('Utilisateur introuvable.');
                    return;
                }
                const metamob_pseudo = results[0]['metamob_pseudo'];
                //api call
                let fetch_result = fetch(config.METAMOB_API_BASE_URL+'utilisateurs/'+metamob_pseudo,
                    {
                    headers: {'Content-Type': 'application/json', 'HTTP-X-APIKEY': config.METAMOB_API_KEY},
                })
                    .then(res => res.json())
                    .then(resolve(fetch_result));
                await console.log(fetch_result);
                // await message.reply(`Ton pseudo est ${metamob_pseudo}.`);
            });
    }

});

client.login(config.BOT_TOKEN);