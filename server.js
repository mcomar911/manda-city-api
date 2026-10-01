const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = 3000;

const DATA_DIR = path.join(__dirname, "data");

const PLAYERS_FILE = path.join(DATA_DIR, "players.json");
const MISSIONS_FILE = path.join(DATA_DIR, "missions.json");
const NEWS_FILE = path.join(DATA_DIR, "news.json");
const SERVER_FILE = path.join(DATA_DIR, "server.json");

app.use(cors());
app.use(express.json());


/* ==========================================
   DATA SYSTEM
========================================== */

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, {
        recursive: true
    });
}


function readJSON(file, fallback) {

    try {

        if (!fs.existsSync(file)) {

            fs.writeFileSync(
                file,
                JSON.stringify(
                    fallback,
                    null,
                    4
                )
            );

            return fallback;
        }

        return JSON.parse(
            fs.readFileSync(
                file,
                "utf8"
            )
        );

    } catch (error) {

        console.error(
            "JSON READ ERROR:",
            file,
            error
        );

        return fallback;
    }
}


function writeJSON(file, data) {

    fs.writeFileSync(
        file,
        JSON.stringify(
            data,
            null,
            4
        )
    );

}


/* ==========================================
   DEFAULT DATA
========================================== */

const defaultPlayers = [];

const defaultMissions = [

    {
        id: 1,
        type: "daily",
        title: "المقاتل اليومي",
        description: "أكمل 5 مباريات كاملة.",
        xp: 500,
        target: 5
    },

    {
        id: 2,
        type: "daily",
        title: "المحارب المستمر",
        description: "العب لمدة 90 دقيقة داخل المباريات.",
        xp: 750,
        target: 90
    },

    {
        id: 3,
        type: "daily",
        title: "الهدف الرئيسي",
        description: "أكمل 3 أهداف رئيسية في المباريات.",
        xp: 600,
        target: 3
    },

    {
        id: 4,
        type: "daily",
        title: "انتصارات متتالية",
        description: "حقق 3 انتصارات خلال اليوم.",
        xp: 900,
        target: 3
    },

    {
        id: 5,
        type: "weekly",
        title: "حملة الأسبوع",
        description: "أكمل 25 مباراة خلال الأسبوع.",
        xp: 2500,
        target: 25
    },

    {
        id: 6,
        type: "weekly",
        title: "المحارب المخضرم",
        description: "العب 8 ساعات خلال الأسبوع.",
        xp: 3000,
        target: 480
    },

    {
        id: 7,
        type: "weekly",
        title: "سلسلة الانتصارات",
        description: "حقق 10 انتصارات خلال الأسبوع.",
        xp: 3500,
        target: 10
    },

    {
        id: 8,
        type: "weekly",
        title: "الخبير",
        description: "أكمل 10 مهام يومية خلال الأسبوع.",
        xp: 4000,
        target: 10
    },

    {
        id: 9,
        type: "monthly",
        title: "حملة الشهر",
        description: "أكمل 100 مباراة خلال الشهر.",
        xp: 10000,
        target: 100
    },

    {
        id: 10,
        type: "monthly",
        title: "النخبة",
        description: "حقق 50 انتصارًا خلال الشهر.",
        xp: 15000,
        target: 50
    },

    {
        id: 11,
        type: "monthly",
        title: "المحارب الكبير",
        description: "العب 30 ساعة خلال الشهر.",
        xp: 12500,
        target: 1800
    },

    {
        id: 12,
        type: "special",
        title: "الأسطورة",
        description: "أكمل مجموعة من المهام الصعبة.",
        xp: 25000,
        target: 1
    }

];


const defaultNews = [

    {
        id: 1,
        date: "2026-10-01",
        title: "إطلاق MANDA CITY ONLINE",
        text: "بدأ تطوير المرحلة الأولى من اللعبة وأنظمتها الأساسية."
    },

    {
        id: 2,
        date: "2026-10-01",
        title: "نظام المستويات",
        text: "تم تجهيز نظام XP من Level 1 إلى Level 100."
    },

    {
        id: 3,
        date: "2026-10-01",
        title: "نظام السيرفرات",
        text: "يجري العمل على نظام السيرفرات وأنماط الحروب."
    }

];


const defaultServer = {

    connected: false,

    online: false,

    players: 0,

    maxPlayers: 0,

    ping: null,

    name: "MANDA CITY ONLINE",

    updatedAt: null

};


/* إنشاء الملفات */

readJSON(
    PLAYERS_FILE,
    defaultPlayers
);

readJSON(
    MISSIONS_FILE,
    defaultMissions
);

readJSON(
    NEWS_FILE,
    defaultNews
);

readJSON(
    SERVER_FILE,
    defaultServer
);


/* ==========================================
   XP SYSTEM
========================================== */

function requiredXP(level) {

    if (level <= 1) {
        return 0;
    }

    return Math.floor(
        100 * Math.pow(
            level - 1,
            1.45
        )
    );

}


function calculateLevel(xp) {

    let level = 1;

    for (
        let i = 1;
        i <= 100;
        i++
    ) {

        if (
            xp >= requiredXP(i)
        ) {
            level = i;
        }

    }

    return level;

}


/* ==========================================
   API
========================================== */


/*
GET /
*/

app.get("/", (req, res) => {

    res.json({

        name: "MANDA CITY ONLINE API",

        status: "running",

        version: "1.0.0",

        endpoints: [

            "/api/server",

            "/api/news",

            "/api/missions",

            "/api/players",

            "/api/leaderboard",

            "/api/player/:id"

        ]

    });

});


/*
GET SERVER
*/

app.get(
    "/api/server",
    (req, res) => {

        const server =
            readJSON(
                SERVER_FILE,
                defaultServer
            );

        res.json(server);

    }
);


/*
UPDATE SERVER
*/

app.post(
    "/api/server",
    (req, res) => {

        const old =
            readJSON(
                SERVER_FILE,
                defaultServer
            );


        const updated = {

            ...old,

            ...req.body,

            updatedAt:
                new Date().toISOString()

        };


        writeJSON(
            SERVER_FILE,
            updated
        );


        res.json({
            success: true,
            server: updated
        });

    }
);


/*
GET NEWS
*/

app.get(
    "/api/news",
    (req, res) => {

        const news =
            readJSON(
                NEWS_FILE,
                defaultNews
            );

        res.json(news);

    }
);


/*
ADD NEWS
*/

app.post(
    "/api/news",
    (req, res) => {

        const news =
            readJSON(
                NEWS_FILE,
                defaultNews
            );


        const item = {

            id:
                Date.now(),

            date:
                req.body.date ||
                new Date()
                    .toISOString()
                    .slice(0, 10),

            title:
                req.body.title ||
                "خبر جديد",

            text:
                req.body.text ||
                ""

        };


        news.unshift(item);


        writeJSON(
            NEWS_FILE,
            news
        );


        res.status(201).json({
            success: true,
            news: item
        });

    }
);


/*
GET MISSIONS
*/

app.get(
    "/api/missions",
    (req, res) => {

        const missions =
            readJSON(
                MISSIONS_FILE,
                defaultMissions
            );

        res.json(missions);

    }
);


/*
GET ALL PLAYERS
*/

app.get(
    "/api/players",
    (req, res) => {

        const players =
            readJSON(
                PLAYERS_FILE,
                defaultPlayers
            );

        res.json(players);

    }
);


/*
GET LEADERBOARD
*/

app.get(
    "/api/leaderboard",
    (req, res) => {

        const players =
            readJSON(
                PLAYERS_FILE,
                defaultPlayers
            );


        const leaderboard =
            [...players]

                .sort(
                    (a, b) =>
                        (b.xp || 0) -
                        (a.xp || 0)
                )

                .map(
                    player => ({

                        id:
                            player.id,

                        username:
                            player.username,

                        xp:
                            player.xp || 0,

                        level:
                            calculateLevel(
                                player.xp || 0
                            )

                    })
                );


        res.json(
            leaderboard
        );

    }
);


/*
GET PLAYER
*/

app.get(
    "/api/player/:id",
    (req, res) => {

        const players =
            readJSON(
                PLAYERS_FILE,
                defaultPlayers
            );


        const player =
            players.find(
                item =>
                    String(item.id) ===
                    String(req.params.id)
            );


        if (!player) {

            return res
                .status(404)
                .json({

                    success: false,

                    error:
                        "PLAYER_NOT_FOUND"

                });

        }


        res.json({

            ...player,

            level:
                calculateLevel(
                    player.xp || 0
                )

        });

    }
);


/*
CREATE PLAYER
*/

app.post(
    "/api/player",
    (req, res) => {

        const players =
            readJSON(
                PLAYERS_FILE,
                defaultPlayers
            );


        const player = {

            id:
                req.body.id ||
                Date.now(),

            username:
                req.body.username ||
                "Player",

            xp:
                Number(req.body.xp) ||
                0,

            createdAt:
                new Date().toISOString()

        };


        players.push(
            player
        );


        writeJSON(
            PLAYERS_FILE,
            players
        );


        res.status(201).json({

            success: true,

            player: {

                ...player,

                level:
                    calculateLevel(
                        player.xp
                    )

            }

        });

    }
);


/*
ADD XP
*/

app.post(
    "/api/player/:id/xp",
    (req, res) => {

        const players =
            readJSON(
                PLAYERS_FILE,
                defaultPlayers
            );


        const player =
            players.find(
                item =>
                    String(item.id) ===
                    String(req.params.id)
            );


        if (!player) {

            return res
                .status(404)
                .json({

                    success: false,

                    error:
                        "PLAYER_NOT_FOUND"

                });

        }


        const amount =
            Number(req.body.amount);


        if (
            !Number.isFinite(amount) ||
            amount <= 0
        ) {

            return res
                .status(400)
                .json({

                    success: false,

                    error:
                        "INVALID_XP"

                });

        }


        player.xp =
            Number(player.xp || 0) +
            amount;


        writeJSON(
            PLAYERS_FILE,
            players
        );


        res.json({

            success: true,

            player: {

                ...player,

                level:
                    calculateLevel(
                        player.xp
                    )

            }

        });

    }
);


/* ==========================================
   START
========================================== */

app.listen(
    PORT,
    () => {

        console.log("");
        console.log(
            "================================"
        );

        console.log(
            " MANDA CITY ONLINE API"
        );

        console.log(
            ` http://127.0.0.1:${PORT}`
        );

        console.log(
            "================================"
        );

        console.log("");

    }
);