const {pool} = require('../database');
const dayjs = require("dayjs");

class Pollutions {
    static async createTable() {
        const res = await pool.query(
            "create table if not exists pollutions (\n" +
            " id serial unique,\n" +
            " created_at timestamp not null,\n" +
            " address varchar(255) not null,\n" +
            " lat float not null,\n" +
            " lon float not null,\n" +
            " measured_at timestamp not null,\n" +
            " aqi smallint not null,\n" +
            " components json not null,\n" +
            " primary key(id)\n" +
            ");\n"
        );

        return res.rows;
    }

    static async getLastQueriesList(count = 10) {
        const selectRes = await pool.query('select p.* from pollutions p ORDER BY p.id DESC LIMIT $1', [count]);

        return selectRes.rows;
    }

    static async createItem({address, lat, lon, measured_at, aqi, components}) {
        const insertRes = await pool.query('insert into pollutions(created_at, address, lat, lon, measured_at, aqi, components) values($1, $2, $3, $4, $5, $6, $7) RETURNING *', [
            'now()',
            address,
            lat,
            lon,
            dayjs(measured_at).format('YYYY-MM-DD HH:mm:ss'),
            aqi,
            components,
        ]);
        return insertRes.rows[0]
    }
}

module.exports = {Pollutions}
