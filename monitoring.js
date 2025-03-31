// instrument-prom-client.js
const http = require('http');
const client = require('prom-client');
const { Registry, collectDefaultMetrics } = require('prom-client');

// Create a new registry for default and custom metrics.
const register = new Registry();

// Enable collection of default metrics into our registry.
collectDefaultMetrics({ register });
register.removeSingleMetric('process_cpu_user_seconds_total')
register.removeSingleMetric('process_cpu_system_seconds_total')
register.removeSingleMetric('process_cpu_seconds_total')
register.removeSingleMetric('process_start_time_seconds')
register.removeSingleMetric('process_resident_memory_bytes')
register.removeSingleMetric('process_virtual_memory_bytes')
register.removeSingleMetric('process_heap_bytes')
register.removeSingleMetric('process_open_fds')
register.removeSingleMetric('process_max_fds')
register.removeSingleMetric('nodejs_eventloop_lag_seconds')
register.removeSingleMetric('nodejs_eventloop_lag_min_seconds')
register.removeSingleMetric('nodejs_eventloop_lag_max_seconds')
register.removeSingleMetric('nodejs_eventloop_lag_stddev_seconds')
register.removeSingleMetric('nodejs_eventloop_lag_p50_seconds')
register.removeSingleMetric('nodejs_eventloop_lag_p99_seconds')
register.removeSingleMetric('nodejs_active_resources')
register.removeSingleMetric('nodejs_active_resources_total')
register.removeSingleMetric('nodejs_active_requests_total')
register.removeSingleMetric('nodejs_active_requests')
register.removeSingleMetric('nodejs_active_handles')
register.removeSingleMetric('nodejs_heap_size_total_bytes')
register.removeSingleMetric('nodejs_heap_size_used_bytes')
register.removeSingleMetric('nodejs_external_memory_bytes')
register.removeSingleMetric('nodejs_heap_space_size_total_bytes')
register.removeSingleMetric('nodejs_heap_space_size_used_bytes')
register.removeSingleMetric('nodejs_heap_space_size_available_bytes')
register.removeSingleMetric('nodejs_version_info')
register.removeSingleMetric('nodejs_gc_duration_seconds_bucket')
register.removeSingleMetric('nodejs_gc_duration_seconds')

// Global variables to store last response time and the timestamp when it was recorded.
let lastRequestTimestamp = 0;
let lastResponseTimeValue = 0;

// Define an idle threshold (in ms) after which we consider the system idle.
const IDLE_THRESHOLD = 5000; // 5 seconds

// Create a Gauge with a custom collect callback.
// This callback is called when metrics are scraped.
const lastResponseTimeGauge = new client.Gauge({
  name: 'http_last_response_time_ms',
  help: 'Response time of the last HTTP request in ms; returns 0 if idle',
  registers: [register],
  collect() {
    // If the elapsed time since the last request exceeds the threshold, set to 0.
    if (Date.now() - lastRequestTimestamp > IDLE_THRESHOLD) {
      this.set(0);
    } else {
      this.set(lastResponseTimeValue);
    }
  },
});

// Monkey-patch the HTTP server to capture timing.
const originalEmit = http.Server.prototype.emit;
http.Server.prototype.emit = function (event, req, res) {
  if (event === 'request' && req.url !== '/metrics') {
    console.log('[Instrumentation] Capturing request for URL:', req.url);
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log('[Instrumentation] Request for', req.url, 'finished in', duration, 'ms');
      // Update global values.
      lastRequestTimestamp = Date.now();
      lastResponseTimeValue = duration;
      // Optionally update the gauge immediately.
      lastResponseTimeGauge.set(duration);
    });
  }
  return originalEmit.apply(this, arguments);
};

console.log("Prom-client HTTP instrumentation loaded.");

// Expose metrics via a separate HTTP server on port 9100.
const metricsServer = http.createServer(async (req, res) => {
  if (req.url === '/metrics') {
    try {
      res.setHeader('Content-Type', register.contentType);
      res.end(await register.metrics());
    } catch (err) {
      res.writeHead(500);
      res.end(err.message);
    }
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

const METRICS_PORT = 9100;
metricsServer.listen(METRICS_PORT, () => {
  console.log(`Metrics server listening on port ${METRICS_PORT}`);
});
