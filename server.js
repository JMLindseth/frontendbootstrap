require('dotenv').config();

const express = require('express');
const path = require('path');
const mustacheExpress = require('mustache-express');
const Promise = require('promise');
const prom_client = require('prom-client');
const counters = require('./server/counters');
const proxy = require('express-http-proxy');

// Prometheus metrics
const setupMetrics = () => {
    const collectDefaultMetrics = prom_client.collectDefaultMetrics;
    collectDefaultMetrics({ timeout: 5000 });

    const Registry = prom_client.Registry;
    const register = new Registry();

    register.registerMetric(counters.httpRequestDurationMicroseconds);

    collectDefaultMetrics({ register });
    return register;
};
const prometheus = setupMetrics();

const server = express();

const env = process.argv[2];
const settings = env === 'local' ? {isProd: false} : require('./settings.json');

server.set('views', `${__dirname}/dist`);
server.set('view engine', 'mustache');
server.engine('html', mustacheExpress());

const modiacontextholderUrl =  process.env.NAIS_CONTEXT === 'dev'
    ? 'modiacontextholder.q1'
    : 'modiacontextholder.default';

const renderApp = () => {
    return new Promise((resolve, reject) => {
        server.render(
            'index.html',
            Object.assign(
                {},
                settings,
            ),
            (err, html) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(html);
                }
            },
        );
    });
};

function nocache(req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
}

const startServer = (html) => {
    server.use(
        '/frontendbootstrap/resources',
        express.static(path.resolve(__dirname, 'dist/resources')),
    );

    server.use(
        '/frontendbootstrap/src/img',
        express.static(path.resolve(__dirname, 'dist/resources/img')),
    );

    server.get('/health/isAlive', (req, res) => {
        res.sendStatus(200);
    });

    server.get('/health/isReady', (req, res) => {
        res.sendStatus(200);
    });

    server.get('/actuator/metrics', (req, res) => {
        res.set('Content-Type', prometheus.contentType);
        res.end(prometheus.metrics());
    });

    server.post('/metrics/actions/filters/:type', (req, res) => {
        const counterPostfix = req.params.type
            ? req.params.type
            : '';
        const counterKey = counters.getMetricName(counters.METRIC_FILTER_INFIX, counterPostfix);
        prometheus.getSingleMetric(counterKey).inc(1, new Date());
        res.sendStatus(200);
    });

    if (env === 'local' || env === 'opplaering') {
        console.log('Setter opp lokale mock-endepunkter');
        require('./Mock/mockEndepunkter').mockForLokal(server);
    }

    const port = process.env.PORT || 8080;

    server.listen(port, () => {
        console.log(`App listening on port: ${port}`);
    });

    server.use(
        ['*', '/frontendbootstrap/?',/^\/frontendbootstrap\/(?!(resources|img)).*$/],
        nocache,
        (req, res) => {
            res.send(html);
            prometheus.getSingleMetric('http_request_duration_ms')
                .labels(req.path)
                .observe(10);
        },
    );
};

const logError = (errorMessage, details) => {
    console.log(errorMessage, details);
};

renderApp()
    .then(startServer, (error) => {
        logError('Failed to render app', error);
    });
