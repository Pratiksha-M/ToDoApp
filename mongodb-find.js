const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoList', (err, db) => {
	if(err)
		return console.log('Unable to connect to Database Server');
	console.log('Successfully connected to the server');

	db.collection('ToDos').find({_id: new ObjectID("5b30a6e26e07441a30a73fd1")}).toArray().then((docs) => {
		console.log("To Dos");
		console.log(JSON.stringify(docs, undefined, 2));
	}, (err) => {
		console.log('Unable to fetch');
	})

});