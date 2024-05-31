const {pool} = require('../database');

class Articles {
    static async createTable() {
        const res = await pool.query(
            "create table if not exists articles (\n" +
            " id serial unique,\n" +
            " created_at timestamp not null,\n" +
            " title varchar(255) not null,\n" +
            " short_desc varchar(255),\n" +
            " description text not null,\n" +
            " primary key(id)\n" +
            ");"
        );

        return res.rows;
    }

    static async getList(count = 10) {
        const selectRes = await pool.query('select id, title, short_desc from articles ORDER BY id DESC LIMIT $1', [count]);

        return selectRes.rows;
    }

    static async getItem(id = 10) {
        try {
            const searchRes = await pool.query('select * from articles where id = $1 limit 1', [id]);
            return searchRes.rows[0];
        } catch (e) {
            throw new Error('Ошибка');
        }
    }

    static async createItem({title, short_desc, description}) {
        const insertRes = await pool.query('insert into articles(created_at, title, short_desc, description) values($1, $2, $3, $4) RETURNING *', [
            'now()',
            title,
            short_desc || null,
            description,
        ]);
        return insertRes.rows[0]
    }
}

module.exports = {Articles}
