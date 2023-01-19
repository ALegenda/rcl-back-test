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

    let new1 = await AppDataSource.manager.save(
        AppDataSource.manager.create(
            New, {
            title: "🔥Российская Киберспортивная Лига представляет первую профессиональную киберспортивную лигу по спортивной дисциплине Counter-Strike: Global Offensive!",
            promo: "В соревнованиях примут участие 14 команд из России и ближнего зарубежья: Websterz, Insilio, 9 Pandas, ARCRED, Forward Gaming, forZe, K23, Cosmo, VLADIVOSTOK, HOTU, VIBE, iG Int, SUN, YNT.",
            content: `В соревнованиях примут участие 14 команд из России и ближнего зарубежья: Websterz, Insilio, 9 Pandas, ARCRED, Forward Gaming, forZe, K23, Cosmo, VLADIVOSTOK, HOTU, VIBE, iG Int, SUN, YNT.
            💰 Призовой фонд составляет 6.000.000 рублей и распределяется на 8 мест.
            📆 С 20 января по 16 июля все коллективы проведут между собой по две встречи онлайн в формате bo2. По итогу регулярного чемпионата лучшие 8 команд пройдут в LAN плей-офф, а завершится всё грандиозным финалом в августе.`,
            imageUrl: "https://sun9-7.userapi.com/impg/ymZrEI9AigIfslsOGhSkiNC2Nbh7I4xmKzSbJw/i7fwoiiokho.jpg?size=1920x1080&quality=95&sign=b2a62907222e622bb55da13c81ba088d&type=album"
        }
        )
    )

    let new2 = await AppDataSource.manager.save(
        AppDataSource.manager.create(
            New, {
            title: "📆 Российская Киберспортивная Лига | Расписание 1 тура",
            promo: "Анонс трансляций дополнительно будет выложен перед матчами. Официальный канал трансляции: twitch.tv/ruscyberleague",
            content:
                `20 янв. 14:00 | K23 -vs- YNT
            21 янв. 14:00 | Websterz -vs- 9 Pandas
            21 янв. 17:00 | forZe -vs- Forward Gaming
            21 янв. 20:00 | ARCRED -vs- iG Int
            22 янв. 14:00 | HOTU -vs- SUN
            22 янв. 17:00 | VLADIVOSTOK -vs- Cosmo
            24 янв. 17:00 | Insilio -vs- VIBE
            
            Анонс трансляций дополнительно будет выложен перед матчами. Официальный канал трансляции: https://twitch.tv/ruscyberleague`,
            imageUrl: "https://sun9-15.userapi.com/impg/dAScT12pvELuQibFEPLoOdSRMfL-RByBjHyJSQ/SeDQuEsoNw4.jpg?size=1920x1080&quality=95&sign=b17b8a1aa5ff5184e9466ebcd6e9bfee&type=album"
        }
        )
    )

    let team_Forward = await AppDataSource.manager.save(
        AppDataSource.manager.create(Team, {
            name: "Forward",
            country: "Россия",
            city: "Москва",
            countryLogo: "https://iili.io/HayQ9dQ.png",
            logo: "https://iili.io/HaZQcX4.png",
        }))


    let team_9_Pandas = await AppDataSource.manager.save(
        AppDataSource.manager.create(Team, {
            name: "9 Pandas",
            country: "Россия",
            countryLogo: "https://iili.io/HayQ9dQ.png",
            city: "Москва",
            logo: "https://iili.io/HaZQ5es.png",
        }))

    let team_Websterz = await AppDataSource.manager.save(
        AppDataSource.manager.create(Team, {
            name: "Websterz",
            country: "Беларусь",
            countryLogo: "https://iili.io/HayQ9dQ.png",
            city: "Минск",
            logo: "https://iili.io/HaZQTgt.png",
        }))

    let team_forZe = await AppDataSource.manager.save(
        AppDataSource.manager.create(Team, {
            name: "forZe",
            country: "Россия",
            countryLogo: "https://iili.io/HayQ9dQ.png",
            city: "Москва",
            logo: "https://iili.io/HaZQGr7.png",
        }))

    let team_K23 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Team, {
            name: "K23",
            country: "Россия",
            countryLogo: "https://iili.io/HayQ9dQ.png",
            city: "Москва",
            logo: "https://iili.io/HaZQnXR.png",
        }))

    let team_Vladivostok = await AppDataSource.manager.save(
        AppDataSource.manager.create(Team, {
            name: "Vladivostok",
            country: "Россия",
            countryLogo: "https://iili.io/HayQ9dQ.png",
            city: "Владивосток",
            logo: "https://iili.io/HaZQAdX.png",
        }))

    let team_HOTU = await AppDataSource.manager.save(
        AppDataSource.manager.create(Team, {
            name: "HOTU",
            country: "Россия",
            countryLogo: "https://iili.io/HayQ9dQ.png",
            city: "Якутск",
            logo: "https://iili.io/HaZQ1B2.png",
        }))

    let team_ARCRED = await AppDataSource.manager.save(
        AppDataSource.manager.create(Team, {
            name: "ARCRED",
            country: "Россия",
            countryLogo: "https://iili.io/HayQ9dQ.png",
            city: "Москва",
            logo: "https://iili.io/HaZQ7mG.png",
        }))


    let team_insilio = await AppDataSource.manager.save(
        AppDataSource.manager.create(Team, {
            name: "insilio",
            country: "Россия",
            countryLogo: "https://iili.io/HayQ9dQ.png",
            city: "Москва",
            logo: "https://iili.io/HaZQE1S.png",
        }))

    let team_Vibe = await AppDataSource.manager.save(
        AppDataSource.manager.create(Team, {
            name: "VIBE",
            country: "Россия",
            countryLogo: "https://iili.io/HayQ9dQ.png",
            city: "Москва",
            logo: "https://iili.io/HaZQzqN.png",
        }))

    let team_SUN = await AppDataSource.manager.save(
        AppDataSource.manager.create(Team, {
            name: "SUN",
            country: "Россия",
            countryLogo: "https://iili.io/HayQ9dQ.png",
            city: "Москва",
            logo: "https://iili.io/HaZQI1I.png",
        }))


    let team_Cosmo = await AppDataSource.manager.save(
        AppDataSource.manager.create(Team, {
            name: "Cosmo",
            country: "Россия",
            countryLogo: "https://iili.io/HayQ9dQ.png",
            city: "Москва",
            logo: "https://iili.io/HaZQaIf.png",
        }))


    let team_Invictus_Gaming = await AppDataSource.manager.save(
        AppDataSource.manager.create(Team, {
            name: "Invictus Gaming",
            country: "Россия",
            countryLogo: "https://iili.io/HayQ9dQ.png",
            city: "Москва",
            logo: "https://iili.io/HaZQosp.png",
        }))


    let team_YNT = await AppDataSource.manager.save(
        AppDataSource.manager.create(Team, {
            name: "YNT",
            country: "Россия",
            countryLogo: "https://iili.io/HayQ9dQ.png",
            city: "Москва",
            logo: "https://iili.io/HaZQR7n.png",
        }))


    let players = []

    players.push(AppDataSource.manager.create(Player, {
        nickName: "JIaYm",
        age: 24,
        firstName: "Никита",
        lastName: "Панюшкин",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "https://img-cdn.hltv.org/playerbodyshot/hEAiip9_rkFR3rLarncwIR.png?bg=3e4c54&h=200&ixlib=java-2.1.0&rect=117%2C8%2C467%2C467&w=200&s=a0432b5e0c4135cbb7400bc69cf882a6",
        steamId: "",
        team: team_Forward
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "k0s",
        age: 20,
        firstName: "Матвей",
        lastName: "Абрамов",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "https://img-cdn.hltv.org/playerbodyshot/cLAsty6FKq4dqPuHulNbFN.png?bg=3e4c54&h=200&ixlib=java-2.1.0&rect=116%2C8%2C467%2C467&w=200&s=9e82512ee8cd3f2335d053c22f6e26fa",
        steamId: "",
        team: team_Forward
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "mou",
        age: 31,
        firstName: "Рустем",
        lastName: "Телепов",
        country: "Казахстан",
        imageUrl: "https://img-cdn.hltv.org/playerbodyshot/73Mu8hyG9BenGtOM21p28j.png?bg=3e4c54&h=200&ixlib=java-2.1.0&rect=117%2C4%2C467%2C467&w=200&s=36f24d367d4dccebec188bb1c49c9157",
        steamId: "",
        team: team_Forward
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "ProbLeM",
        age: 24,
        firstName: "Дмитрий",
        lastName: "Мартынов",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "https://img-cdn.hltv.org/playerbodyshot/5OmmRkmDENw2zy6HL3cCRh.png?bg=3e4c54&h=200&ixlib=java-2.1.0&rect=121%2C0%2C467%2C467&w=200&s=5f5e27bf4652344d297f0804cc7540fb",
        steamId: "",
        team: team_Forward
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "xiELO",
        age: 16,
        firstName: "Владислав",
        lastName: "Лысов",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "https://img-cdn.hltv.org/playerbodyshot/EU15iCflXSa1AOvQPdTFbg.png?bg=3e4c54&h=200&ixlib=java-2.1.0&rect=117%2C8%2C467%2C467&w=200&s=294e08812171b69401f941351180def7",
        steamId: "",
        team: team_Forward
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "d1Ledez",
        age: 19,
        firstName: "Даниил",
        lastName: "Кустов",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "https://img-cdn.hltv.org/playerbodyshot/L9rdOscThTlPujLKN-txcC.png?bg=3e4c54&h=200&ixlib=java-2.1.0&rect=116%2C8%2C467%2C467&w=200&s=ff2010975fc9ae9f5c273a0030d58467",
        steamId: "",
        team: team_9_Pandas
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "FpSSS",
        age: 24,
        firstName: "Дмитрий",
        lastName: "Софронов",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "https://img-cdn.hltv.org/playerbodyshot/XfCe_-SE60ZV89ejctcoAo.png?bg=3e4c54&h=200&ixlib=java-2.1.0&rect=124%2C4%2C467%2C467&w=200&s=3030a66268d05f71e59acbcdde41bd91",
        steamId: "",
        team: team_9_Pandas
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "Porya",
        age: 21,
        firstName: "Данил",
        lastName: "Порядин",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "https://img-cdn.hltv.org/playerbodyshot/NBNxfbmktE7D7Rp-TcPPi3.png?bg=3e4c54&h=200&ixlib=java-2.1.0&rect=116%2C8%2C467%2C467&w=200&s=2b425980b04c4a271cd6656befeacd1a",
        steamId: "",
        team: team_9_Pandas
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "seized",
        age: 28,
        firstName: "Денис",
        lastName: "Костин",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "https://img-cdn.hltv.org/playerbodyshot/V9PzrUFWcXrxdpGlj9NmW4.png?bg=3e4c54&h=200&ixlib=java-2.1.0&rect=116%2C8%2C467%2C467&w=200&s=e908c6c588b2f6087ddc6817630fb034",
        steamId: "",
        team: team_9_Pandas
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "TruNiQ",
        age: 18,
        firstName: "Данилa",
        lastName: "Полумордвинов",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "https://img-cdn.hltv.org/playerbodyshot/DWiHuMTaMMAC24_K-QFFQ2.png?bg=3e4c54&h=200&ixlib=java-2.1.0&rect=116%2C8%2C467%2C467&w=200&s=b6790d2d92446db7c97feef2bf0f7549",
        steamId: "",
        team: team_9_Pandas
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "boX",
        age: 27,
        firstName: "Антон",
        lastName: "Бурко",
        country: "Беларусь",
        imageUrl: "",
        steamId: "",
        team: team_Websterz
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "mds",
        age: 24,
        firstName: "Александр",
        lastName: "Рубец",
        country: "Беларусь",
        imageUrl: "",
        steamId: "",
        team: team_Websterz
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "tN1R",
        age: 21,
        firstName: "Андрей",
        lastName: "Татаринович",
        country: "Беларусь",
        imageUrl: "",
        steamId: "",
        team: team_Websterz
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "znxxX",
        age: 21,
        firstName: "Алексей",
        lastName: "Златковский",
        country: "Беларусь",
        imageUrl: "",
        steamId: "",
        team: team_Websterz
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "lollipop21k",
        age: 26,
        firstName: "Игорь",
        lastName: "Солодков",
        country: "Беларусь",
        imageUrl: "",
        steamId: "",
        team: team_Websterz
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "Jerry",
        age: 24,
        firstName: "Андрей",
        lastName: "Мехряков",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "",
        team: team_forZe
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "zorte",
        age: 24,
        firstName: "Александр",
        lastName: "Загодыренко",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "",
        team: team_forZe
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "shalfey",
        age: 20,
        firstName: "Александр",
        lastName: "Маренов",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "",
        team: team_forZe
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "Krad",
        age: 24,
        firstName: "Владислав",
        lastName: "Кравченко",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "",
        team: team_forZe
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "Forester",
        age: 23,
        firstName: "Игорь",
        lastName: "Безотеческий",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "",
        team: team_forZe
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "X5G7V",
        age: 19,
        firstName: "Даниил",
        lastName: "Марышев",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "",
        team: team_K23
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "Raijin",
        age: 22,
        firstName: "Константин",
        lastName: "Трубаров",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "",
        team: team_K23
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "iDISBALANCE",
        age: 26,
        firstName: "Артём",
        lastName: "Егоров",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "",
        team: team_K23
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "Jyo",
        age: 27,
        firstName: "Рассим",
        lastName: "Валиев",
        country: "Эстония",
        imageUrl: "",
        steamId: "",
        team: team_K23
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "Magnojez",
        age: 18,
        firstName: "Кирилл",
        lastName: "Роднов",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "",
        team: team_K23
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "ginger",
        age: 24,
        firstName: "Даниил",
        lastName: "Дубков",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "STEAM_0:1:24471802",
        team: team_Vladivostok
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "ViRESUS",
        age: 20,
        firstName: "Александр",
        lastName: "Кобылянский",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "STEAM_1:0:115999303",
        team: team_Vladivostok
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "kLIVIC",
        age: 20,
        firstName: "Виктор",
        lastName: "Климов",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "STEAM_1:0:215715314",
        team: team_Vladivostok
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "la3euka",
        age: 21,
        firstName: "Владимир",
        lastName: "Шурыгин",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "STEAM_0:1:63622532",
        team: team_Vladivostok
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "ZzZoOM",
        age: 10,
        firstName: "Михаил",
        lastName: "Андреев",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "",
        team: team_Vladivostok
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "mizu",
        age: 18,
        firstName: "Дмитрий",
        lastName: "Кондратьев",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "76561198153097618",
        team: team_HOTU
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "gokushima",
        age: 22,
        firstName: "Erkhan",
        lastName: "Багынанов",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "76561198262313668",
        team: team_HOTU
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "swiftsteel",
        age: 29,
        firstName: "Nyurgun",
        lastName: "Аввакумов",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "76561198869335703",
        team: team_HOTU
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "casE",
        age: 26,
        firstName: "Александр",
        lastName: "Корнилов",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "76561198202811088",
        team: team_HOTU
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "nitzie",
        age: 21,
        firstName: "Никита",
        lastName: "Прохоров",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "76561198203086387",
        team: team_HOTU
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "hurtslxrd",
        age: 20,
        firstName: "Ренат",
        lastName: "Сапаров",
        country: "Беларусь",
        imageUrl: "",
        steamId: "76561198095504459",
        team: team_ARCRED
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "1NVISIBLEE",
        age: 19,
        firstName: "Данилa",
        lastName: "Симагин",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "76561198347665147",
        team: team_ARCRED
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "Ryujin",
        age: 20,
        firstName: "Борис",
        lastName: "Ким",
        country: "Узбекистан",
        imageUrl: "",
        steamId: "76561198116280987",
        team: team_ARCRED
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "DSSj",
        age: 24,
        firstName: "Тимур",
        lastName: "Абдуллин",
        country: "Узбекистан",
        imageUrl: "",
        steamId: "76561198860030314",
        team: team_ARCRED
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "T4RG3T",
        age: 19,
        firstName: "Кирилл",
        lastName: "Ковалёв",
        country: "Беларусь",
        imageUrl: "",
        steamId: "76561198843894201",
        team: team_ARCRED
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "DaDte",
        age: 23,
        firstName: "Никита",
        lastName: "Зиганьшин",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "76561198080397810",
        team: team_insilio
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "Xant3r",
        age: 18,
        firstName: "Кирилл",
        lastName: "Кононов",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "76561198839305865",
        team: team_insilio
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "k4sl",
        age: 23,
        firstName: "Тамирлан",
        lastName: "Кахриманов",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "76561198133766215",
        team: team_insilio
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "Pipw",
        age: 20,
        firstName: "Артём",
        lastName: "Иванкин",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "76561198343321573",
        team: team_insilio
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "Polt",
        age: 28,
        firstName: "Вадим",
        lastName: "Циров",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "76561198046102181",
        team: team_insilio
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "s7xWn",
        age: 21,
        firstName: "Алексей",
        lastName: "Новаков",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "76561198326106740",
        team: team_Vibe
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "K1ssly",
        age: 20,
        firstName: "Дмитрий",
        lastName: "Гостев",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "76561198156866535",
        team: team_Vibe
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "NeoLife",
        age: 21,
        firstName: "Никита",
        lastName: "Сазанов",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "76561199099257626",
        team: team_Vibe
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "Xerison",
        age: 21,
        firstName: "Никита",
        lastName: "Сергеев",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "76561198211030531",
        team: team_Vibe
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "Zealot",
        age: 20,
        firstName: "Сергей",
        lastName: "Жукович",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "76561198089355616",
        team: team_Vibe
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "DavCost",
        age: 20,
        firstName: "Вадим",
        lastName: "Васильев",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "76561198243305376",
        team: team_Invictus_Gaming
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "facecrack",
        age: 23,
        firstName: "Дмитрий",
        lastName: "Алексеев",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "76561198058377876",
        team: team_Invictus_Gaming
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "meztal",
        age: 20,
        firstName: "Тал",
        lastName: "Хахиашвили",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "76561198836322811",
        team: team_Invictus_Gaming
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "MOREE",
        age: 22,
        firstName: "Мори",
        lastName: "Мизрахи",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "76561198098691702",
        team: team_Invictus_Gaming
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "TBA",
        age: 17,
        firstName: "TBA",
        lastName: "TBA",
        country: "TBA",
        imageUrl: "",
        steamId: "",
        team: team_Invictus_Gaming
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "kinqie",
        age: 31,
        firstName: "Семён",
        lastName: "Лисицын",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "76561198002372151",
        team: team_SUN
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "executor",
        age: 18,
        firstName: "Илья",
        lastName: "Вебер",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "STEAM_1:1:567452807",
        team: team_SUN
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "nota",
        age: 15,
        firstName: "Эмиль",
        lastName: "Москвитин",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "STEAM_1:1:507402149",
        team: team_SUN
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "j3zyy",
        age: 17,
        firstName: "Азиз",
        lastName: "Алиев",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "",
        team: team_SUN
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "tex1y",
        age: 16,
        firstName: "Филипп",
        lastName: "Москвитин",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "76561199173322766",
        team: team_SUN
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "JACKPOT",
        age: 23,
        firstName: "Владимир",
        lastName: "Дьяконов",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "76561198107648113 ",
        team: team_Cosmo
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "HUckLer",
        age: 21,
        firstName: "Николай",
        lastName: "Рудов",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "76561198146896894",
        team: team_Cosmo
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "lesswill",
        age: 25,
        firstName: "Дмитрий",
        lastName: "Медведев",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "76561198002358610 ",
        team: team_Cosmo
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "sp1nt",
        age: 23,
        firstName: "Глеб",
        lastName: "Горелов",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "76561198167028008 ",
        team: team_Cosmo
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "Kiro",
        age: 20,
        firstName: "Александр",
        lastName: "Шеров",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "76561198145768818",
        team: team_Cosmo
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "HeaveN",
        age: 0,
        firstName: "Егор",
        lastName: "Ковалёв",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "",
        steamId: "",
        team: team_YNT
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "Gospadarov",
        age: 0,
        firstName: "Кирилл",
        lastName: "Господаров",
        country: "",
        imageUrl: "",
        steamId: "",
        team: team_YNT
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "VILBy",
        age: 0,
        firstName: "Виталий",
        lastName: "Захарюта",
        country: "",
        imageUrl: "",
        steamId: "",
        team: team_YNT
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "bluewhite",
        age: 0,
        firstName: "Лубсан",
        lastName: "Мулонов",
        country: "",
        imageUrl: "",
        steamId: "",
        team: team_YNT
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "z1Nny",
        age: 0,
        firstName: "Павел",
        lastName: "Прокопьев",
        country: "",
        imageUrl: "",
        steamId: "",
        team: team_YNT
    }))

    AppDataSource.manager.save(players);
}