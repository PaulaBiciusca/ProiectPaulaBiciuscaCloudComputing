const express = require('express');
const app = express();
app.use('/', express.static('frontend'));
app.listen(8080);

const Sequelize = require('sequelize');

const sequelize = new Sequelize('Books_db', 'paula.biciusca', 'test123', {
    dialect: "mysql",
    host: "localhost"
});

sequelize.authenticate().then(() => {
    console.log("Conexiune reusita");
}).catch(() => {
    console.log("Conexiune esuata");
});

const Favorite = sequelize.define('favorite', {
    title: Sequelize.STRING,
    autor: Sequelize.STRING,
    cevaId: Sequelize.INTEGER
});

app.get('/createdb', (request, response) => {
    sequelize.sync({force:true}).then(() => {
        response.status(200).send('Tabela creata');
    }).catch((err) => {
        console.log(err);
        response.status(200).send('Tabela nu a putut fi creata');
    });
})