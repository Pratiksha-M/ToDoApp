require('./config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/users');
var {authenticate} = require('./middleware/authenticate');

var port = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.json());


app.post('/todos', authenticate, (request, response) => {
	var newtodo = new Todo({
		text: request.body.text,
		completed: request.body.completed,
		completedAt: request.body.completedAt,
		_creator: request.user._id
	});

	newtodo.save().then((doc) => {
		response.send(doc)
	}, (error) => {
		response.status(400).send(error);
	});
});


app.get('/todos', authenticate, (request, response) => {
	Todo.find({
		_creator: request.user._id
	}).then((docs) => {
		response.send({docs})
	}, (err) => {
		response.status(400).send(err)
	});
});


app.get('/todos/:id', authenticate, (request, response) => {
	const id = request.params.id;
	if(!ObjectID.isValid(id)){
		return response.status(404).send();
	}

	Todo.findOne({
		_id: id,
		_creator: request.user._id
	}).then((todo) => {
		if(!todo){
			return response.status(404).send();
		}
		response.send({todo});
	}).catch((e) => response.status(400).send(e))
});


app.delete('/todos/:id',authenticate, (request, response) => {
	var id = request.params.id;
	if(!ObjectID.isValid(id)) {
		return response.status(404).send();
	}

	Todo.findOneAndRemove({
		_id: id,
		_creator: request.user._id
	}).then((todo) => {
		if(!todo)
			return response.status(404).send();
		response.send(todo);
	}).catch((e) => response.status(400).send(e));
})


app.patch('/todos/:id', authenticate, (request, response) => {
	var id = request.params.id;
	var body = _.pick(request.body, ['text', 'completed']);

	if(!ObjectID.isValid(id)) {
		return response.status(404).send();
	}

	if(_.isBoolean(body.completed) && body.completed){
		body.completedAt = new Date().getTime();
	}else{
		body.completed = false;
		body.completedAt = null;
	}

	Todo.findOneAndUpdate({_id: id, _creator: request.user._id}, {$set: body}, {new: true}).then((todo) => {
		if(!todo) {
			return response.status(404).send();
		}

		response.send({todo});
	}).catch((e) => {
		response.status(400).send();
	})
})


app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});



app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});


app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});


app.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});

module.exports = {app};




