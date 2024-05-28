const {Pollutions} = require('../models/pollutions')

class PollutionController {
    static async getItems(req, res) {
        try {
            const row = await Pollutions.getLastQueriesList();
            res.status(200).send(row);
        } catch (e) {
            console.log(e)
            res.status(500).send(e.message);
        }
    }

    static async createItem(req, res) {
        try {
            const {address, lat, lon, measured_at, aqi, components} = req.body;
            if (!address || !lat || !lon || !measured_at || !aqi || !components) {
                res.status(400).send({message: 'Не переданы обязательные поля'});
                return;
            }
            const row = await Pollutions.createItem(req.body);
            res.status(200).send(row);
        } catch (e) {
            res.status(500).send(e.message);
        }
    }
}

module.exports = {PollutionController}
