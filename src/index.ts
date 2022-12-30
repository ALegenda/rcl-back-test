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

    let team_Forward = await AppDataSource.manager.save(
        AppDataSource.manager.create(Team, {
            name: "Forward",
            country: "Россия",
            city: "Москва",
            logo: "https://img-cdn.hltv.org/teamlogo/mPpF1KEr3fno5fmJPkEvqs.png?ixlib=java-2.1.0&w=200&s=cb66781f64a4b6d5e79aac953cd717dc",
        })
    )

    let team_9_Pandas = await AppDataSource.manager.save(
        AppDataSource.manager.create(Team, {
            name: "9 Pandas",
            country: "Россия",
            city: "Москва",
            logo: "https://img-cdn.hltv.org/teamlogo/m0wZSJulILDkRooXHsd97i.png?ixlib=java-2.1.0&w=200&s=6cd105be25f61ebe92662247fb9830fa",
        })
    )

    let players = []

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "JIaYm",
        age: 24,
        first_name: "Nikita",
        last_name: "Panyushkin",
        country: "Россия",
        image_url: "https://img-cdn.hltv.org/playerbodyshot/hEAiip9_rkFR3rLarncwIR.png?bg=3e4c54&h=200&ixlib=java-2.1.0&rect=117%2C8%2C467%2C467&w=200&s=a0432b5e0c4135cbb7400bc69cf882a6",
        steam_id: "",
        team: team_Forward
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "k0s",
        age: 20,
        first_name: "Matvey",
        last_name: "Abramov",
        country: "Россия",
        image_url: "https://img-cdn.hltv.org/playerbodyshot/cLAsty6FKq4dqPuHulNbFN.png?bg=3e4c54&h=200&ixlib=java-2.1.0&rect=116%2C8%2C467%2C467&w=200&s=9e82512ee8cd3f2335d053c22f6e26fa",
        steam_id: "",
        team: team_Forward
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "mou",
        age: 31,
        first_name: "Rustem",
        last_name: "Telepov",
        country: "Казахстан",
        image_url: "https://img-cdn.hltv.org/playerbodyshot/73Mu8hyG9BenGtOM21p28j.png?bg=3e4c54&h=200&ixlib=java-2.1.0&rect=117%2C4%2C467%2C467&w=200&s=36f24d367d4dccebec188bb1c49c9157",
        steam_id: "",
        team: team_Forward
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "ProbLeM",
        age: 24,
        first_name: "Dmitriy",
        last_name: "Martinov",
        country: "Россия",
        image_url: "https://img-cdn.hltv.org/playerbodyshot/5OmmRkmDENw2zy6HL3cCRh.png?bg=3e4c54&h=200&ixlib=java-2.1.0&rect=121%2C0%2C467%2C467&w=200&s=5f5e27bf4652344d297f0804cc7540fb",
        steam_id: "",
        team: team_Forward
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "xiELO",
        age: 16,
        first_name: "Vladislav",
        last_name: "Lysov",
        country: "Россия",
        image_url: "https://img-cdn.hltv.org/playerbodyshot/EU15iCflXSa1AOvQPdTFbg.png?bg=3e4c54&h=200&ixlib=java-2.1.0&rect=117%2C8%2C467%2C467&w=200&s=294e08812171b69401f941351180def7",
        steam_id: "",
        team: team_Forward
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "d1Ledez",
        age: 19,
        first_name: "Daniil",
        last_name: "Kustov",
        country: "Россия",
        image_url: "https://img-cdn.hltv.org/playerbodyshot/L9rdOscThTlPujLKN-txcC.png?bg=3e4c54&h=200&ixlib=java-2.1.0&rect=116%2C8%2C467%2C467&w=200&s=ff2010975fc9ae9f5c273a0030d58467",
        steam_id: "",
        team: team_9_Pandas
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "FpSSS",
        age: 24,
        first_name: "Dmitriy",
        last_name: "Sofronov",
        country: "Россия",
        image_url: "https://img-cdn.hltv.org/playerbodyshot/XfCe_-SE60ZV89ejctcoAo.png?bg=3e4c54&h=200&ixlib=java-2.1.0&rect=124%2C4%2C467%2C467&w=200&s=3030a66268d05f71e59acbcdde41bd91",
        steam_id: "",
        team: team_9_Pandas
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "Porya",
        age: 21,
        first_name: "Danil",
        last_name: "Poryadin",
        country: "Россия",
        image_url: "https://img-cdn.hltv.org/playerbodyshot/NBNxfbmktE7D7Rp-TcPPi3.png?bg=3e4c54&h=200&ixlib=java-2.1.0&rect=116%2C8%2C467%2C467&w=200&s=2b425980b04c4a271cd6656befeacd1a",
        steam_id: "",
        team: team_9_Pandas
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "seized",
        age: 28,
        first_name: "Denis",
        last_name: "Kostin",
        country: "Россия",
        image_url: "https://img-cdn.hltv.org/playerbodyshot/V9PzrUFWcXrxdpGlj9NmW4.png?bg=3e4c54&h=200&ixlib=java-2.1.0&rect=116%2C8%2C467%2C467&w=200&s=e908c6c588b2f6087ddc6817630fb034",
        steam_id: "",
        team: team_9_Pandas
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "TruNiQ",
        age: 18,
        first_name: "Danila",
        last_name: "Polymordvinov",
        country: "Россия",
        image_url: "https://img-cdn.hltv.org/playerbodyshot/DWiHuMTaMMAC24_K-QFFQ2.png?bg=3e4c54&h=200&ixlib=java-2.1.0&rect=116%2C8%2C467%2C467&w=200&s=b6790d2d92446db7c97feef2bf0f7549",
        steam_id: "",
        team: team_9_Pandas
    }))

    AppDataSource.manager.save(players);

}