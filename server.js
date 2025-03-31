const http = require("http");

// Configuration
const PORT = 3000;
const LAG_PROBABILITY = 0.2; // 30% chance of lag per request
const MIN_LAG_MS = 3000; // Minimum lag duration in ms
const MAX_LAG_MS = 5000; // Maximum lag duration in ms

/**
 * Creates event loop lag by running a CPU-intensive operation
 * @param {number} duration - Duration in milliseconds to block the event loop
 */
function createEventLoopLag(duration) {
	// console.log(`Creating event loop lag for ${duration}ms`);
	const start = Date.now();

	// Run a blocking operation for the specified duration
	while (Date.now() - start < duration) {
		// This empty loop blocks the thread
		// Any non-trivial operation can be used here
		Math.random() * Math.random();
	}

	// console.log(`Event loop lag completed after ${Date.now() - start}ms`);
}

/**
 * Determines whether to create lag and for how long
 * @returns {number} Duration of lag in ms, or 0 for no lag
 */
function shouldCreateLag() {
	// Randomly decide whether to create lag based on probability
	if (Math.random() < LAG_PROBABILITY) {
		// Generate a random lag duration between min and max
		return Math.floor(Math.random() * (MAX_LAG_MS - MIN_LAG_MS + 1)) + MIN_LAG_MS;
	}
	return 0; // No lag
}

// Create HTTP server
const server = http.createServer((req, res) => {
	// console.log(`Received request: ${req.method} ${req.url}`);

	// Handle the /hello endpoint from your example
	if (req.url === "/hello") {
		// Randomly decide whether to create lag
		const lagDuration = shouldCreateLag();

		if (lagDuration > 0) {
			createEventLoopLag(lagDuration);
			res.writeHead(200, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ message: "Hello after lag", lagCreated: true, lagDuration }));
		} else {
			res.writeHead(200, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ message: "Hello (no lag)", lagCreated: false }));
		}
		return;
	}

	// Handle all other routes
	const lagDuration = shouldCreateLag();
	if (lagDuration > 0) {
		createEventLoopLag(lagDuration);
	}

	res.writeHead(200, { "Content-Type": "text/plain" });
	res.end(`Response from path: ${req.url}${lagDuration > 0 ? ` (with ${lagDuration}ms lag)` : ""}`);
});

// Start the server
server.listen(PORT, () => {
	// console.log(`Server listening on port ${PORT}`);
	// console.log(`Configuration: ${LAG_PROBABILITY * 100}% chance of lag between ${MIN_LAG_MS}-${MAX_LAG_MS}ms`);
});
