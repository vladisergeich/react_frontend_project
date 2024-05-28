const {Router} = require('express');

const {PollutionController} = require('../controllers/pollutionController')

const pollutionRouter = Router();

pollutionRouter.get('/', PollutionController.getItems);
pollutionRouter.post('/', PollutionController.createItem);

module.exports = {pollutionRouter}
