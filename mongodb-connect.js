const MongoClient = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoList', (err, db) => {
	if(err)
		return console.log('Unable to connect to Database Server');
	console.log('Successfully connected to the server');

	db.collection('ToDos').insertOne({
		text: "Task 2",
		completed: true
	}, (err, result) => {
		if(err)
			return console.log("Unable to insert data", err);
		console.log(JSON.stringify(result.ops, undefined, 2));
		db.close();
	})

	db.collection('Users').insertOne({
		name: "Pratiksha",
		location: "Surat",
		age: 23
	}, (err, result) => {
		if(err)
			return console.log("Unable to insert data");
		console.log(result.ops[0]._id.getTimestamp());
	})

});