# Node.js Event Loop Blocking Test

A demonstration project for simulating, visualizing, and monitoring event loop blocking in Node.js applications.

## Overview

This project provides a simple Node.js application that intentionally blocks the event loop with configurable frequency and duration. It includes a complete monitoring stack with Prometheus and Grafana to observe the impact of event loop blocking on application performance.

## Features

- Node.js server with configurable blocking behavior
- Prometheus metrics collection for Node.js application monitoring
- Grafana dashboard for visualization
- Docker Compose setup for easy deployment
- Load testing utility to simulate traffic

## Prerequisites

- Docker and Docker Compose
- Node.js (for local development)

## Getting Started

### Using Docker

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/nodejs-blocking-test.git
   cd nodejs-blocking-test
   ```

2. Start the entire stack with Docker Compose:
   ```
   docker-compose up -d
   ```

3. Access the services:
   - Node.js application: http://localhost:3000/hello
   - Prometheus: http://localhost:9090
   - Grafana: http://localhost:3333 (login with admin/grafana)

4. Run the load test
   ```
   node load-test.js
   ```

### Local Development and Debugging

1. Install dependencies:
   ```
   npm install
   ```

2. Start the Node.js server with monitoring:
   ```
   npm start
   ```

3. Run the load test (in a separate terminal):
   ```
   node load-test.js
   ```

## Configuration

### Server Configuration (server.js)

The following variables can be modified to adjust the blocking behavior:

```javascript
const LAG_PROBABILITY = 0.6; // 60% chance of lag per request
const MIN_LAG_MS = 100;      // Minimum lag duration in ms
const MAX_LAG_MS = 3000;     // Maximum lag duration in ms
```

### Docker Compose

The `docker-compose.yaml` file defines the following services:

- **nodejs-app**: The Node.js application with simulated blocking
- **prometheus**: Metrics collection and storage
- **grafana**: Visualization dashboard

## Project Structure

```
├── docker-compose.yaml     # Docker Compose configuration
├── Dockerfile              # Node.js application Docker image
├── load-test.js           # Load testing utility using autocannon
├── monitoring.js          # Prometheus metrics collection
├── package.json           # Node.js dependencies and scripts
├── server.js              # Main application with blocking code
├── grafana/               # Grafana configuration
│   └── provisioning/      
│       └── datasources/   
│           └── datasource.yaml  # Prometheus datasource configuration
└── prometheus/            # Prometheus configuration
    └── prometheus.yaml    # Scrape configuration
```

## Monitoring

### Metrics

The application exposes standard Node.js metrics using the `prom-client` library at http://localhost:9100/metrics, including:

- CPU usage
- Memory usage
- Event loop lag
- HTTP request metrics

### Visualization

After starting the stack, configure Grafana (http://localhost:3333) with the following:

1. Log in with username `admin` and password `grafana`
2. The Prometheus data source should be automatically configured
3. Create a new dashboard with panels for CPU, memory, and event loop lag

## Testing the Event Loop Blocking Behavior

1. Run the load test to generate traffic:
   ```
   node load-test.js
   ```

2. Then observe the metrics in Grafana to see the impact of the simulated event loop blocking.

## License
```
MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
