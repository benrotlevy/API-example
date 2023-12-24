const http = require("http");
const fs = require("fs/promises");

const server = http.createServer((req, res) => {
    switch (req.method) {
        case "GET": {
            handleGetRequest(req, res);
            break;
        }
        default: {
            res.statusCode = 400;
            res.statusMessage = "this server support only get request";
            res.end();
        }
    }
});

async function handleGetRequest(req, res) {
    if (req.url === "/raw-html") {
        res.setHeader("Content-Type", "text/html");
        res.end("<h1>Welcome</h1>");
        return;
    }
    if (req.url === "/users") {
        await sendFile(res, "./users.json", "application/json");
        return;
    }
    if (req.url === "/") {
        await sendFile(res, "./index.html", "text/html");
        return;
    }
    if (req.url === "/style.css") {
        await sendFile(res, "./style.css", "text/css");
        return;
    }
    if (req.url === "/index.js") {
        await sendFile(res, "./index.js", "text/javascript");
        return;
    }
    res.statusCode = 400;
    res.end();
}

async function sendFile(res, path, contentType) {
    try {
        const data = await fs.readFile(path, "utf-8");
        res.setHeader("Content-Type", contentType);
        res.end(data);
    } catch (error) {
        res.statusCode = 500;
        res.end();
    }
}

server.listen(8008, () => {
    console.log("server running on port 8008");
});
