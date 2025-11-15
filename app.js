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

// vars ----------------------
db.ref("kandidat").on("value", (snapshot) => {
    let kandidat = snapshot.val();
    let lables = Object.keys(kandidat);
    let data = Object.values(kandidat).map(item => item.suara); 
    io.emit("dashboard-polling-update", {lables, data});
});

db.ref("TPS").on("value", (snapshot) => {});

// db.ref()
async function renameKey(path, oldKey, newKey) {
    const ref = db.ref(path);
    const snapshot = await ref.child(oldKey).once("value");
    if (!snapshot.exists()) return;
    const oldData = snapshot.val();
    // buat key baru
    await ref.child(newKey).set(oldData);
    // hapus key lama
    await ref.child(oldKey).remove();
}


io.on("connection", async (socket) => {
    const endpoint = socket.handshake.headers.referer.split("/");
    if(endpoint[3] == "dashboard"){
        db.ref("kandidat").once("value", (snapshot) => {
            let kandidat = snapshot.val();
            let lables = Object.keys(kandidat);
            let data = Object.values(kandidat).map(item => item.suara); 
            socket.emit("admin-polling-update", {lables: lables, data:data});
            // console.log("success");
            // io.emit("polling-update", {lables, data});
        });
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

app.get("/admin/dashboard", async (req, res) => {
    const dataKandidat = await db.ref("kandidat").once("value");
    const kandidat = dataKandidat.val(); 
    kandidat.total = dataKandidat.numChildren();
    res.render("pages/dashboard", {
        layout: isFetch(req) ? false : "layouts/mainLayout",
        title: "Dashboard - Smansekata Vote",
        page: "Dashboard",
        kandidat
    });
});
app.get("/admin/candidate", (req, res) => {
    res.render("pages/candidate", {
        layout: isFetch(req) ? false : "layouts/mainLayout",
        title: "Candidate - Smansekata Vote",
        page: "Daftar Kandidat"
    });
});
app.get("/admin/tps", (req, res) => {
    res.render("pages/tps", {
        layout: isFetch(req) ? false : "layouts/mainLayout",
        title: "TPS - Smansekata Vote",
        page: "TPS"
    });
});
app.get("/admin/settings", (req, res) => {
    res.render("pages/settings", {
        layout: isFetch(req) ? false : "layouts/mainLayout",
        title: "Pengaturan - Smansekata Vote",
        page: "Pengaturan"
    });
});
app.get("/admin/reports", (req, res) => {
    res.render("pages/reports", {
        layout: isFetch(req) ? false : "layouts/mainLayout",
        title: "Hasil dan Laporan - Smansekata Vote",
        page: "Hasil dan Laporan"
    });
});
app.get("/admin/log", (req, res) => {
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