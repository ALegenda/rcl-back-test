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

    console.log(`Express server has started on port ${process.env.PORT || 3000}`)

}).catch(error => console.log(error))


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

    let team_drift_staff = await AppDataSource.manager.save(
        AppDataSource.manager.create(Team, {
            name: "Drift Staff",
            country: "Россия",
            city: "Владивосток",
            logo: "url"
        })
    )

    let team_drift_kids_1 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Team, {
            name: "Drift Kids 1",
            country: "Россия",
            city: "Владивосток",
            logo: "url"
        })
    )

    let team_drift_kids_2 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Team, {
            name: "Drift Kids 2",
            country: "Россия",
            city: "Владивосток",
            logo: "url"
        })
    )

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

    let player_grisha = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "GRISHA",
            age: 21,
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
            nickName: "BORYA",
            age: 21,
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
            nickName: "RUKAV",
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
            nickName: "mYb",
            age: 21,
            firstName: "Андрей",
            lastName: "mYb",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_1:0:73838588",
            team: team_drift_kids_1
        })
    )

    let player_hz = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "hz",
            age: 21,
            firstName: "hz",
            lastName: "hz",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_0:0:618991361",
            team: team_drift_kids_1
        })
    )

    let player_chillh = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "chillh",
            age: 21,
            firstName: "Владимир",
            lastName: "-",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_0:0:125693568",
            team: team_drift_kids_1
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
            steamId: "STEAM_0:0:527726202",
            team: team_drift_kids_2
        })
    )

    let player_lav = await AppDataSource.manager.save(
        AppDataSource.manager.create(Player, {
            nickName: "lav",
            age: 21,
            firstName: "Алексей",
            lastName: "Лаврух",
            country: "Россия",
            imageUrl: "Картинка",
            steamId: "STEAM_0:1:562950999",
            team: team_drift_kids_2
        })
    )

    // let game = await AppDataSource.manager.save(
    //     AppDataSource.manager.create(Game, {
    //         teams: [team_drift_staff, team_drift_kids],
    //         status: GameStatus.PENDING,
    //         matchSeriesId: "638725b0e5ddf593e4e433c5",
    //         team1Id: team_drift_staff.id,
    //         team1Score: 0,
    //         team2Id: team_drift_kids.id,
    //         team2Score: 0,
    //         maps: [
    //             {
    //                 startedAt: new Date(),
    //                 DatHostId: "638725b0e5ddf593e4e433c6",
    //                 status: MapStatus.PENDING,
    //                 team1Id: team_drift_staff.id,
    //                 team1Score: 0,
    //                 team2Id: team_drift_kids.id,
    //                 team2Score: 0,
    //                 number: 1,
    //                 demo: "",
    //                 mapName: "de_mirage"
    //             },
    //             {
    //                 startedAt: new Date(),
    //                 DatHostId: "638725b0e5ddf593e4e433c7",
    //                 status: MapStatus.PENDING,
    //                 team1Id: team_drift_staff.id,
    //                 team1Score: 0,
    //                 team2Id: team_drift_kids.id,
    //                 team2Score: 0,
    //                 number: 2,
    //                 demo: "",
    //                 mapName: "de_dust2"
    //             },
    //             {
    //                 startedAt: new Date(),
    //                 status: MapStatus.PENDING,
    //                 DatHostId: "638725b0e5ddf593e4e433c8",
    //                 team1Id: team_drift_staff.id,
    //                 team1Score: 0,
    //                 team2Id: team_drift_kids.id,
    //                 team2Score: 0,
    //                 number: 3,
    //                 demo: "",
    //                 mapName: "de_inferno"
    //             }
    //         ]
    //     })
    // )

}