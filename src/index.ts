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
var cors = require('cors');


AppDataSource.initialize().then(async () => {

    // create express app
    const app = express()
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.raw());

    app.use(bodyParser.json());

    app.use(cors())

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

    let teams = []

    let team_Forward = AppDataSource.manager.create(Team, {
        name: "Forward",
        country: "Россия",
        city: "Москва",
        logo: "https://iili.io/HYaXRhx.png",
    })

    teams.push(team_Forward)

    let team_9_Pandas = AppDataSource.manager.create(Team, {
        name: "9 Pandas",
        country: "Россия",
        city: "Москва",
        logo: "https://img-cdn.hltv.org/teamlogo/m0wZSJulILDkRooXHsd97i.png?ixlib=java-2.1.0&w=200&s=6cd105be25f61ebe92662247fb9830fa",
    })

    teams.push(team_9_Pandas)

    let team_Websterz = AppDataSource.manager.create(Team, {
        name: "Websterz",
        country: "Беларусь",
        city: "Минск",
        logo: "https://img-cdn.hltv.org/teamlogo/fV_RQeFanEK5HDw4uChDX4.png?ixlib=java-2.1.0&w=100&s=e75b87cee9a0abaf21a11cd397b50074",
    })

    teams.push(team_Websterz)


    let team_forZe = AppDataSource.manager.create(Team, {
        name: "forZe",
        country: "Россия",
        city: "Москва",
        logo: "https://img-cdn.hltv.org/teamlogo/CnkiXvqQY48-pBo9ahnKm-.png?ixlib=java-2.1.0&w=100&s=0d7e090bb2a39bb27b09021c2a57fe8b",
    })

    teams.push(team_forZe)

    let team_K23 = AppDataSource.manager.create(Team, {
        name: "team_K23",
        country: "Россия",
        city: "Москва",
        logo: "https://img-cdn.hltv.org/teamlogo/e-KLQKZ-WCaZQPpqkwYEAg.png?ixlib=java-2.1.0&w=100&s=a980f4d1d650922d123a7ca2837dc268",
    })

    teams.push(team_K23)

    let team_Vladivostok = AppDataSource.manager.create(Team, {
        name: "Vladivostok",
        country: "Россия",
        city: "Владивосток",
        logo: "",
    })

    teams.push(team_Vladivostok)

    let team_HOTU = AppDataSource.manager.create(Team, {
        name: "HOTU",
        country: "Россия",
        city: "Якутск",
        logo: "",
    })

    teams.push(team_HOTU)

    let team_ARCRED = AppDataSource.manager.create(Team, {
        name: "ARCRED",
        country: "Россия",
        city: "Москва",
        logo: "",
    })

    teams.push(team_ARCRED)

    let team_insilio = AppDataSource.manager.create(Team, {
        name: "insilio",
        country: "Россия",
        city: "Москва",
        logo: "",
    })

    teams.push(team_insilio)

    let team_Vibe = AppDataSource.manager.create(Team, {
        name: "Vibe",
        country: "Россия",
        city: "Москва",
        logo: "",
    })

    teams.push(team_Vibe)

    let team_kinqie = AppDataSource.manager.create(Team, {
        name: "kinqie",
        country: "Россия",
        city: "Москва",
        logo: "",
    })

    teams.push(team_kinqie)

    let team_Cosmo = AppDataSource.manager.create(Team, {
        name: "Cosmo",
        country: "Россия",
        city: "Москва",
        logo: "",
    })

    teams.push(team_Cosmo)

    let team_Quazar = AppDataSource.manager.create(Team, {
        name: "Quazar",
        country: "Россия",
        city: "Москва",
        logo: "",
    })

    teams.push(team_Quazar)


    let players = []

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "JIaYm",
        age: 24,
        first_name: "Никита",
        last_name: "Panyushkin",
        country: "Россия",
        image_url: "https://img-cdn.hltv.org/playerbodyshot/hEAiip9_rkFR3rLarncwIR.png?bg=3e4c54&h=200&ixlib=java-2.1.0&rect=117%2C8%2C467%2C467&w=200&s=a0432b5e0c4135cbb7400bc69cf882a6",
        steam_id: "",
        team: team_Forward
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "k0s",
        age: 20,
        first_name: "Матвей",
        last_name: "Абрамов",
        country: "Россия",
        image_url: "https://img-cdn.hltv.org/playerbodyshot/cLAsty6FKq4dqPuHulNbFN.png?bg=3e4c54&h=200&ixlib=java-2.1.0&rect=116%2C8%2C467%2C467&w=200&s=9e82512ee8cd3f2335d053c22f6e26fa",
        steam_id: "",
        team: team_Forward
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "mou",
        age: 31,
        first_name: "Рустем",
        last_name: "Телепов",
        country: "Казахстан",
        image_url: "https://img-cdn.hltv.org/playerbodyshot/73Mu8hyG9BenGtOM21p28j.png?bg=3e4c54&h=200&ixlib=java-2.1.0&rect=117%2C4%2C467%2C467&w=200&s=36f24d367d4dccebec188bb1c49c9157",
        steam_id: "",
        team: team_Forward
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "ProbLeM",
        age: 24,
        first_name: "Дмитрий",
        last_name: "Martinov",
        country: "Россия",
        image_url: "https://img-cdn.hltv.org/playerbodyshot/5OmmRkmDENw2zy6HL3cCRh.png?bg=3e4c54&h=200&ixlib=java-2.1.0&rect=121%2C0%2C467%2C467&w=200&s=5f5e27bf4652344d297f0804cc7540fb",
        steam_id: "",
        team: team_Forward
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "xiELO",
        age: 16,
        first_name: "Владислав",
        last_name: "Lysov",
        country: "Россия",
        image_url: "https://img-cdn.hltv.org/playerbodyshot/EU15iCflXSa1AOvQPdTFbg.png?bg=3e4c54&h=200&ixlib=java-2.1.0&rect=117%2C8%2C467%2C467&w=200&s=294e08812171b69401f941351180def7",
        steam_id: "",
        team: team_Forward
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "d1Ledez",
        age: 19,
        first_name: "Даниил",
        last_name: "Кустов",
        country: "Россия",
        image_url: "https://img-cdn.hltv.org/playerbodyshot/L9rdOscThTlPujLKN-txcC.png?bg=3e4c54&h=200&ixlib=java-2.1.0&rect=116%2C8%2C467%2C467&w=200&s=ff2010975fc9ae9f5c273a0030d58467",
        steam_id: "",
        team: team_9_Pandas
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "FpSSS",
        age: 24,
        first_name: "Дмитрий",
        last_name: "Софронов",
        country: "Россия",
        image_url: "https://img-cdn.hltv.org/playerbodyshot/XfCe_-SE60ZV89ejctcoAo.png?bg=3e4c54&h=200&ixlib=java-2.1.0&rect=124%2C4%2C467%2C467&w=200&s=3030a66268d05f71e59acbcdde41bd91",
        steam_id: "",
        team: team_9_Pandas
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "Porya",
        age: 21,
        first_name: "Данил",
        last_name: "Poryadin",
        country: "Россия",
        image_url: "https://img-cdn.hltv.org/playerbodyshot/NBNxfbmktE7D7Rp-TcPPi3.png?bg=3e4c54&h=200&ixlib=java-2.1.0&rect=116%2C8%2C467%2C467&w=200&s=2b425980b04c4a271cd6656befeacd1a",
        steam_id: "",
        team: team_9_Pandas
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "seized",
        age: 28,
        first_name: "Денис",
        last_name: "Костин",
        country: "Россия",
        image_url: "https://img-cdn.hltv.org/playerbodyshot/V9PzrUFWcXrxdpGlj9NmW4.png?bg=3e4c54&h=200&ixlib=java-2.1.0&rect=116%2C8%2C467%2C467&w=200&s=e908c6c588b2f6087ddc6817630fb034",
        steam_id: "",
        team: team_9_Pandas
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "TruNiQ",
        age: 18,
        first_name: "Данилa",
        last_name: "Polymordvinov",
        country: "Россия",
        image_url: "https://img-cdn.hltv.org/playerbodyshot/DWiHuMTaMMAC24_K-QFFQ2.png?bg=3e4c54&h=200&ixlib=java-2.1.0&rect=116%2C8%2C467%2C467&w=200&s=b6790d2d92446db7c97feef2bf0f7549",
        steam_id: "",
        team: team_9_Pandas
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "boX",
        age: 27,
        first_name: "Антон",
        last_name: "Бурко",
        country: "Belarus",
        image_url: "",
        steam_id: "",
        team: team_Websterz
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "mds",
        age: 24,
        first_name: "Александр",
        last_name: "Rubets",
        country: "Belarus",
        image_url: "",
        steam_id: "",
        team: team_Websterz
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "tN1R",
        age: 21,
        first_name: "Андрей",
        last_name: "Tatarinovich",
        country: "Belarus",
        image_url: "",
        steam_id: "",
        team: team_Websterz
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "znxxX",
        age: 21,
        first_name: "Алексей",
        last_name: "Zlotkovskiy",
        country: "Belarus",
        image_url: "",
        steam_id: "",
        team: team_Websterz
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "lollipop21k",
        age: 26,
        first_name: "Igor",
        last_name: "Solodkov",
        country: "Belarus",
        image_url: "",
        steam_id: "",
        team: team_Websterz
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "Jerry",
        age: 24,
        first_name: "Андрей",
        last_name: "Mekhriakov",
        country: "Россия",
        image_url: "",
        steam_id: "",
        team: team_forZe
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "zorte",
        age: 24,
        first_name: "Александр",
        last_name: "Zagodyrenko",
        country: "Россия",
        image_url: "",
        steam_id: "",
        team: team_forZe
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "shalfey",
        age: 20,
        first_name: "Александр",
        last_name: "Marenov",
        country: "Россия",
        image_url: "",
        steam_id: "",
        team: team_forZe
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "Krad",
        age: 24,
        first_name: "Владислав",
        last_name: "Kravchenko",
        country: "Россия",
        image_url: "",
        steam_id: "",
        team: team_forZe
    }))

    // Пятный игрок forZe
    // players.push(AppDataSource.manager.create(Player, {
    //     nick_name: "",
    //     age: ,
    //     first_name: "",
    //     last_name: "",
    //     country: "Россия",  
    //     image_url: "",
    //     steam_id: "",
    //     team: team_forZe
    // }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "X5G7V",
        age: 19,
        first_name: "Даниил",
        last_name: "Maryshev",
        country: "",
        image_url: "",
        steam_id: "",
        team: team_K23
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "Raijin",
        age: 22,
        first_name: "Константин",
        last_name: "Trubarov",
        country: "",
        image_url: "",
        steam_id: "",
        team: team_K23
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "iDISBALANCE",
        age: 26,
        first_name: "Артём",
        last_name: "Egorov",
        country: "",
        image_url: "",
        steam_id: "",
        team: team_K23
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "Jyo",
        age: 27,
        first_name: "Рассим",
        last_name: "Valijev",
        country: "Estonia",
        image_url: "",
        steam_id: "",
        team: team_K23
    }))

    // Пятный игрок K23
    // players.push(AppDataSource.manager.create(Player, {
    //     nick_name: "",
    //     age: ,
    //     first_name: "",
    //     last_name: "",
    //     country: "",
    //     image_url: "",
    //     steam_id: "",
    //     team: team_K23
    // }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "ginger",
        age: 24,
        first_name: "Даниил",
        last_name: "Dubkov",
        country: "Россия",
        image_url: "",
        steam_id: "STEAM_0:1:24471802",
        team: team_Vladivostok
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "ViRESUS",
        age: 20,
        first_name: "Александр",
        last_name: "Kobilyanskiy",
        country: "Россия",
        image_url: "",
        steam_id: "STEAM_1:0:115999303",
        team: team_Vladivostok
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "kLIVIC",
        age: 20,
        first_name: "Виктор",
        last_name: "Климов",
        country: "Россия",
        image_url: "",
        steam_id: "STEAM_1:0:215715314",
        team: team_Vladivostok
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "la3euka",
        age: 21,
        first_name: "Владимир",
        last_name: "Shurigin",
        country: "Россия",
        image_url: "",
        steam_id: "STEAM_0:1:63622532",
        team: team_Vladivostok
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "ZzZoOM",
        age: 10,
        first_name: "Михаил",
        last_name: "Andreev",
        country: "Россия",
        image_url: "",
        steam_id: "",
        team: team_Vladivostok
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "mizu",
        age: 18,
        first_name: "Дмитрий",
        last_name: "Kondratiev",
        country: "Россия",
        image_url: "",
        steam_id: "76561198153097618",
        team: team_HOTU
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "gokushima",
        age: 22,
        first_name: "Erkhan",
        last_name: "Bagynanov",
        country: "Россия",
        image_url: "",
        steam_id: "76561198262313668",
        team: team_HOTU
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "swiftsteel",
        age: 29,
        first_name: "Nyurgun",
        last_name: "Avvakumov",
        country: "Россия",
        image_url: "",
        steam_id: "76561198869335703",
        team: team_HOTU
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "casE",
        age: 26,
        first_name: "Александр",
        last_name: "Kornilov",
        country: "Россия",
        image_url: "",
        steam_id: "76561198202811088",
        team: team_HOTU
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "nitzie",
        age: 21,
        first_name: "Никита",
        last_name: "Prokhorov",
        country: "Россия",
        image_url: "",
        steam_id: "76561198203086387",
        team: team_HOTU
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "hurtslxrd",
        age: 20,
        first_name: "Ренат",
        last_name: "Saparov",
        country: "Belarus",
        image_url: "",
        steam_id: "76561198095504459",
        team: team_ARCRED
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "1NVISIBLEE",
        age: 19,
        first_name: "Данилa",
        last_name: "Simagin",
        country: "Россия",
        image_url: "",
        steam_id: "76561198347665147",
        team: team_ARCRED
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "Ryujin",
        age: 20,
        first_name: "Борис",
        last_name: "Kim",
        country: "Uzbekistan",
        image_url: "",
        steam_id: "76561198116280987",
        team: team_ARCRED
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "DSSj",
        age: 24,
        first_name: "Тимур",
        last_name: "Abdullin",
        country: "Uzbekistan",
        image_url: "",
        steam_id: "76561198860030314",
        team: team_ARCRED
    }))

    //team_ARCRED
    // players.push(AppDataSource.manager.create(Player, {
    //     nick_name: "",
    //     age: ,
    //     first_name: "",
    //     last_name: "",
    //     country: "",
    //     image_url: "",
    //     steam_id: "",
    //     team: team_ARCRED
    // }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "DaDte",
        age: 23,
        first_name: "Никита",
        last_name: "Ziganshin",
        country: "Россия",
        image_url: "",
        steam_id: "76561198080397810",
        team: team_insilio
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "Xant3r",
        age: 18,
        first_name: "Кирилл",
        last_name: "Kononov",
        country: "Россия",
        image_url: "",
        steam_id: "76561198839305865",
        team: team_insilio
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "k4sl",
        age: 23,
        first_name: "Тамирлан",
        last_name: "Kahrimanov",
        country: "Россия",
        image_url: "",
        steam_id: "76561198133766215",
        team: team_insilio
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "Pipw",
        age: 20,
        first_name: "Артём",
        last_name: "Ivankin",
        country: "Россия",
        image_url: "",
        steam_id: "76561198343321573",
        team: team_insilio
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "Polt ",
        age: 28,
        first_name: "Вадим",
        last_name: "Tsyrov",
        country: "Россия",
        image_url: "",
        steam_id: "76561198046102181",
        team: team_insilio
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "s7xWn",
        age: 21,
        first_name: "Алексей",
        last_name: "Novakov",
        country: "Россия",
        image_url: "",
        steam_id: "76561198326106740",
        team: team_Vibe
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "K1ssly",
        age: 20,
        first_name: "Дмитрий",
        last_name: "Gostev",
        country: "Россия",
        image_url: "",
        steam_id: "76561198156866535",
        team: team_Vibe
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "NeoLife",
        age: 21,
        first_name: "Никита",
        last_name: "Sazanov",
        country: "Россия",
        image_url: "",
        steam_id: "76561199099257626",
        team: team_Vibe
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "Xerison",
        age: 21,
        first_name: "Никита",
        last_name: "Sergeev",
        country: "Россия",
        image_url: "",
        steam_id: "76561198211030531",
        team: team_Vibe
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "Zealot",
        age: 20,
        first_name: "Сергей",
        last_name: "Zhukovich",
        country: "Россия",
        image_url: "",
        steam_id: "76561198089355616",
        team: team_Vibe
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "ka1do",
        age: 20,
        first_name: "ka1do",
        last_name: "ka1do",
        country: "Россия",
        image_url: "",
        steam_id: "76561198243305376",
        team: team_Quazar
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "Gladik",
        age: 23,
        first_name: "Валерий",
        last_name: "Gorevoy",
        country: "Россия",
        image_url: "",
        steam_id: "76561198058377876",
        team: team_Quazar
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "Olymp1c",
        age: 20,
        first_name: "Константин",
        last_name: "Bulychev",
        country: "Россия",
        image_url: "",
        steam_id: "76561198836322811",
        team: team_Quazar
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "HEADBANGER",
        age: 22,
        first_name: "Руслан",
        last_name: "Mukhaev",
        country: "Россия",
        image_url: "",
        steam_id: "76561198098691702",
        team: team_Quazar
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "n1ckeiy",
        age: 17,
        first_name: "Дмитрий",
        last_name: "Tsepilov",
        country: "Россия",
        image_url: "",
        steam_id: "76561198216455267",
        team: team_Quazar
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "kinqie",
        age: 31,
        first_name: "Семён",
        last_name: "Lisitsyn",
        country: "Россия",
        image_url: "",
        steam_id: "76561198002372151",
        team: team_kinqie
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "executor",
        age: 18,
        first_name: "Илья",
        last_name: "Вебер",
        country: "Россия",
        image_url: "Картинка",
        steam_id: "STEAM_1:1:567452807",
        team: team_kinqie
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "nota",
        age: 15,
        first_name: "Эмиль",
        last_name: "Москвитин",
        country: "Россия",
        image_url: "Картинка",
        steam_id: "STEAM_1:1:507402149",
        team: team_kinqie
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "j3zyy",
        age: 17,
        first_name: "Азиз",
        last_name: "Aliev",
        country: "Россия",
        image_url: "",
        steam_id: "",
        team: team_kinqie
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "tex1y",
        age: 16,
        first_name: "Филипп",
        last_name: "Moskvitin",
        country: "Россия",
        image_url: "",
        steam_id: "76561199173322766",
        team: team_kinqie
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "JACKPOT",
        age: 23,
        first_name: "Владимир",
        last_name: "Dyakonov",
        country: "Россия",
        image_url: "",
        steam_id: "76561198107648113 ",
        team: team_Cosmo
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "HUckLer",
        age: 21,
        first_name: "Николай",
        last_name: "Rudov",
        country: "Россия",
        image_url: "",
        steam_id: "76561198146896894",
        team: team_Cosmo
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "lesswill",
        age: 25,
        first_name: "Дмитрий",
        last_name: "Medvedev",
        country: "Россия",
        image_url: "",
        steam_id: "76561198002358610 ",
        team: team_Cosmo
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "sp1nt",
        age: 23,
        first_name: "Глеб",
        last_name: "Gorelov",
        country: "Россия",
        image_url: "",
        steam_id: "76561198167028008 ",
        team: team_Cosmo
    }))

    players.push(AppDataSource.manager.create(Player, {
        nick_name: "Kiro",
        age: 20,
        first_name: "Александр",
        last_name: "Sherov",
        country: "Россия",
        image_url: "",
        steam_id: "76561198145768818",
        team: team_Cosmo
    }))

    AppDataSource.manager.save(teams);
    AppDataSource.manager.save(players);
}