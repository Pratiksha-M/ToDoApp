const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');

var port = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.json());


app.post('/todos', (request, response) => {
	var newtodo = new Todo({
		text: request.body.text,
		completed: request.body.completed,
		completedAt: request.body.completedAt
	});

	newtodo.save().then((doc) => {
		response.send(doc)
	}, (error) => {
		response.status(400).send(error);
	});
});


app.get('/todos', (request, response) => {
	Todo.find().then((docs) => {
		response.send({docs})
	}, (err) => {
		response.status(400).send(err)
	});
});


app.get('/todos/:id', (request, response) => {
	const id = request.params.id;
	if(!ObjectID.isValid(id)){
		return response.status(404).send();
	}

	Todo.findById(id).then((todo) => {
		if(!todo){
			return response.status(404).send();
		}
		response.send({todo});
	}).catch((e) => response.status(400).send(e))
});

app.delete('/todos/:id', (request, response) => {
	var id = request.params.id;
	if(!ObjectID.isValid(id)) {
		return response.status(404).send();
	}

	Todo.findByIdAndRemove(id).then((todo) => {
		if(!todo)
			return response.status(404).send();
		response.send(todo);
	}).catch((e) => response.status(400).send(e));
})

app.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});

module.exports = {app};




