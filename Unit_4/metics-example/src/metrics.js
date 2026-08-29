import * as promClient from "prom-client"


const client = promClient
export const registry = new client.Registry()

client.collectDefaultMetrics({
    register: registry,
    prefix: "nodejs_",
})

// 1. HTTP Requests Counter
export const httpRequestsTotal = new client.Counter({
    name: "http_requests_total",
    help: "Zählt alle HTTP Requests nach Methode, Route und Statuscode.",
    labelNames: ["method", "route", "status"],
})

// 2. HTTP Request Duration Histogram
export const httpRequestDurationSeconds = new client.Histogram({
    name: "http_request_duration_seconds",
    help: "Misst Antwortzeiten pro Request.",
    labelNames: ["method", "route", "status"],
    buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5],
})

// 3. Login Attempts Counter
export const loginAttemptsTotal = new client.Counter({
    name: "login_attempts_total",
    help: "Zählt erfolgreiche und fehlgeschlagene Loginversuche.",
    labelNames: ["result"], // success | failed
})

// 4. Book Search Counter
export const bookSearchTotal = new client.Counter({
    name: "book_search_total",
    help: "Zählt Buchsuchanfragen nach Ergebnis.",
    labelNames: ["result"], // success | empty | error
})

// 5. SQL Errors Counter
export const sqlErrorsTotal = new client.Counter({
    name: "sql_errors_total",
    help: "Zählt simulierte SQL-Fehler.",
    labelNames: ["endpoint"],
})

// 6. Security Events Counter
export const securityEventsTotal = new client.Counter({
    name: "security_events_total",
    help: "Zählt Security-relevante Events.",
    labelNames: ["type", "severity"], // type: failed_login|sql_error|suspicious_search|rate_limit, severity: info|warning|high
})

// 7. Active Users Gauge
export const activeUsers = new client.Gauge({
    name: "active_users",
    help: "Simulierter Wert fuer aktuell aktive Benutzer.",
})

// 9. App Info Gauge
const appInfo = new client.Gauge({
    name: "app_info",
    help: "Metainformationen zur App.",
    labelNames: ["version", "environment"],
})

// Alle Custom-Metriken am Registry registrieren
registry.registerMetric(httpRequestsTotal)
registry.registerMetric(httpRequestDurationSeconds)
registry.registerMetric(loginAttemptsTotal)
registry.registerMetric(bookSearchTotal)
registry.registerMetric(sqlErrorsTotal)
registry.registerMetric(securityEventsTotal)
registry.registerMetric(activeUsers)
registry.registerMetric(appInfo)

// App-Info Metrik setzen
appInfo.set({version: "1.0.0", environment: "local"}, 1)

export function metricsMiddleware(req, res, next) {
    const endTimer = process.hrtime.bigint()
    res.on("finish", () => {
        const route = (req.route && req.route.path) || req.path
        const labels = {
            method: req.method,
            route,
            status: String(res.statusCode),
        }

        httpRequestsTotal.inc(labels)

        const durationSeconds =
            Number(process.hrtime.bigint() - endTimer) / 1e9
        httpRequestDurationSeconds.observe(labels, durationSeconds)
    })

    next()
}