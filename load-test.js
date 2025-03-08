const autocannon = require("autocannon");

autocannon(
	{
		url: "http://localhost:3000/hello",
		connections: 10, //default
		pipelining: 1, // default
		duration: 60, // default
	},
	console.log
);
