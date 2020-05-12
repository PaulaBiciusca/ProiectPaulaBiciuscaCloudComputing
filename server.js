const express = require('express');
const app = express();
app.use('/', express.static('frontend'));
app.listen(8080);

const Sequelize = require('sequelize');

const sequelize = new Sequelize('Books_db', 'paulabiciusca', 'test1234', {
    dialect: "mysql",
    host: "localhost"
});

sequelize.authenticate().then(() => {
    console.log("Conexiune reusita");
}).catch(() => {
    console.log("Conexiune esuata");
});

const Favorite = sequelize.define('favorite', {
    titlu: Sequelize.STRING,
    autor: Sequelize.STRING,
    url: Sequelize.STRING
});

app.get('/createdb', (request, response) => {
    sequelize.sync({force:true}).then(() => {
        response.status(200).send('Tabela creata');
    }).catch((err) => {
        console.log(err);
        response.status(200).send('Tabela nu a putut fi creata');
    });
});

app.use(express.json());

app.post('/favorite', (request, response) => {
    Favorite.count({
        where: {
            titlu: request.body.titlu,
            autor: request.body.autor
        }
    }).then((result) => {
        if(result <= 0) {
            Favorite.create(request.body)
            .then((result) => {
                response.status(201).json(result);
            }).catch(() => {
                response.status(500).send();
            });
        }
        else{
            response.status(409).send();
        }
    });

});

app.get('/favorite', (request, response) => {
    Favorite.findAll().then((results) => {
        response.status(200).json(results);
    });
});

app.delete('/favorite/:titlu', (request, response) => {
    Favorite.findAll({
        where: {
            titlu: request.params.titlu
        }
    }).then((carte) => {
        if(carte) {
            carte[0].destroy().then((result) => {
                response.status(204).send();
            }).catch((err) => {
                console.log(err);
                response.status(500).send();
            });
        } else {
            response.status(404).send();
        }
        }).catch((err) => {
            console.log(err);
            response.status(500).send();
        });
});