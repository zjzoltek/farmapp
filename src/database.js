const assert = require("assert");
const {
    createConnection,
    format
} = require("mysql");

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
            host: host || "localhost",
            port: port || 3306,
            user: username,
            password,
            database,
        });

        this._preBakedQueries = {
            pagedQueries: {
                livestock: {
                    entityQuery: "select * from livestock where owner_id=? limit ?, ?",
                    countQuery: "select count(*) from livestock where owner_id=?"
                },

                vaccinations: {
                    entityQuery: "select vaccinations.vacc_id, vaccinations.vac_type," +
                        " vaccinations.date_given from vaccinations join livestock on livestock.livestock_id=vaccinations.animal_id" +
                        " where livestock.owner_id = ? limit ?, ?",
                    countQuery: "select count(*) from vaccinations join livestock on livestock.livestock_id=vaccinations.animal_id" +
                        " where livestock.owner_id = ?"
                },

                vetVisits: {
                    entityQuery: "select vetvisit.livestock_id, vetvisit.visit_date," +
                        " vetvisit.visit_id, vetvisit.vet_name, vetvisit.cost, vetvisit.reason, vetvisit.notes" +
                        " from vetvisit join livestock on livestock.livestock_id=vetvisit.livestock_id" +
                        " where livestock.owner_id = ? limit ?, ?",
                    countQuery: "select count(*)" +
                        " from vetvisit join livestock on livestock.livestock_id=vetvisit.livestock_id" +
                        " where livestock.owner_id = ?"
                },

                pastureMaintenance: {
                    entityQuery: "select pasture_maintenance.maintenance_id, pasture_maintenance.location," +
                        " pasture_maintenance.maintenance_type, pasture_maintenance.cost, pasture_maintenance.notes" +
                        " from pasture_maintenance join pastures on pastures.pasture_id=pasture_maintenance.location where pastures.owner_id = ?" +
                        " limit ?, ?",
                    countQuery: "select count(*) from pastures where owner_id = ?"
                },

                medication: {
                    entityQuery: "select medication.livestock_id, medication.med_id," +
                        " medication.medication_name, medication.start_date, medication.end_date, medication.med_interval" +
                        " from medication join livestock on livestock.livestock_id = medication.livestock_id" +
                        " where owner_id = ? limit ?, ?",
                    countQuery: "select count(*)" +
                        " from medication join livestock on livestock.livestock_id = medication.livestock_id" +
                        " where owner_id = ?"
                },

                calves: {
                    entityQuery: "select calves.calf_id, calves.cow_id, calves.sired_id," +
                        " calves.calf_subtype, calves.vaccine_complete, calves.water_complete," +
                        " calves.feeder_complete from calves join livestock on calves.calf_id=livestock.livestock_id where owner_id = ?" +
                        " limit ?, ?",
                    countQuery: "select count(*) from calves join livestock on calves.calf_id=livestock.livestock_id where owner_id = ?"
                },

                pastures: {
                    entityQuery: "select * from pastures where owner_id=? limit ?, ?",
                    countQuery: "select count(*) from pastures where owner_id=?"
                }
            }
        }
    }

    performQuery(sql) {
        return new Promise((resolve, reject) => {
            console.info("Performing query against DB:", sql);
            this.connection.query(sql, (error, results, fields) => {
                if (error) {
                    console.error("Error when querying DB with statement", sql, ":", error);
                    reject(error);
                } else {
                    console.info("Query completed successfully:", results.length ? results.length : 0, "results returned");
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
        return this.performQuery(sql);
    }

    async performPagedQuery({
        offset,
        number,
        user,
        route
    }) {
        console.info("Performing paged query for route", route);
        console.info("Offset/Number: ", offset, "/", number);
        console.info("User:", user);
        const sql = format(this._preBakedQueries.pagedQueries[route].entityQuery, [user.user_id, offset, number]);
        const countSql = format(this._preBakedQueries.pagedQueries[route].countQuery, user.user_id);

        let {
            results: entityResults,
            fields
        } = await this.performQuery(sql);


        let {
            results: countResults
        } = await this.performQuery(countSql);

        const count = countResults[0]["count(*)"];
        this._normalizeResultKeys(entityResults, fields);
        return {
            data: entityResults,
            pages: Math.ceil(count / number)
        };
    }

    async performUpdate({
        identifyingData,
        dataToUpdate,
        table
    }) {
        console.info("Performing update query");
        console.info("Table", table);
        console.info("Data being updated", dataToUpdate);
        console.info("Data being used to identify which row to modify", identifyingData);

        const keysForIdentifyingData = Object.keys(identifyingData);
        const keysForDataToUpdate = Object.keys(dataToUpdate);

        const updatePartOfQuery = keysForDataToUpdate.map((key) => `${this.connection.escapeId(key)}=${this.connection.escape(dataToUpdate[key])}`).join(", ");
        const wherePartOfQuery = keysForIdentifyingData.map((key) => `${this.connection.escapeId(key)}=${this.connection.escape(identifyingData[key])}`).join(", ");

        const query = `update ${this.connection.escapeId(table)} set ${updatePartOfQuery} where ${wherePartOfQuery}`;

        return this.performQuery(query);
    }

    async performDelete({
        identifyingData,
        table
    }) {
        console.info("Performing delete query");
        console.info("Table", table);
        console.info("Data being used to identify which row to modify", identifyingData);

        const wherePartOfQuery = keysForIdentifyingData.map((key) => `${this.connection.escapeId(key)}=${this.connection.escape(identifyingData[key])}`).join(", ");

        const query = `delete from ?? where ${wherePartOfQuery}`;

        return this.performQuery(query);
    }

    _normalizeResultKeys(results, fields) {
        if (!results || results.length === 0) {
            console.warn("Passed in 'results' object for normalization was either undefined or empty");
            console.warn("Skipping normalization");
            return;
        }

        console.info("Normalizing result keys");
        console.info("Prenormalization:", Object.keys(results[0]));

        if (fields && fields.length !== 0) {
            for (const f of fields) {
                if (f.type === 10 || f.type === 11 || f.type === 12) {
                    for (let r of results) {
                        r[f.name] = new Date(r[f.name]).toLocaleDateString();
                    }
                }
            }
        }

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
        console.info("Postnormalization:", Object.keys(results[0]));
    }

    async insertEntity(entity, table) {
        console.info("Attempting to insert data into DB");
        console.info("Entity", entity);
        console.info("Table", table);

        const entityKeys = Object.keys(entity);
        const entityKeysEscaped = entityKeys.map((key) => this.connection.escapeId(key));

        let query = `insert into ${this.connection.escapeId(table)}(${entityKeysEscaped.join(", ")})` +
            `values(${entityKeys.map((key) => this.connection.escape(entity[key]))})`

        return this.performQuery(query);
    }
}

module.exports = {
    Database
};