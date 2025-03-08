const fs = require("fs");
const { Registry, collectDefaultMetrics } = require("prom-client");

// Create a new registry to keep default metrics
const register = new Registry();

// Enable collection of default metrics
collectDefaultMetrics.metricsList = ["nodejs_eventloop_lag_mean_seconds"];
collectDefaultMetrics({ register });

// keep sample time unrefed such it doesn't interfere too much
let timer = null;
function scheduleSample() {
	timer = setTimeout(saveSample, 1000); // 1s
	timer.unref();
}

async function saveSample() {
	let metricsData = await register.metrics();
	fs.writeFileSync("metrics.prom", metricsData);
	scheduleSample();
}

// allow time delay to be specified before we start collecting data
setTimeout(() => {
	scheduleSample();
}, 1000);

process.on("exit", () => {
	clearTimeout(timer);
});
