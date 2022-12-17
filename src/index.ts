import * as express from "express"
import * as bodyParser from "body-parser"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { Routes } from "./routes"
import { Player } from "./entity/Player"
import { Team } from "./entity/Team"
import { Game, GameStatus } from "./entity/Game"
import { Map, MapStatus } from "./entity/Map"
import { New } from "./entity/New"
const dgram = require('dgram');



AppDataSource.initialize().then(async () => {

    // create express app
    const app = express()
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(bodyParser.json());

    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next)
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)

            } else if (result !== null && result !== undefined) {
                res.json(result)
            }
        })
    })

    // setup express app here
    // ...

    // start express server
    app.listen(process.env.PORT || 4000)

    //init()
    //test()
    //initQuals()
    const server = dgram.createSocket('udp4');

    server.on('error', (err) => {
        console.error(`server error:\n${err.stack}`);
        server.close();
    });

    server.on('message', (msg, rinfo) => {
        console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    });

    server.on('listening', () => {
        const address = server.address();
        console.log(`server listening ${address.address}:${address.port}`);
      });

      server.bind(3000);


    console.log(`Express server has started on port ${process.env.PORT || 4000}`)

}).catch(error => console.log(error))

async function test() {
    let team_1 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Team, {
            name: "Drift Test 1",
            country: "Россия",
            city: "Владивосток",
            logo: "url"
        })
    )

    let team_2 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Team, {
            name: "Drift Test 2",
            country: "Россия",
            city: "Владивосток",
            logo: "url"
        })
    )

    let player_anton = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "AntonioGodfather",
            age: 25,
            firstName: "Антон",
            lastName: "Алексеев",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:1:36261249",
            team: team_1
        })
    )

    let player_danello = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "Danello",
            age: 25,
            firstName: "sdf",
            lastName: "sdf",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:0:10847058",
            team: team_2
        })
    )
}

async function initQuals() {
    initBaks()
    initFlowstate()
    initKINQIE()
    initLF0()
    initPlatoon()
    initTestosteron()
    initToxixWorld()
    initYnt()
}

async function initLF0() {
    let team_LF0 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Team, {
            name: "LF0",
            country: "Россия",
            city: "",
            logo: ""
        })
    )

    let player_1 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "JACKPOT",
            age: 23,
            firstName: "Владимир",
            lastName: "Дьяконов",
            country: "Россия",
            imageUrl: "",
            steamId: "STEAM_1:1:73691192",
            team: team_LF0
        })
    )

    let player_2 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "lesswill",
            age: 25,
            firstName: "Дмитрий",
            lastName: "Медведев",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:0:21046441",
            team: team_LF0
        })
    )

    let player_3 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "HUckLer",
            age: 20,
            firstName: "Николай",
            lastName: "Рудов",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:0:93315583",
            team: team_LF0
        })
    )

    let player_4 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "Kiro",
            age: 20,
            firstName: "Александр",
            lastName: "Шеров",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:0:92751545",
            team: team_LF0
        })
    )

    let player_5 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "sp1nt",
            age: 22,
            firstName: "Глеб",
            lastName: "Горелов",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:0:103381140",
            team: team_LF0
        })
    )
}

async function initFlowstate() {
    let team_Flowstate = await AppDataSource.manager.save(
        AppDataSource.manager.create(Team, {
            name: "Flowstate",
            country: "Россия",
            city: "",
            logo: ""
        })
    )

    let player_1 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "Kaide",
            age: 22,
            firstName: "Эдуард",
            lastName: "Татаринов",
            country: "Россия",
            imageUrl: "",
            steamId: "STEAM_1:0:429765397",
            team: team_Flowstate
        })
    )

    let player_2 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "Sowalio",
            age: 18,
            firstName: "Максим",
            lastName: "Бекетов",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:0:537114719",
            team: team_Flowstate
        })
    )

    let player_3 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "sFade8",
            age: 18,
            firstName: "Виталий",
            lastName: "Марушка",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:1:502177735",
            team: team_Flowstate
        })
    )

    let player_4 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "L1GH7n1nG",
            age: 22,
            firstName: "Любарец",
            lastName: "Виталий",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:0:75496382",
            team: team_Flowstate
        })
    )

    let player_5 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "Aw",
            age: 16,
            firstName: "Андрей",
            lastName: "Анисимов",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:1:154547905",
            team: team_Flowstate
        })
    )
}

async function initKINQIE() {
    let team_KINQIE = await AppDataSource.manager.save(
        AppDataSource.manager.create(Team, {
            name: "KINQIE",
            country: "Россия",
            city: "",
            logo: ""
        })
    )

    let player_1 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "9makasi",
            age: 22,
            firstName: "Данила",
            lastName: "Бекшенев",
            country: "Россия",
            imageUrl: "",
            steamId: "STEAM_1:1:114275631",
            team: team_KINQIE
        })
    )

    let player_2 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "executor",
            age: 18,
            firstName: "Илья",
            lastName: "Вебер",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:1:567452807",
            team: team_KINQIE
        })
    )

    let player_3 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "nota",
            age: 15,
            firstName: "Эмиль",
            lastName: "Москвитин",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:1:507402149",
            team: team_KINQIE
        })
    )

    let player_4 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "L1GH7n1nG",
            age: 22,
            firstName: "Любарец",
            lastName: "Виталий",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:0:75496382",
            team: team_KINQIE
        })
    )

    let player_5 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "Aw",
            age: 16,
            firstName: "Андрей",
            lastName: "Анисимов",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:1:154547905",
            team: team_KINQIE
        })
    )
}

async function initPlatoon() {
    let team_Platoon = await AppDataSource.manager.save(
        AppDataSource.manager.create(Team, {
            name: "Platoon",
            country: "Россия",
            city: "",
            logo: ""
        })
    )

    let player_1 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "m1QUSE",
            age: 15,
            firstName: "Денис",
            lastName: "Карпович",
            country: "Россия",
            imageUrl: "",
            steamId: "STEAM_1:0:435938437",
            team: team_Platoon
        })
    )

    let player_2 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "norr0",
            age: 17,
            firstName: "Станислав",
            lastName: "Дервоед",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:1:518803622",
            team: team_Platoon
        })
    )

    let player_3 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "Ch1psik",
            age: 17,
            firstName: "Александр",
            lastName: "Горбачев",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:1:124785849",
            team: team_Platoon
        })
    )

    let player_4 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "senka",
            age: 17,
            firstName: "Арсений",
            lastName: "Козловский",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:0:538010099",
            team: team_Platoon
        })
    )

    let player_5 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "FenomeN",
            age: 18,
            firstName: "Илья",
            lastName: "Колодько",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:0:220276019",
            team: team_Platoon
        })
    )
}

async function initYnt() {
    let team_Ynt = await AppDataSource.manager.save(
        AppDataSource.manager.create(Team, {
            name: "Ynt",
            country: "Россия",
            city: "",
            logo: ""
        })
    )

    let player_1 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "Gospadarov",
            age: 22,
            firstName: "Кирилл",
            lastName: "Госпадаров",
            country: "Россия",
            imageUrl: "",
            steamId: "STEAM_0:1:147480129",
            team: team_Ynt
        })
    )

    let player_2 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "bluewhite",
            age: 18,
            firstName: "Лубсан",
            lastName: "Мулонов",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_0:0:508307753",
            team: team_Ynt
        })
    )

    let player_3 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "HeaveN",
            age: 19,
            firstName: "Егор",
            lastName: "Ковалёв",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_0:1:103264864",
            team: team_Ynt
        })
    )

    let player_4 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "VILBy",
            age: 17,
            firstName: "Виталий",
            lastName: "Захарюта",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_0:0:137444524",
            team: team_Ynt
        })
    )

    let player_5 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "z1Nny",
            age: 19,
            firstName: "Павел",
            lastName: "Прокопьев",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_0:0:138388967",
            team: team_Ynt
        })
    )
}

async function initTestosteron() {
    let team_Testosteron = await AppDataSource.manager.save(
        AppDataSource.manager.create(Team, {
            name: "Testosteron",
            country: "Россия",
            city: "",
            logo: ""
        })
    )

    let player_1 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "la3euka",
            age: 21,
            firstName: "Владимир",
            lastName: "Шурыгин",
            country: "Россия",
            imageUrl: "",
            steamId: "STEAM_0:1:63622532",
            team: team_Testosteron
        })
    )

    let player_2 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "rorik",
            age: 18,
            firstName: "Вячеслав",
            lastName: "Литвиненко",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:0:135650666",
            team: team_Testosteron
        })
    )

    let player_3 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "xnkka",
            age: 21,
            firstName: "Данил",
            lastName: "Крючков",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_0:0:95803890",
            team: team_Testosteron
        })
    )

    let player_4 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "m3tiks",
            age: 21,
            firstName: "Андрей",
            lastName: "Остапенко",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:0:128231506",
            team: team_Testosteron
        })
    )

    let player_5 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "ZzZoOm",
            age: 20,
            firstName: "Михаил",
            lastName: "Андреев",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:0:101927716",
            team: team_Testosteron
        })
    )
}

async function initBaks() {
    let team_Baks = await AppDataSource.manager.save(
        AppDataSource.manager.create(Team, {
            name: "Baks",
            country: "Россия",
            city: "",
            logo: ""
        })
    )

    let player_1 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "rexxie",
            age: 20,
            firstName: "Данила",
            lastName: "Тихомиров",
            country: "Россия",
            imageUrl: "",
            steamId: "STEAM_0:0:105000689",
            team: team_Baks
        })
    )

    let player_2 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "4X1s",
            age: 18,
            firstName: "Даниил",
            lastName: "Яцык",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:0:54650911",
            team: team_Baks
        })
    )

    let player_3 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "RuFire",
            age: 21,
            firstName: "Алексей",
            lastName: "Бураков",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_0:1:27471320",
            team: team_Baks
        })
    )

    let player_4 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "lov1kus",
            age: 21,
            firstName: "Даниил",
            lastName: "Никитин",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:0:139677878",
            team: team_Baks
        })
    )

    let player_5 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "danistzz",
            age: 20,
            firstName: "Данил",
            lastName: "Росляков",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_0:0:128749624",
            team: team_Baks
        })
    )
}

async function initToxixWorld() {
    let team_ToxixWorld = await AppDataSource.manager.save(
        AppDataSource.manager.create(Team, {
            name: "ToxixWorld",
            country: "Россия",
            city: "",
            logo: ""
        })
    )

    let player_1 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "Xerison",
            age: 20,
            firstName: "Никита",
            lastName: "Сергеев",
            country: "Россия",
            imageUrl: "",
            steamId: "STEAM_1:1:125382401",
            team: team_ToxixWorld
        })
    )

    let player_2 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "s7xWn",
            age: 21,
            firstName: "Никита",
            lastName: "Сазонов",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:0:182920506",
            team: team_ToxixWorld
        })
    )

    let player_3 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "k1ssly",
            age: 20,
            firstName: "Дмитрий",
            lastName: "Гостев",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:1:98300403",
            team: team_ToxixWorld
        })
    )

    let player_4 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "zealot",
            age: 21,
            firstName: "Сергей",
            lastName: "Жукович",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:0:64544944",
            team: team_ToxixWorld
        })
    )

    let player_5 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "NeoLife",
            age: 21,
            firstName: "Новаков",
            lastName: "Алексей",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:0:569495949",
            team: team_ToxixWorld
        })
    )
}

async function init() {



    let news = await AppDataSource.manager.save(
        AppDataSource.manager.create(
            New, {
            title: "title",
            promo: "promo",
            content: "content",
            imageUrl: "url"
        }
        )
    )

    let team_rcl = await AppDataSource.manager.save(
        AppDataSource.manager.create(Team, {
            name: "RCL",
            country: "Россия",
            city: "Москва",
            logo: "url",
        })
    )

    let team_mirai = await AppDataSource.manager.save(
        AppDataSource.manager.create(Team, {
            name: "Mirai",
            country: "Россия",
            city: "Сахалин",
            logo: "url",
        })
    )

    let team_drift_staff = await AppDataSource.manager.save(
        AppDataSource.manager.create(Team, {
            name: "Drift Staff",
            country: "Россия",
            city: "Владивосток",
            logo: "url"
        })
    )

    let team_drift_kids = await AppDataSource.manager.save(
        AppDataSource.manager.create(Team, {
            name: "Drift Kids",
            country: "Россия",
            city: "Владивосток",
            logo: "url"
        })
    )

    // let team_drift_kids_2 = await AppDataSource.manager.save(
    //     AppDataSource.manager.create(Team, {
    //         name: "Drift Kids 2",
    //         country: "Россия",
    //         city: "Владивосток",
    //         logo: "url"
    //     })
    // )

    // insert new users for test
    let player_anton = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "AntonioGodfather",
            age: 25,
            firstName: "Антон",
            lastName: "Алексеев",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:1:36261249",
            team: team_rcl
        })
    )

    let player_obn = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "OBN",
            age: 22,
            firstName: "Александр",
            lastName: "Обновлённый",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:0:23469352",
            team: team_rcl
        })
    )

    let player_grisha = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "korde",
            age: 20,
            firstName: "Григорий",
            lastName: "Михайлов",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:1:431045157",
            team: team_drift_staff
        })
    )

    let player_borya = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "jboris",
            age: 18,
            firstName: "Борис",
            lastName: "Пятница",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:0:455798721",
            team: team_drift_staff
        })
    )

    let player_jenya = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "DelianBTW",
            age: 21,
            firstName: "Евгений",
            lastName: "Выходец",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:1:717580636",
            team: team_drift_staff
        })
    )

    let player_andrey = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "m1b",
            age: 20,
            firstName: "Андрей",
            lastName: "Авдеев",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:0:73838588",
            team: team_drift_staff
        })
    )

    let player_aqua = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "aqua",
            age: 21,
            firstName: "Андрей",
            lastName: "mYb",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:1:182066335",
            team: team_drift_staff
        })
    )

    let player_madron = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "M4dron",
            age: 12,
            firstName: "Марк",
            lastName: "Андрончик",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:0:618991361",
            team: team_rcl
        })
    )

    let player_chillh = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "chillh",
            age: 15,
            firstName: "Михаил",
            lastName: "Докучаев",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:0:125693568",
            team: team_drift_kids
        })
    )

    let player_senpai = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "Senpa1",
            age: 15,
            firstName: "Никита",
            lastName: "Иус",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:1:588664180",
            team: team_drift_kids
        })
    )

    let player_apollo = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "apollo",
            age: 21,
            firstName: "Владимир",
            lastName: "-",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:0:527726202",
            team: team_rcl
        })
    )

    let player_lav = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "MarttiniX",
            age: 15,
            firstName: "Алексей",
            lastName: "Лаврух",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:1:562950999",
            team: team_drift_kids
        })
    )

    let player_yawallner = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "yawallner",
            age: 17,
            firstName: "Роман",
            lastName: "Кон",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:0:142784600",
            team: team_mirai
        })
    )

    let player_n1zu = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "n1zu",
            age: 21,
            firstName: "Никита",
            lastName: "Зубков",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:0:95685864",
            team: team_mirai
        })
    )

    let player_sN3eze = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "sN3eze",
            age: 22,
            firstName: "Александр",
            lastName: "Афанасьев",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:0:162587671",
            team: team_mirai
        })
    )

    let player_go1den = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "go1den",
            age: 19,
            firstName: "Никита",
            lastName: "Кравцов",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:1:108906302",
            team: team_mirai
        })
    )

    let player_kLIVIC = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "kLIVIC",
            age: 20,
            firstName: "Виктор",
            lastName: "Климов",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:0:215715314",
            team: team_drift_kids
        })
    )

    let player_vidoq = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "vidoq",
            age: 20,
            firstName: "Виктор",
            lastName: "Манаенков",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "",
            team: team_drift_kids
        })
    )

    let player_n3koh = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "n3koh",
            age: 21,
            firstName: "Герман",
            lastName: "Киселев",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:0:518759503",
            team: team_mirai
        })
    )


}