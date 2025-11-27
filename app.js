const express = require("express");
const http = require("http");
const {Server} = require("socket.io");
const db = require("./utils/firebase-RTDB.js");
const ejsLayout = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const {verifyAdminAuth, verifyTPSAuth} = require("./utils/jwtAuth.js");

const app = express();

app.set('view engine', 'ejs');
app.use(ejsLayout);
app.use(cookieParser());
app.use(express.static(__dirname+"/public"));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

const upload = multer({storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "public/img/kandidat/");
        },
        filename: (req, file, cb) => {
            cb(null, Date.now()+path.extname(file.originalname));
        }
    }) 
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

function generate6digit(){
    return Math.floor(Math.random()* ((999999 - 100000) +1) + 100000);
}

let totalCandidate = 0;
let totalTPS = 0;
io.on("connection", async (socket) => {
    socket.on("admin-dashboard-request-charts", () => {
        db.ref("kandidat").on("value", (snapshot) => {
            totalCandidate = snapshot.numChildren();
            if(!!snapshot.val()){
                socket.emit("admin-polling-update", {
                    lables: Object.keys(snapshot.val()), 
                    data: Object.values(snapshot.val()).map(item => item.suara)
                });
            }
        });
        db.ref("TPS").on("value", (snapshot) => {
            totalTPS = snapshot.numChildren();
            if(!!snapshot.val()){
                socket.emit("admin-tps-update", {
                    labels: Object.keys(snapshot.val()), 
                    data: Object.values(snapshot.val()).map(item => item.suara),
                    status: Object.values(snapshot.val()).map(item => item.status),
                    tpsAktif: snapshot.numChildren()
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
            if(!!snapshot.val()){
                socket.emit("admin-tps-update-tps", {...snapshot.val()});
            }
        });
    });

    socket.on("admin-tps-send-status", (tps) => {
        db.ref(`TPS/${tps.id}`).update({
            status: tps.status,
        });
    });

    socket.on("admin-tps-add-tps", (tps) => {
        if(tps){
            db.ref(`TPS/${tps}`).set({
                status: 0,
                suara: 0,
                token: generate6digit()
            });
        }
    });

    socket.on("admin-tps-delete-tps", (tps) => {
        if(tps){
            db.ref(`TPS/${tps}`).remove();
        }
    });

    socket.on("tps-vote", (data) => {
        // console.log(data.candidateID);
        db.ref(`kandidat/${data.candidateID}`).once("value", (s) => {
            db.ref(`kandidat/${data.candidateID}`).update({
                suara: s.val().suara + 1
            });
        });
        db.ref(`TPS/${data.tpsID}`).once("value", (s) => {
            db.ref(`TPS/${data.tpsID}`).update({
                suara: s.val().suara + 1
            });
        });
    });
});


function isFetch(req) {return req.headers["x-requested-with"] === "XMLHttpRequest";}

app.get("/admin/dashboard", verifyAdminAuth, async (req, res) => {
    const dataKandidat = await db.ref("kandidat").once("value");
    const kandidat = dataKandidat.val(); 
    res.render("pages/dashboard", {
        layout: isFetch(req) ? false : "layouts/adminLayout",
        title: "Dashboard - Smansekata Vote",
        page: "Dashboard",
        kandidat,
        totalKandidat: dataKandidat.numChildren()
    });
});
app.get("/admin/candidate", verifyAdminAuth,(req, res) => {
    res.render("pages/candidate", {
        layout: isFetch(req) ? false : "layouts/adminLayout",
        title: "Candidate - Smansekata Vote",
        page: "Daftar Kandidat"
    });
});
app.get("/admin/tps", verifyAdminAuth,(req, res) => {
    res.render("pages/tps", {
        layout: isFetch(req) ? false : "layouts/adminLayout",
        title: "TPS - Smansekata Vote",
        page: "TPS"
    });
});
app.get("/admin/settings", verifyAdminAuth,(req, res) => {
    res.render("pages/settings", {
        layout: isFetch(req) ? false : "layouts/adminLayout",
        title: "Pengaturan - Smansekata Vote",
        page: "Pengaturan"
    });
});
app.get("/admin/reports", verifyAdminAuth,(req, res) => {
    res.render("pages/reports", {
        layout: isFetch(req) ? false : "layouts/adminLayout",
        title: "Hasil dan Laporan - Smansekata Vote",
        page: "Hasil dan Laporan"
    });
});
app.get("/admin/voter", verifyAdminAuth,(req, res) => {
    res.render("pages/voter", {
        layout: isFetch(req) ? false : "layouts/adminLayout",
        title: "Manajemen Pemilih - Smansekata Vote",
        page: "Manajemen Pemilih"
    });
});

app.get("/admin/add-candidate", (req, res) => {
    db.ref("kandidat").once("value", (snapshot) => {
        res.render("pages/attachment/addCandidate", {
            layout: isFetch(req) ? false : "layouts/adminLayout",
            title: "Tambah Kandidat - Smansekata Vote",
            page: "Tambah Kandidat",
            totalCandidate: snapshot.numChildren()
        });
    });
});

app.get("/admin/edit-candidate", (req, res) => {
    const candidateID = req.query.id;
    db.ref(`kandidat/${candidateID}`).once("value", (snapshot) => {
        res.render("pages/attachment/editCandidate", {
            layout: isFetch(req) ? false : "layouts/adminLayout",
            title: `Edit Kandidat ${candidateID} - Smansekata Vote`,
            page: `Edit Kandidat ${candidateID}`,
            candidateID,
            candidateData: snapshot.val()
        });
    });
});

app.get("/login", (req, res) => {
    res.render("pages/login", {
        layout: isFetch(req) ? false : "layouts/tpsLayout",
        title: "TPS Login - Smansekata Vote",
        page: "Login",
    });
});


app.get("/TPS/dashboard", (req, res) => {
    res.render("pages/tps/tpsDashboard", {
        layout: isFetch(req) ? false : "layouts/tpsLayout",
        title: "TPS Dashboard - Smansekata Vote",
        page: "TPS Dashboard"
    });
});

app.get("/TPS/vote", verifyTPSAuth,(req, res) => {
    db.ref("kandidat").once("value", (snapshot) => {
        res.render("pages/tps/tpsVote", {
            layout: isFetch(req) ? false : "layouts/tpsLayout",
            title: "TPS Dashboard - Smansekata Vote",
            page: "TPS vote",
            candidate: snapshot.val(),
            tpsID: req.tpsID
        });
    });
});

app.get("/admin/login", (req, res) => {
    res.render("pages/adminLogin", {
        layout: "layouts/tpsLayout",
        page: "Login",
        title: "Admin Login - Smansekata Vote"
    });
});



app.get("/", (req, res) => {
    res.redirect("/login")
});




app.post("/forms/candidate/add", upload.single("foto"), (req, res) => {
    db.ref(`kandidat/kandidat ${req.body.kandidat}`).once("value", (snapshot) => {
        if(snapshot.val()){
            fs.unlinkSync(req.file.path);
            res.json({result: 2});
        } else {
            db.ref(`kandidat/kandidat ${req.body.kandidat}`).set({
                nama: req.body.nama,
                kelas: req.body.kelas,
                visi: req.body.visi,
                misi: req.body.misi,
                foto: `/img/kandidat/${req.file.filename}`,
                suara: 0
            });
            res.json({result: true});
        }
    });
});

app.post("/forms/candidate/edit", upload.single("foto"), (req, res) => {
    db.ref(`kandidat/kandidat ${req.body.kandidat}`).set({
        nama: req.body.nama,
        kelas: req.body.kelas,
        visi: req.body.visi,
        misi: req.body.misi,
        foto: `/img/kandidat/${req.file.filename}`,
        suara: 0
    });
});

app.post("/forms/candidate/delete", (req, res) => {
    db.ref(`kandidat/${req.body.candidateID}`).remove();
    res.json({result: true});
});

app.post("/forms/tps/vote", (req, res) => {
    const kandidatRef = db.ref(`kandidat/${req.body.candidateID}`);
    kandidatRef.once("value", (snapshot) => {
        if(snapshot.val()){ 
            const currentVotes = snapshot.val().suara || 0;
            kandidatRef.update({
                suara: currentVotes + 1
            });
            const tpsRef = db.ref(`TPS/${req.body.tpsID}`);
            tpsRef.once("value", (tpsSnapshot) => {
                if(tpsSnapshot.val()){
                    const currentTPSVotes = tpsSnapshot.val().suara || 0;
                    tpsRef.update({
                        suara: currentTPSVotes + 1,
                        status: 2
                    });
                    res.json({result: true});
                } else {
                    res.json({result: false, message: "TPS not found"});
                }
            });
        } else {
            res.json({result: false, message: "Candidate not found"});
        }   
    });
});

app.post("/tps/login", (req, res) => {
    db.ref(`TPS/${req.body.tps}`).once("value", (snapshot) => {
        if(snapshot.val()){
            if(snapshot.val().token == req.body.token){
                  res.cookie("tpsToken", jwt.sign({tpsID: req.body.tps}, process.env.JWT_SECRET, {expiresIn: '1d'}), {
                    httpOnly: true, 
                    secure: false,
                    sameSite: "lax",
                    maxAge: 24 * 60 * 60 * 1000,
                    path: "/"
                });
                res.json({result: true});
            } else {
                res.json({result: false, message: "Invalid token"});
            }
        } else {
            res.json({result: false, message: "TPS not found"});
        }
    });
});

app.post("/admin/login", (req,res) => {
    db.ref("Users/1").once("value", (s) => {
        const username = s.val().username;
        const password = s.val().password;
        if(username == req.body.username && password == req.body.password){
            res.cookie("token", jwt.sign({user: username}, process.env.JWT_SECRET, {expiresIn: '1d'}), {
              httpOnly: true, 
              secure: false,
              sameSite: "lax",
              maxAge: 24 * 60 * 60 * 1000,
              path: "/"
            });
            res.json({result: true});
        } else {
            res.json({result: false, message: "Username atau password salah"});
        }
    });
});

app.post("/logout", (req, res) => {
    res.clearCookie("token", {path: "/"});
    res.clearCookie("tpsToken", {path: "/"});
    res.json({msg: 1})
});


// GET API
app.get("/api/get/tps", (req, res) => {
    db.ref("TPS").once("value", (d) => {
        res.json(d.val() ? Object.keys(d.val()) : null);
    });
});


server.listen(80, () => {
    console.log("server running");
});