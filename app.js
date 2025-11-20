const express = require("express");
const http = require("http");
const {Server} = require("socket.io");
const db = require("./utils/firebase-RTDB.js");
const ejsLayout = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");

// develompment lib
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

    socket.on("admin-dashboard-request-charts", () => {
        db.ref("kandidat").on("value", (snapshot) => {
            if(!!snapshot.val()){
                socket.emit("admin-polling-update", {
                    lables: Object.keys(snapshot.val()), 
                    data: Object.values(snapshot.val()).map(item => item.suara)
                });
            }
        });
        db.ref("TPS").on("value", (snapshot) => {
            if(!!snapshot.val()){
                socket.emit("admin-tps-update", {
                    labels: Object.keys(snapshot.val()), 
                    data: Object.values(snapshot.val()).map(item => item.suara),
                    status: Object.values(snapshot.val()).map(item => item.status)
                });
            }
        });
    });

    socket.on("admin-candidate-request-candidate", () => {
        db.ref("kandidat").on("value", (snapshot) => {
            if(!!snapshot.val()){
                socket.emit("admin-candidate-update-candidate", {...snapshot.val()});
            }
        });
    });

    socket.on("admin-tps-request-tps", () => {
        db.ref("TPS").on("value", (snapshot) => {
            console.log(snapshot.val())
            if(!!snapshot.val()){
                socket.emit("admin-tps-update-tps", {...snapshot.val()});
            }
        });
    });

    socket.on("admin-tps-send-status", (tps) => {
        if(tps.id){
            db.ref(`TPS/${tps.id}`).update({
                status: tps.status
            });
        }
    })
});


chokidar.watch(["views", "public"]).on("change", path => {
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
    res.render("pages/dashboard", {
        layout: isFetch(req) ? false : "layouts/mainLayout",
        title: "Dashboard - Smansekata Vote",
        page: "Dashboard",
        kandidat,
        totalKandidat: dataKandidat.numChildren()
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
app.get("/admin/voter", (req, res) => {
    res.render("pages/voter", {
        layout: isFetch(req) ? false : "layouts/mainLayout",
        title: "Manajemen Pemilih - Smansekata Vote",
        page: "Manajemen Pemilih"
    });
});

app.get("/admin/add-candidate", (req, res) => {
    res.render("pages/attachment/addCandidate", {
        layout: isFetch(req) ? false : "layouts/mainLayout",
        title: "Tambah Kandidat - Smansekata Vote",
        page: "Tambah Kandidat"
    });
});

app.get("/", (req, res) => {
    res.json({msg: 'page under maintenance'});
});



server.listen(80, () => {
    console.log("server running");
});