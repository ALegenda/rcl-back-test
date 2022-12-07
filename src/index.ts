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
    app.listen(process.env.PORT || 3000)

    //init()
    //test()


    console.log(`Express server has started on port ${process.env.PORT || 3000}`)

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