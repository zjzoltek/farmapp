const assert = require("assert");
const {
    createConnection,
    format
} = require("mysql");

const Views = {
    bullCalfView: "bull_calf_view",
    calvesView: "calves_view",
    cowCalfView: "cow_calf_view",
    livestockPastureView: "livestock_pasture_view",
    livestockView: "livestock_view",
    medicationsView: "medications_view",
    pasureMaintenanceView: "pasture_maintenance_view",
    pastureView: "pasture_view",
    vaccinesView: "vacc_view",
};

class Database {
    constructor({
        username,
        password,
        database,
        host,
        port
    }) {
        assert(username, "username is undefined");
        assert(password, "password is undefined");
        assert(database, "database is undefined");

        if (!port) console.warn("'port' is undefined. Defaulting to 3306");
        if (!host) console.warn("'host' is undefined. Defaulting to localhost")

        this.connection = createConnection({
            host: host || localhost,
            port: port || 3306,
            user: username,
            password,
            database,
        });
    }

    query(sql) {
        return new Promise((resolve, reject) => {
            console.info("Performing query against DB:", sql);
            this.connection.query(sql, (error, results, fields) => {
                if (error) {
                    console.error("Error when querying DB with statement", sql, ":", error);
                    reject(error);
                } else {
                    console.info("Query completed successfully:", results.length, "results returned");
                    resolve({
                        results,
                        fields
                    });
                }
            });
        });
    }

    async getUserByEmail(email) {
        console.log("Querying DB for user with email", email);
        const sql = format("select * from Users where email = ?", email);
        return this.query(sql);
    }

    async getEntities({
        number,
        offset,
        table
    }) {
        console.log("Querying DB for", table, ": offset ", offset, "number ", number);
        const sql = format("select * from ?? LIMIT ?, ?", [table, offset, number]);
        const {
            results
        } = await this.query(sql);
        const count = await this.getCountOfTable(table);

        for (let elem of results) {
            for (var key in elem) {
                if (elem.hasOwnProperty(key)) {
                    let keyMod = key.split("_");
                    keyMod = keyMod.map((e) => e[0].toUpperCase() + e.substring(1));
                    keyMod = keyMod.join(" ");
                    elem[keyMod] = elem[key];
                    delete elem[key];
                }
            }
        }

        return {
            results,
            pages: Math.ceil(count / number)
        };
    }

    async getCountOfTable(table) {
        const sql = format("select COUNT(*) from ??", table);
        const {
            results
        } = await this.query(sql);
        return results[0]["COUNT(*)"];
    }
}

module.exports = {
    Database
};