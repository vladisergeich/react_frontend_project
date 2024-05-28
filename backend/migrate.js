const {Pollutions} = require("./models/pollutions");

Promise.all([
    Pollutions.createTable()
        .then(() => {
            console.log('таблица pollutions создана')
        })
]).then(() => {
    console.log('миграция завершена')
    process.exit(0)
}).catch((e) => {
    console.log(e)
})
