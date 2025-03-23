// monitoring.js
const { collectDefaultMetrics, Registry } = require("prom-client");

// Create a new registry to keep default metrics
const register = new Registry();

// Enable collection of default metrics
collectDefaultMetrics({ register });

// Expose the metrics on a separate HTTP server
const http = require("http");
const server = http.createServer(async (req, res) => {
	if (req.url === "/metrics") {
		try {
			// Return all metrics in the Prometheus exposition format
			res.setHeader("Content-Type", register.contentType);
			const metrics = await register.metrics();
			res.end(metrics);
		} catch (err) {
			res.writeHead(500);
			res.end(err.message);
		}
	} else {
		res.writeHead(404);
		res.end("Not Found");
	}
});

const monitoringPort = 9100;
server.listen(monitoringPort, () => {
	console.log(`Monitoring server listening on port ${monitoringPort}`);
});

setInterval(async function () {
	const metrics = await register.metrics();
	console.log(metrics.match(/nodejs_eventloop_lag_mean_seconds.*/gi)[2]);
}, 400);

console.log("Started monitoring logging.");

// Keep the Node.js process running
process.stdin.resume();
