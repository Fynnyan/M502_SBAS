import express from "express"
import {
    activeUsers,
    bookSearchTotal,
    loginAttemptsTotal,
    metricsMiddleware,
    registry,
    securityEventsTotal, sqlErrorsTotal
} from "./metrics.js"

const app = express()

app.use(express.json())
app.use(metricsMiddleware)

app.get("/", (req, res) => {
    res.send("App is Running")
})

app.get("/health", (req, res) => {
    res.json({status: "up"})
})

app.get("/metrics", async (req, res) => {
    res.set("Content-Type", registry.contentType)
    res.end(await registry.metrics())
})

app.listen(3000, () => {
    console.log("Running on http://localhost:3000")
})

const BOOKS = [
    {id: 1, title: "Clean Code", author: "Robert C. Martin"},
    {id: 2, title: "The Pragmatic Programmer", author: "Andrew Hunt"},
    {id: 3, title: "Web Application Security", author: "Andrew Hoffman"},
    {id: 4, title: "Site Reliability Engineering", author: "Google"},
    {id: 5, title: "Grokking Algorithms", author: "Aditya Bhargava"},
]

app.get("/books/search", (req, res) => {
    const q = (req.query.q || "").toString()

    // Simulierter, ungefaehrlicher SQL-Fehler, nur zu Demozwecken
    if (q.toLowerCase().includes("error")) {
        sqlErrorsTotal.inc({endpoint: "/books/search"})
        securityEventsTotal.inc({type: "sql_error", severity: "info"})
        bookSearchTotal.inc({result: "error"})
        res.status(500).json({message: "Server Error"})
        return
    }

    const results = BOOKS.filter((book) =>
        book.title.toLowerCase().includes(q.toLowerCase())
    )

    if (results.length === 0) {
        bookSearchTotal.inc({result: "empty"})
    } else {
        bookSearchTotal.inc({result: "success"})
    }

    res.json({query: q, results})
})

app.post("/login", (req, res) => {
    const {username, password} = req.body || {}

    if (username === password) {
        loginAttemptsTotal.inc({result: "success"})
        activeUsers.inc(1)
        res.json({message: "Login erfolgreich"})
        return
    }

    // Generische Fehlermeldung, keine Benutzername-Enumeration
    loginAttemptsTotal.inc({result: "failed"})
    securityEventsTotal.inc({type: "failed_login", severity: "warning"})
    res.status(401).json({message: "Login fehlgeschlagen"})
})