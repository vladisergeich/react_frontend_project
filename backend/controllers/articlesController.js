const {Articles} = require('../models/articles')

class ArticlesController {
    static async getItems(req, res) {
        try {
            const row = await Articles.getList();
            res.status(200).send(row);
        } catch (e) {
            console.log(e)
            res.status(500).send(e.message);
        }
    }
    static async getItem(req, res) {
        try {
            const { id } = req.params;
            const row = await Articles.getItem(id);
            if (!row) {
                res.status(404).send('Статья с таким id не существует');
            }
            res.status(200).send(row);
        } catch (e) {
            console.log(e)
            res.status(500).send(e.message);
        }
    }

    static async createItem(req, res) {
        try {
            const {title, description} = req.body;
            if (!title || !description) {
                res.status(400).send({message: 'Не переданы обязательные поля'});
                return;
            }
            const row = await Articles.createItem(req.body);
            res.status(200).send(row);
        } catch (e) {
            res.status(500).send(e.message);
        }
    }
}

module.exports = {ArticlesController}
