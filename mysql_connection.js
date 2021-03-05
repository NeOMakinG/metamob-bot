const mysql = require('mysql');

module.exports = class mysql_connection {
    constructor(config) {
        const con = mysql.createConnection({
            host: config.DATABASE_HOST,
            user: config.DATABASE_USER,
            password: config.DATABASE_PASSWORD,
            database: config.DATABASE_BASE
        })

        con.connect(async function(err) {
            if (err) {
                await console.error('error connecting: ' + err.stack);
                return;
            }

            await console.log('connected as id ' + con.threadId);
        });

        this.con = con;
    }

    /**
     * get the pseudo for a discord user
     * @param discord_id
     * @returns {Promise<void>}
     */
    async getPseudo(discord_id) {
        await this.con.query("SELECT * FROM users WHERE discord_id = ?;", [discord_id], function (error, results, fields) {
            if (error) {
                console.error('cannot find user');
                return;
            }
            if (results) {
                return results;
            }
        });
    }

    /**
     * set the link between a discord user and its metamob name
     * @param discord_id
     * @param metamob_pseudo
     * @returns {Promise<void>}
     */
    async setPseudo(discord_id, metamob_pseudo) {
        const user = {discord_id: discord_id, metamob_pseudo: metamob_pseudo};
        await this.con.query("INSERT INTO users SET ?;", [user], function (error, results, fields) {
            if (error) {
                console.error('cannot find user');
                return;
            }

        });
    }
}