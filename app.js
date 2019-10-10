const express = require('express');
const mongoose = require('mongoose');
const Recipe = require('./models/recipe');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

const dbUri = 'mongodb+srv://chido:chido1118@cluster0-rukvh.mongodb.net/recipe?retryWrites=true&w=majority';

mongoose.connect(dbUri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas!');
    })
    .catch((error) => {
        console.log('Unable to connect to MongoDB Atlas!');
        console.error(error);
    });

app.use(cors());
app.use(bodyParser.json());

app.get('/api/', (req, res, next) => {
    res.status(200).json({
        message: 'Recipe API v1.0'
    });
});

app.get('/api/recipes', (req, res, next) => {
    Recipe.find()
        .then((recipe) => {
            res.status(200).json(recipe);
        })
        .catch((error) => {
            res.status(400).json({
                error: error
            });
        });
});

app.get('/api/recipes/:id', (req, res, next) => {
    Recipe.findOne({
            _id: req.params.id
        })
        .then((recipe) => {
            res.status(200).json(recipe);
        })
        .catch((error) => {
            res.status(404).json({
                error: error
            });
        });
});

app.post('/api/recipes', (req, res, next) => {
    const recipe = Recipe({
        title: req.body.title,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        time: req.body.time,
        difficulty: req.body.difficulty
    });

    recipe.save()
        .then(() => {
            res.status(201).json({
                message: 'Recipe saved successfully!'
            });
        })
        .catch((error) => {
            res.status(400).json({
                error: error
            });
        });
});

app.put('/api/recipes/:id', (req, res, next) => {
    const recipe = new Recipe({
        _id: req.params.id,
        title: req.body.title,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        time: req.body.time,
        difficulty: req.body.difficulty
    });

    Recipe.updateOne({
            _id: req.params.id
        }, recipe)
        .then(() => {
            res.status(201).json({
                message: 'Recipe updated successfully!'
            });
        })
        .catch((error) => {
            res.status(400).json({
                error: error
            });
        });
});

app.delete('/api/recipes/:id', (req, res, next) => {
    Recipe.deleteOne({
            _id: req.params.id
        })
        .then(() => {
            res.status(200).json({
                message: 'Deleted!'
            });
        })
        .catch((error) => {
            res.status(400).json({
                error: error
            });
        });
});


module.exports = app;