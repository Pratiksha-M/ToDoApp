const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/ToDoList');

var Todo = mongoose.model('Todo', {
	text: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	completed: {
		type: Boolean, 
		default: false
	},
	completedAt: {
		type: Number,
		default: null
	}
});

// var newToDo = new Todo ({
// 	text: "Pratiksha"
// });

// newToDo.save().then((doc) => {
// 	console.log('Saved Todo', doc);
// }, (err) => {
// 	console.log('Unable to save todo');
// });

var another = new Todo({
	text: "Chinu",
	completed: true,
	completedAt: 1234
});

another.save().then((doc) => console.log('Saved todo', doc),
	(err) => console.log('Unable to save todo', err));