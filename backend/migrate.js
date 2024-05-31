const {Pollutions} = require("./models/pollutions");
const {Articles} = require("./models/articles");

Promise.all([
    Pollutions.createTable().then(() => {console.log('таблица pollutions создана')}),
    Articles.createTable().then(() => {console.log('таблица articles создана')})
]).then(() => {
    console.log('миграция завершена')
    process.exit(0)
}).catch((e) => {
    console.log(e)
})
