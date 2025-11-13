const express = require("express");
const cors = require("cors");
const http = require("http");
const {Server} = require("socket.io");
const db = require("./utils/firebase-RTDB.js");
const ejsLayout = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const WebSocket = require("ws");
const chokidar = require("chokidar");

const app = express();

app.set('view engine', 'ejs');
app.use(ejsLayout);
app.use(cookieParser());
app.use(express.static(__dirname+"/public"));
const server = http.createServer(app);

const wss = new WebSocket.Server({server});
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

chokidar.watch("views").on("change", path => {
    wss.clients.forEach(client =>{
        if (client.readyState === WebSocket.OPEN) {
            client.send("reload");
        }
    });
});

function isFetch(req) {return req.headers["x-requested-with"] === "XMLHttpRequest";}

app.get("/dashboard", (req, res) => {
    res.render("pages/dashboard", {
        layout: isFetch(req) ? false : "layouts/mainLayout",
        title: "Dashboard - Smansekata Vote",
        page: "Dashboard"
    });
});
app.get("/candidate", (req, res) => {
    res.render("pages/candidate", {
        layout: isFetch(req) ? false : "layouts/mainLayout",
        title: "Candidate - Smansekata Vote",
        page: "Daftar Kandidat"
    });
});
app.get("/tps", (req, res) => {
    res.render("pages/tps", {
        layout: isFetch(req) ? false : "layouts/mainLayout",
        title: "TPS - Smansekata Vote",
        page: "TPS"
    });
});
app.get("/settings", (req, res) => {
    res.render("pages/settings", {
        layout: isFetch(req) ? false : "layouts/mainLayout",
        title: "Pengaturan - Smansekata Vote",
        page: "Pengaturan"
    });
});
app.get("/reports", (req, res) => {
    res.render("pages/reports", {
        layout: isFetch(req) ? false : "layouts/mainLayout",
        title: "Hasil dan Laporan - Smansekata Vote",
        page: "Hasil dan Laporan"
    });
});
app.get("/log", (req, res) => {
    res.render("pages/log", {
        layout: isFetch(req) ? false : "layouts/mainLayout",
        title: "Log Aktivitas - Smansekata Vote",
        page: "Log Aktivitas"
    });
});

app.get("/", (req, res) => {
    res.json({msg: 'page under maintenance'});
});

server.listen(80, () => {
    console.log("server running");
});