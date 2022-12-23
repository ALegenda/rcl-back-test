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
    app.use(bodyParser.raw());

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

    // start express server
    app.listen(process.env.PORT || 4000)

    //init()
    //test()
    //initQuals()

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
            nick_name: "AntonioGodfather",
            age: 25,
            first_name: "Антон",
            last_name: "Алексеев",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:1:36261249",
            team: team_1
        })
    )

    let player_danello = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "Danello",
            age: 25,
            first_name: "sdf",
            last_name: "sdf",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:0:10847058",
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
            nick_name: "JACKPOT",
            age: 23,
            first_name: "Владимир",
            last_name: "Дьяконов",
            country: "Россия",
            image_url: "",
            steam_id: "STEAM_1:1:73691192",
            team: team_LF0
        })
    )

    let player_2 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "lesswill",
            age: 25,
            first_name: "Дмитрий",
            last_name: "Медведев",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:0:21046441",
            team: team_LF0
        })
    )

    let player_3 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "HUckLer",
            age: 20,
            first_name: "Николай",
            last_name: "Рудов",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:0:93315583",
            team: team_LF0
        })
    )

    let player_4 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "Kiro",
            age: 20,
            first_name: "Александр",
            last_name: "Шеров",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:0:92751545",
            team: team_LF0
        })
    )

    let player_5 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "sp1nt",
            age: 22,
            first_name: "Глеб",
            last_name: "Горелов",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:0:103381140",
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
            nick_name: "Kaide",
            age: 22,
            first_name: "Эдуард",
            last_name: "Татаринов",
            country: "Россия",
            image_url: "",
            steam_id: "STEAM_1:0:429765397",
            team: team_Flowstate
        })
    )

    let player_2 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "Sowalio",
            age: 18,
            first_name: "Максим",
            last_name: "Бекетов",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:0:537114719",
            team: team_Flowstate
        })
    )

    let player_3 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "sFade8",
            age: 18,
            first_name: "Виталий",
            last_name: "Марушка",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:1:502177735",
            team: team_Flowstate
        })
    )

    let player_4 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "L1GH7n1nG",
            age: 22,
            first_name: "Любарец",
            last_name: "Виталий",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:0:75496382",
            team: team_Flowstate
        })
    )

    let player_5 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "Aw",
            age: 16,
            first_name: "Андрей",
            last_name: "Анисимов",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:1:154547905",
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
            nick_name: "9makasi",
            age: 22,
            first_name: "Данила",
            last_name: "Бекшенев",
            country: "Россия",
            image_url: "",
            steam_id: "STEAM_1:1:114275631",
            team: team_KINQIE
        })
    )

    let player_2 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "executor",
            age: 18,
            first_name: "Илья",
            last_name: "Вебер",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:1:567452807",
            team: team_KINQIE
        })
    )

    let player_3 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "nota",
            age: 15,
            first_name: "Эмиль",
            last_name: "Москвитин",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:1:507402149",
            team: team_KINQIE
        })
    )

    let player_4 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "L1GH7n1nG",
            age: 22,
            first_name: "Любарец",
            last_name: "Виталий",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:0:75496382",
            team: team_KINQIE
        })
    )

    let player_5 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "Aw",
            age: 16,
            first_name: "Андрей",
            last_name: "Анисимов",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:1:154547905",
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
            nick_name: "m1QUSE",
            age: 15,
            first_name: "Денис",
            last_name: "Карпович",
            country: "Россия",
            image_url: "",
            steam_id: "STEAM_1:0:435938437",
            team: team_Platoon
        })
    )

    let player_2 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "norr0",
            age: 17,
            first_name: "Станислав",
            last_name: "Дервоед",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:1:518803622",
            team: team_Platoon
        })
    )

    let player_3 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "Ch1psik",
            age: 17,
            first_name: "Александр",
            last_name: "Горбачев",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:1:124785849",
            team: team_Platoon
        })
    )

    let player_4 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "senka",
            age: 17,
            first_name: "Арсений",
            last_name: "Козловский",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:0:538010099",
            team: team_Platoon
        })
    )

    let player_5 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "FenomeN",
            age: 18,
            first_name: "Илья",
            last_name: "Колодько",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:0:220276019",
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
            nick_name: "Gospadarov",
            age: 22,
            first_name: "Кирилл",
            last_name: "Госпадаров",
            country: "Россия",
            image_url: "",
            steam_id: "STEAM_0:1:147480129",
            team: team_Ynt
        })
    )

    let player_2 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "bluewhite",
            age: 18,
            first_name: "Лубсан",
            last_name: "Мулонов",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_0:0:508307753",
            team: team_Ynt
        })
    )

    let player_3 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "HeaveN",
            age: 19,
            first_name: "Егор",
            last_name: "Ковалёв",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_0:1:103264864",
            team: team_Ynt
        })
    )

    let player_4 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "VILBy",
            age: 17,
            first_name: "Виталий",
            last_name: "Захарюта",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_0:0:137444524",
            team: team_Ynt
        })
    )

    let player_5 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "z1Nny",
            age: 19,
            first_name: "Павел",
            last_name: "Прокопьев",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_0:0:138388967",
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
            nick_name: "la3euka",
            age: 21,
            first_name: "Владимир",
            last_name: "Шурыгин",
            country: "Россия",
            image_url: "",
            steam_id: "STEAM_0:1:63622532",
            team: team_Testosteron
        })
    )

    let player_2 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "rorik",
            age: 18,
            first_name: "Вячеслав",
            last_name: "Литвиненко",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:0:135650666",
            team: team_Testosteron
        })
    )

    let player_3 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "xnkka",
            age: 21,
            first_name: "Данил",
            last_name: "Крючков",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_0:0:95803890",
            team: team_Testosteron
        })
    )

    let player_4 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "m3tiks",
            age: 21,
            first_name: "Андрей",
            last_name: "Остапенко",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:0:128231506",
            team: team_Testosteron
        })
    )

    let player_5 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "ZzZoOm",
            age: 20,
            first_name: "Михаил",
            last_name: "Андреев",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:0:101927716",
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
            nick_name: "rexxie",
            age: 20,
            first_name: "Данила",
            last_name: "Тихомиров",
            country: "Россия",
            image_url: "",
            steam_id: "STEAM_0:0:105000689",
            team: team_Baks
        })
    )

    let player_2 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "4X1s",
            age: 18,
            first_name: "Даниил",
            last_name: "Яцык",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:0:54650911",
            team: team_Baks
        })
    )

    let player_3 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "RuFire",
            age: 21,
            first_name: "Алексей",
            last_name: "Бураков",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_0:1:27471320",
            team: team_Baks
        })
    )

    let player_4 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "lov1kus",
            age: 21,
            first_name: "Даниил",
            last_name: "Никитин",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:0:139677878",
            team: team_Baks
        })
    )

    let player_5 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "danistzz",
            age: 20,
            first_name: "Данил",
            last_name: "Росляков",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_0:0:128749624",
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
            nick_name: "Xerison",
            age: 20,
            first_name: "Никита",
            last_name: "Сергеев",
            country: "Россия",
            image_url: "",
            steam_id: "STEAM_1:1:125382401",
            team: team_ToxixWorld
        })
    )

    let player_2 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "s7xWn",
            age: 21,
            first_name: "Никита",
            last_name: "Сазонов",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:0:182920506",
            team: team_ToxixWorld
        })
    )

    let player_3 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "k1ssly",
            age: 20,
            first_name: "Дмитрий",
            last_name: "Гостев",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:1:98300403",
            team: team_ToxixWorld
        })
    )

    let player_4 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "zealot",
            age: 21,
            first_name: "Сергей",
            last_name: "Жукович",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:0:64544944",
            team: team_ToxixWorld
        })
    )

    let player_5 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "NeoLife",
            age: 21,
            first_name: "Новаков",
            last_name: "Алексей",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:0:569495949",
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
            image_url: "url"
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
            nick_name: "AntonioGodfather",
            age: 25,
            first_name: "Антон",
            last_name: "Алексеев",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:1:36261249",
            team: team_rcl
        })
    )

    let player_obn = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "OBN",
            age: 22,
            first_name: "Александр",
            last_name: "Обновлённый",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:0:23469352",
            team: team_rcl
        })
    )

    let player_grisha = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "korde",
            age: 20,
            first_name: "Григорий",
            last_name: "Михайлов",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:1:431045157",
            team: team_drift_staff
        })
    )

    let player_borya = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "jboris",
            age: 18,
            first_name: "Борис",
            last_name: "Пятница",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:0:455798721",
            team: team_drift_staff
        })
    )

    let player_jenya = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "DelianBTW",
            age: 21,
            first_name: "Евгений",
            last_name: "Выходец",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:1:717580636",
            team: team_drift_staff
        })
    )

    let player_andrey = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "m1b",
            age: 20,
            first_name: "Андрей",
            last_name: "Авдеев",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:0:73838588",
            team: team_drift_staff
        })
    )

    let player_aqua = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "aqua",
            age: 21,
            first_name: "Андрей",
            last_name: "mYb",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:1:182066335",
            team: team_drift_staff
        })
    )

    let player_madron = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "M4dron",
            age: 12,
            first_name: "Марк",
            last_name: "Андрончик",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:0:618991361",
            team: team_rcl
        })
    )

    let player_chillh = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "chillh",
            age: 15,
            first_name: "Михаил",
            last_name: "Докучаев",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:0:125693568",
            team: team_drift_kids
        })
    )

    let player_senpai = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "Senpa1",
            age: 15,
            first_name: "Никита",
            last_name: "Иус",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:1:588664180",
            team: team_drift_kids
        })
    )

    let player_apollo = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "apollo",
            age: 21,
            first_name: "Владимир",
            last_name: "-",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:0:527726202",
            team: team_rcl
        })
    )

    let player_lav = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "MarttiniX",
            age: 15,
            first_name: "Алексей",
            last_name: "Лаврух",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:1:562950999",
            team: team_drift_kids
        })
    )

    let player_yawallner = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "yawallner",
            age: 17,
            first_name: "Роман",
            last_name: "Кон",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:0:142784600",
            team: team_mirai
        })
    )

    let player_n1zu = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "n1zu",
            age: 21,
            first_name: "Никита",
            last_name: "Зубков",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:0:95685864",
            team: team_mirai
        })
    )

    let player_sN3eze = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "sN3eze",
            age: 22,
            first_name: "Александр",
            last_name: "Афанасьев",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:0:162587671",
            team: team_mirai
        })
    )

    let player_go1den = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "go1den",
            age: 19,
            first_name: "Никита",
            last_name: "Кравцов",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:1:108906302",
            team: team_mirai
        })
    )

    let player_kLIVIC = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "kLIVIC",
            age: 20,
            first_name: "Виктор",
            last_name: "Климов",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:0:215715314",
            team: team_drift_kids
        })
    )

    let player_vidoq = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "vidoq",
            age: 20,
            first_name: "Виктор",
            last_name: "Манаенков",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "",
            team: team_drift_kids
        })
    )

    let player_n3koh = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nick_name: "n3koh",
            age: 21,
            first_name: "Герман",
            last_name: "Киселев",
            country: "Россия",
            image_url: "Картинка",
            steam_id: "STEAM_1:0:518759503",
            team: team_mirai
        })
    )


}