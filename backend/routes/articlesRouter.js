const {Router} = require('express');
const {ArticlesController} = require('../controllers/articlesController')
const articlesRouter = Router();

articlesRouter.get('/', ArticlesController.getItems);
articlesRouter.get('/:id', ArticlesController.getItem);
articlesRouter.post('/', ArticlesController.createItem);

module.exports = {articlesRouter}
