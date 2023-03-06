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
import { PlayerStat } from "./entity/PlayerStat"
import { In } from "typeorm"
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
    //initNews()
    //recalculatePlayers()
    //recalculateTeams()
    //players_to_table()
    //teams_to_table()

    console.log(`Express server has started on port ${process.env.PORT || 4000}`)

}).catch(error => console.log(error))

async function recalculatePlayers() {
    let players = await AppDataSource.getRepository(Player).find({
        relations: {
            playerStats: {
                map: true
            }
        }
    })
    for (let i = 0; i < players.length; i++) {
        let sumKills = 0
        let sumAssists = 0
        let sumDeaths = 0

        players[i].playerStats.forEach(elem => {
            sumKills += elem.kills
            sumAssists += elem.assists
            sumDeaths += elem.deaths
        })

        players[i].totalKills = sumKills
        players[i].totalAssists = sumAssists
        players[i].totalDeaths = sumDeaths
        players[i].totalMaps = players[i].playerStats.length
        players[i].totalGames = players[i].playerStats.filter(stat => stat.map.number === 1).length

        players[i].totalKd = sumKills / sumDeaths
    }
    await AppDataSource.manager.save(players)
}

async function teams_to_table() {
    const ObjectsToCsv = require('objects-to-csv');

    let teams = await AppDataSource.getRepository(Team).find();

    let data = teams.map((item) => {
        return {
            "Название": item.name,
            "Страна": item.country,
            "Кол-во игр": item.totalGames,
            "Кол-во матчей": item.totalMaps,
            "Кол-во побед": item.totalWins,
            "Кол-во поражений": item.totalLoses,
            "Кол-во ничьих": item.totalDraws,
            "Кол-во очков": item.totalPoints,
            "Суммарное кол-во фрагов команды": item.totalKills,
            "Суммарное кол-во смертей команды": item.totalDeaths,
            "Суммарное кол-во помощей команды": item.totalAssists,
            "Соотношение фрагов к смерти": item.totalKills / item.totalDeaths,
            "Разница между фрагами и смертями": item.totalKills - item.totalDeaths
        }
    });

    (async () => {
        const csv = new ObjectsToCsv(data);

        // Save to file:
        await csv.toDisk('./teams.csv');

        // Return the CSV file as string:
        console.log(await csv.toString());
    })();
}
async function players_to_table() {
    const ObjectsToCsv = require('objects-to-csv');

    let players = await AppDataSource.getRepository(Player).find({
        relations: {
            team: true
        }
    });

    let data = players.map((item) => {
        if (!item.team) return {
            "Имя": item.firstName,
            "Фамилия": item.lastName,
            "Прозвище": item.nickName,
            "Команда": "-",
            "Возраст": item.age,
            "Страна": item.country,
            "Кол-во игр": item.totalGames,
            "Кол-во матчей": item.totalMaps,
            "Кол-во фрагов": item.totalKills,
            "Кол-во смертей": item.totalDeaths,
            "Кол-во помощей": item.totalAssists,
            "Соотношение фрагов к смерти": item.totalKd,
            "Разница между фрагами и смертями": item.totalKills - item.totalDeaths
        };
        return {
            "Имя": item.firstName,
            "Фамилия": item.lastName,
            "Прозвище": item.nickName,
            "Команда": item.team.name,
            "Возраст": item.age,
            "Страна": item.country,
            "Кол-во игр": item.totalGames,
            "Кол-во матчей": item.totalMaps,
            "Кол-во фрагов": item.totalKills,
            "Кол-во смертей": item.totalDeaths,
            "Кол-во помощей": item.totalAssists,
            "Соотношение фрагов к смерти": item.totalKd,
            "Разница между фрагами и смертями": item.totalKills - item.totalDeaths
        }
    });

    (async () => {
        const csv = new ObjectsToCsv(data);

        // Save to file:
        await csv.toDisk('./players.csv');

        // Return the CSV file as string:
        console.log(await csv.toString());
    })();
}

async function recalculateTeams() {

    let teams = await AppDataSource.getRepository(Team).find()

    for (let i = 0; i < teams.length; i++) {

        let sumKills = 0
        let sumAssists = 0
        let sumDeaths = 0
        let sumWins = 0
        let sumLoses = 0
        let sumDraws = 0
        let sumPoints = 0


        let games = await AppDataSource.getRepository(Game).find({
            relations: {
                maps: {
                    playerStats: {
                        player: true
                    }
                }
            },
            where:
                [
                    {
                        team1Id: teams[i].id,
                        status: GameStatus.FINISHED
                    },
                    {
                        team2Id: teams[i].id,
                        status: GameStatus.FINISHED
                    }
                ]
        })

        //calculate
        games.forEach(game => {
            game.maps.forEach(map => {
                map.playerStats.forEach(stat => {
                    if (stat.teamId === teams[i].id) {
                        sumKills += stat.kills
                        sumAssists += stat.assists
                        sumDeaths += stat.deaths
                    }
                });
            });

            if (game.team1Id === teams[i].id) {
                if(game.team1Score === 2){
                    sumWins += 1
                    sumPoints += 3
                }
                if(game.team1Score === 1){
                    sumDraws += 1
                    sumPoints += 1
                }
                if(game.team1Score === 0){
                    sumLoses += 1
                }
            } else {
                if(game.team2Score === 2){
                    sumWins += 1
                    sumPoints += 3
                }
                if(game.team2Score === 1){
                    sumDraws += 1
                    sumPoints += 1
                }
                if(game.team2Score === 0){
                    sumLoses += 1
                }
            }
        });


        teams[i].totalAssists = sumAssists
        teams[i].totalDeaths = sumDeaths
        teams[i].totalKills = sumKills
        teams[i].totalGames = games.length
        teams[i].totalMaps = games.length * 2
        teams[i].totalWins = sumWins
        teams[i].totalLoses = sumLoses
        teams[i].totalDraws = sumDraws
        teams[i].totalPoints = sumPoints

        console.log(teams[i])
    }

    await AppDataSource.manager.save(teams)
}

async function initNews() {
    let news = []
    news.push(AppDataSource.manager.create
        (New, {
            title: "🔥 Призовой фонд лиги",
            promo: "Призовой фонд Российской Киберспортивной Лиги в этом сезоне — $100 000!",
            content: `Призовой фонд Российской Киберспортивной Лиги в этом сезоне — $100 000!
            Именно за эту награду сразятся 14 коллективов и вы их прекрасно знаете.
            
            Подписывайтесь на наши соц. сети и не пропускайте важные новости Российской Киберспортивной Лиги.
            t.me/ruscyberleague
            vk.com/ruscyberleague
            youtube.com/@ruscyberleaguecs`,
            imageUrl: "https://iili.io/HlTQUFf.jpg",
            createdDate: "2022-12-13 12:30:00.000+03"
        }))

    news.push(AppDataSource.manager.create
        (New, {
            title: "📆 Когда же ждать матчи? Очень скоро!",
            promo: "Регулярный сезон будет проходить с января по июль.",
            content: `Регулярный сезон будет проходить с января по июль. 14 коллективов выяснят кто достоин попасть в плей-офф турнира. Кульминацией же станет LAN Финал, который состоится в августе на крупной площадке.`,
            imageUrl: "https://iili.io/HlTQga4.jpg",
            createdDate: "2022-12-13 13:00:00.000+03"
        }))

    news.push(AppDataSource.manager.create
        (New, {
            title: "🔥 Дисциплина РКЛ",
            promo: "Российская Киберспортивная Лига сделала выбор в пользу Counter-Strike: Global Offensive не просто так.",
            content: `Российская Киберспортивная Лига сделала выбор в пользу Counter-Strike: Global Offensive не просто так.

            Тактический трёхмерный бой был признан официальной дисциплиной вида спорта "компьютерный спорт" - соответствующий документ опубликован на сайте Министерства Юстиции РФ 25 мая 2022 года. Ну а сам CS уже многие годы покоряет фанатов жанра захватывающими матчами и мощной энергетикой. В России не только много зрителей этого шутера, но и год за годом появляются молодые спортсмены, которые подписывают контракты с лучшими организациями мира.`,
            imageUrl: "https://iili.io/HlTQr8l.jpg",
            createdDate: "2022-12-13 11:00:00.000+03"
        }))

    news.push(AppDataSource.manager.create
        (New, {
            title: "🔥 Российская Киберспортивная Лига начинает анонс участников сезона.",
            promo: "Team Websterz - киберспортивная организация с огромными амбициями, сбалансированным составом и перспективой развития, основной костяк команды составляют лучшие игроки Беларуси. #91 место рейтинга HLTV.",
            content: `Team Websterz - киберспортивная организация с огромными амбициями, сбалансированным составом и перспективой развития, основной костяк команды составляют лучшие игроки Беларуси. #91 место рейтинга HLTV.

            👥 Состав команды:
            • Антон "boX" Бурко
            • Александр "mds" Рубец
            • Андрей "tN1R" Татаринович
            • Алексей "znxxX" Златковский
            • Антон "speed4k" Титов
            
            Средний возраст игроков 24 года. Данный состав был окончательно сформирован 19 октября 2022 года, по официальным данным, команда за 2 месяца заработала около $8500 призовых.
            
            💬 Алексей "dstr" Баранов - тренер команды:
            "Для нашего состава получить слот в РКЛ — это хорошая возможность показать силы в нашем регионе. Надеемся, что самый крупный турнир в СНГ за последнее время подарит нам бурю эмоций!"
            
            Добро пожаловать в лигу!`,
            imageUrl: "https://iili.io/HlTQ692.jpg",
            createdDate: "2022-12-23 17:00:00.000+03"
        }))

    news.push(AppDataSource.manager.create
        (New, {
            title: "🔥 Кто же вторая команда Российской Киберспортивной Лиги? Просим любить и жаловать:",
            promo: "Insilio - медиа проект известного стримера-блогера Олега \"RachelR\" Тюрькаева. Считается одним из самых интересных в кибер-медиа. Ну что же, посмотрим насколько блогер со своими бойцами сможет противостоять профессиональным клубам.",
            content: `Insilio - медиа проект известного стримера-блогера Олега "RachelR" Тюрькаева. Считается одним из самых интересных в кибер-медиа. Ну что же, посмотрим насколько блогер со своими бойцами сможет противостоять профессиональным клубам.

            👥 Состав команды:
            • Никита "DaDte" Зиганьшин
            • Кирилл "Xant3r" Кононов
            • Тамирлан "k4sl" Кахриманов
            • Артём "Pipw" Иванкин
            • Вадим "Polt" Циров
            
            💬 Олег "RachelR" Тюрькаев - CEO:
            "Для Insilio это будет первый и такой долгожданный турнир с HLTV. В последнее время в нашем регионе практически невозможно получить этот шанс из-за бесконечной грязи связанной с читерством и 322 историями. Благодаря РКЛ мы сможем побороться с большим количеством сильных команд в честной конкуренции. И я уверен, что многие наши фанаты будут приятно удивлены."`,
            imageUrl: "https://iili.io/HlTQPuS.jpg",
            createdDate: "2022-12-24 18:00:00.000+03"
        }))

    news.push(AppDataSource.manager.create
        (New, {
            title: "🔥 Российская Киберспортивная Лига продолжает анонсировать участников соревнования.",
            promo: `На очереди 9 Pandas - молодая перспективная команда с опытным тренером в лице Анатолия "liTTle" Яшина и не менее опытным капитаном Денисом "seized" Костиным. Состав успел завоевать любовь болельщиков и прославиться своим киберспортивным реалити "ТрайХард".`,
            content: `На очереди 9 Pandas - молодая перспективная команда с опытным тренером в лице Анатолия "liTTle" Яшина и не менее опытным капитаном Денисом "seized" Костиным. Состав успел завоевать любовь болельщиков и прославиться своим киберспортивным реалити "ТрайХард".

            👥 Состав команды:
            • Денис "seized" Костин
            • Дмитрий "FpSSS" Софронов
            • Даниил "d1Ledez" Кустов
            • Данил "Porya-" Порядин
            • Данила "TruNiQ" Полумордвинов
            
            💬 Анатолий "liTTle" Яшин - тренер:
            "Для нас, в первую очередь, это будет мотивацией показать наш уровень, мы уже встречались со многими коллективами, с тех пор прошло время и нам есть что показать и противопоставить."`,
            imageUrl: "https://iili.io/HlTQPuS.jpg",
            createdDate: "2022-12-26 15:00:00.000+03"
        }))

    news.push(AppDataSource.manager.create
        (New, {
            title: "🔥 Российская Киберспортивная Лига представляет очередного участника чемпионата.",
            promo: `ARCRED - лучшая команда Узбекистана с опытным российским тренером Дмитрием "iksou" Михайличенко. Молодые таланты постараются составить конкуренцию лучшим командам лиги. "Тёмные лошадки" турнира?`,
            content: `ARCRED - лучшая команда Узбекистана с опытным российским тренером Дмитрием "iksou" Михайличенко. Молодые таланты постараются составить конкуренцию лучшим командам лиги. "Тёмные лошадки" турнира?

            👥 Состав команды:
            • Тимур "DSSj" Абдуллин
            • Данила "1NVISIBLEE" Симагин
            • Борис "Ryujin" Ким
            • Матвей "sm3t" Гогин
            • Ренат "hurtslxrd" Сапаров
            
            💬 Дмитрий "iksou" Михайличенко - тренер:
            "В реалиях современного высококонкурентного Counter-Strike получить возможность участвовать в турнире уровня РКЛ безусловно значимое событие. Это не только бесценный опыт и возможность побороться с сильными соперниками, но и шанс заявить о себе и проверить на что мы способны."`,
            imageUrl: "https://iili.io/HlTQst9.jpg",
            createdDate: "2022-12-26 16:00:00.000+03"
        }))

    news.push(AppDataSource.manager.create
        (New, {
            title: "🔥 Анонс следующего участника Российской Киберспортивной Лиги!",
            promo: `Forward Gaming - профессиональная киберспортивная организация. Состав по CS:GO был собран из костяка профессионалов своего дела - Михаила "Dosia" Столярова и Рустема "mou" Телепова, но не так давно Михаил уступил своё место перспективному игроку - Матвею "k0s" Абрамову. Будет очень интересно наблюдать как себя проявит данный коллектив у нас в лиге.`,
            content: `Forward Gaming - профессиональная киберспортивная организация. Состав по CS:GO был собран из костяка профессионалов своего дела - Михаила "Dosia" Столярова и Рустема "mou" Телепова, но не так давно Михаил уступил своё место перспективному игроку - Матвею "k0s" Абрамову. Будет очень интересно наблюдать как себя проявит данный коллектив у нас в лиге.

            👥 Состав команды:
            • Дмитрий "ProbLeM" Мартынов
            • Рустем "mou" Телепов
            • Владислав "xiELO" Лысов
            • Никита "JIaYm" Панюшкин
            • Матвей "k0s" Абрамов
            
            💬 Динар Тухватуллин - менеджер:
            "Для нас это отличная возможность посоперничать с лучшими организациями нашего региона. Считаю, что РКЛ даст буст развитию киберспорта и кс в России."`,
            imageUrl: "https://iili.io/HlTQZMu.jpg",
            createdDate: "2022-12-27 13:00:00.000+03"
        }))

    news.push(AppDataSource.manager.create
        (New, {
            title: "🔥 Российская Киберспортивная Лига рада объявить об участии в турнире широко известной организации.",
            promo: `Forze - старейший профессиональный киберспортивный клуб России, участник и победитель международных соревнований. Организация воспитала десятки успешных киберспортсменов, которые отстаивали честь команды на различных чемпионатах. #38 место мирового рейтинга HLTV.`,
            content: `Forze - старейший профессиональный киберспортивный клуб России, участник и победитель международных соревнований. Организация воспитала десятки успешных киберспортсменов, которые отстаивали честь команды на различных чемпионатах. #38 место мирового рейтинга HLTV.

            👥 Состав команды:
            • Андрей "Jerry" Мехряков
            • Александр "Zorte" Загодыренко
            • Александр "shalfey" Маренов
            • Владислав "Krad" Кравченко
            • скоро анонс
            
            💬 Генеральный менеджер Forze Esports Дмитрий "spirit" Веко:
            "Нам интересно принять участие в новом киберспортивном проекте. Состав Forze ставит перед собой задачу показать красивую игру. Следите и болейте за Forze!"`,
            imageUrl: "https://iili.io/HlTQknn.jpg",
            createdDate: "2022-12-28 13:00:00.000+03"
        }))

    news.push(AppDataSource.manager.create
        (New, {
            title: "🔥 Российская Киберспортивная Лига возобновляет анонсы команд турнира после небольшого перерыва.",
            promo: `💼 Team VLADIVOSTOK - Дальневосточная организация с молодым и перспективным составом. Ребята уже успели поучаствовать на множестве онлайн и оффлайн турнирах, показывая качественную игру.`,
            content: `💼 Team VLADIVOSTOK - Дальневосточная организация с молодым и перспективным составом. Ребята уже успели поучаствовать на множестве онлайн и оффлайн турнирах, показывая качественную игру.

            👥 Состав VLADIVOSTOK:
            • Даниил "ginger" Дубков
            • Виктор "kLIVIC" Климов
            • Александр "ViRESUS" Кобылянский
            • Владимир "la3euka" Шурыгин
            • Михаил "ZzZoOm" Андреев
            
            💼 HOTU eSports - клуб из самого большого региона России, состав собран из лучших игроков Якутии. Участники ESEA Main и плей-офф SCL Challenger. #144 место мирового рейтинга HLTV.
            
            👥 Состав HOTU:
            • Дмитрий "mizu" Кондратьев
            • Эрхан "gokushima" Багынанов
            • Ньургун "swiftsteel" Аввакумов
            • Александр "casE" Корнилов
            • Никита "nitzie" Прохоров`,
            imageUrl: "https://iili.io/HlTQNjt.jpg",
            createdDate: "2023-01-11 18:00:00.000+03"
        }))

    news.push(AppDataSource.manager.create
        (New, {
            title: "🔥 Российская Киберспортивная Лига рада представить очень интересный проект, который примет участие в турнире.",
            promo: `VIBE - медиа-организация, которая ярко показала себя в медиафутболе, а сейчас решила войти и в киберспорт. Подписанный состав уже многим известен по выступлениям на различных соревнованиях в России. Ждём от них ярких матчей и мощного медиа потока.`,
            content: `VIBE - медиа-организация, которая ярко показала себя в медиафутболе, а сейчас решила войти и в киберспорт. Подписанный состав уже многим известен по выступлениям на различных соревнованиях в России. Ждём от них ярких матчей и мощного медиа потока.

            👥 Состав VIBE:
            • Дмитрий "k1ssly" Гостев
            • Алексей "NeoLife" Новаков
            • Никита "s7xWn" Сазанов
            • Никита "Xerison" Сергеев
            • Сергей "zealot" Жукович`,
            imageUrl: "https://iili.io/HlTQhyN.jpg",
            createdDate: "2023-01-13 18:00:00.000+03"
        }))

    news.push(AppDataSource.manager.create
        (New, {
            title: "🔥 Российская Киберспортивная Лига представляет крупную организацию, которая выступит на турнире!",
            promo: `Invictus Gaming - всемирно известная мультигейминговая организация, которая многие годы показывает высокие результаты на мировой арене в различных дисциплинах. Данный состав не так давно состоит в организации, но уже занимает #113 место в мировом рейтинге HLTV.`,
            content: `Invictus Gaming - всемирно известная мультигейминговая организация, которая многие годы показывает высокие результаты на мировой арене в различных дисциплинах. Данный состав не так давно состоит в организации, но уже занимает #113 место в мировом рейтинге HLTV.

            👥 Состав команды:
            • Вадим "DavCost" Васильев
            • Дмитрий "facecrack" Алексеев
            • Тал "meztal" Хахиашвили
            • Мори "MOREE" Мизрахи
            • скоро анонс
            
            💬 Андрей "XomA" Мироненко - тренер команды:
            "Мы благодарим РКЛ за предоставленную возможность сыграть с топовыми коллективами СНГ, это отличная возможность получить опыт и показать свои силы в условиях сильной конкуренции, а также отличная возможность проверить свои силы перед RMR и подготовится к будущим турнирам, формат лиги всегда интересен тем, что ты имеешь возможность сыграть большое количество матчей и попробовать большое количество своих идей в условиях официальных матчей."`,
            imageUrl: "https://iili.io/HlTQwuI.jpg",
            createdDate: "2023-01-13 18:00:00.000+03"
        }))

    news.push(AppDataSource.manager.create
        (New, {
            title: "🔥 Российская Киберспортивная Лига анонсирует заключительных участников соревнования!",
            promo: `💼 SUN Esports - новый киберспортивный проект от группы компаний Sun Development (основана в 2014 году и является девелопером жилой и апартаментной недвижимости Москвы и Санкт-Петербурга). Цель проекта - развитие и поддержка молодых киберспортивных талантов. Наставником игроков является опытный Семён "kinqie" Лисицын.`,
            content: `💼 SUN Esports - новый киберспортивный проект от группы компаний Sun Development (основана в 2014 году и является девелопером жилой и апартаментной недвижимости Москвы и Санкт-Петербурга). Цель проекта - развитие и поддержка молодых киберспортивных талантов. Наставником игроков является опытный Семён "kinqie" Лисицын.

            👥 Состав команды SUN:
            • Семён "kinqie" Лисицын
            • Азиз "j3zyy" Алиев
            • Илья "executor" Вебер
            • Эмиль "nota" Москвитин
            • Филипп "tex1y" Москвитин
            
            💼 YNT: "Мы — амбициозные и дерзкие, которым не знакомы стандартные правила и взгляды киберспортивного строя. Все делаем по-своему и прислушиваемся только к своей интуиции. Действуем по принципу «Почему бы и нет?» и не собираемся менять нашу позицию!" Как вам ребята с таким подходом к киберспорту?
            
            👥 Состав команды YNT:
            • Егор "HeaveN" Ковалёв
            • Кирилл "Gospadarov" Господаров
            • Виталий "VILBy" Захарюта
            • Павел "z1Nny" Прокопьев
            • Лубсан "bluewhite" Мулонов`,
            imageUrl: "https://iili.io/HlTQvGs.jpg",
            createdDate: "2023-01-18 18:00:00.000+03"
        }))

    news.push(AppDataSource.manager.create
        (New, {
            title: "🔥 Розыгрыш!",
            promo: `🔥 Хочешь обновить свой инвентарь и приятно провести время под крутые матчи? С нами сделать это очень легко.`,
            content: `🔥 Хочешь обновить свой инвентарь и приятно провести время под крутые матчи? С нами сделать это очень легко.

            В перерывах между матчами на нашем Twitch-канале twitch.tv/ruscyberleague проводятся розыгрыши скинов. Не пропусти!`,
            imageUrl: "https://iili.io/HlTQ86G.jpg",
            createdDate: "2023-01-22 18:00:00.000+03"
        }))


    AppDataSource.manager.save(news);
}

async function init() {

    let team_Forward = await AppDataSource.manager.save(
        AppDataSource.manager.create(Team, {
            name: "Forward Gaming",
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
            logo: "https://iili.io/Hc96Csj.png",
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
            country: "Казахстан",
            countryLogo: "https://iili.io/HcdIuXp.png",
            city: "Москва",
            logo: "https://iili.io/Hc96Kbe.png",
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
            logo: "https://iili.io/Hc96TdB.png",
        }))

    let team_ARCRED = await AppDataSource.manager.save(
        AppDataSource.manager.create(Team, {
            name: "ARCRED",
            country: "Россия",
            countryLogo: "https://iili.io/HayQ9dQ.png",
            city: "Москва",
            logo: "https://iili.io/Hc96x0Q.png",
        }))


    let team_insilio = await AppDataSource.manager.save(
        AppDataSource.manager.create(Team, {
            name: "Insilio",
            country: "Россия",
            countryLogo: "https://iili.io/HayQ9dQ.png",
            city: "Москва",
            logo: "https://iili.io/Hc96BWb.png",
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
            logo: "https://iili.io/Hc96zgV.png",
        }))


    let team_Invictus_Gaming = await AppDataSource.manager.save(
        AppDataSource.manager.create(Team, {
            name: "Invictus Gaming",
            country: "Россия",
            countryLogo: "https://iili.io/HayQ9dQ.png",
            city: "Москва",
            logo: "https://iili.io/Hc96qzu.png",
        }))


    let team_YNT = await AppDataSource.manager.save(
        AppDataSource.manager.create(Team, {
            name: "YNT",
            country: "Россия",
            countryLogo: "https://iili.io/HayQ9dQ.png",
            city: "Москва",
            logo: "https://iili.io/Hc96oqx.png",
        }))


    let players = []

    players.push(AppDataSource.manager.create(Player, {
        nickName: "JIaYm",
        age: 24,
        firstName: "Никита",
        lastName: "Панюшкин",
        country: "Россия",
        countryLogo: "https://iili.io/HayQ9dQ.png",
        imageUrl: "https://iili.io/HYaXx29.png",
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
        imageUrl: "https://iili.io/HYaXIku.png",
        steamId: "",
        team: team_Forward
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "mou",
        age: 31,
        firstName: "Рустем",
        lastName: "Телепов",
        country: "Казахстан",
        countryLogo: "https://iili.io/HcdIuXp.png",
        imageUrl: "https://iili.io/HYaXTmb.png",
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
        imageUrl: "https://iili.io/HYaXAIj.png",
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
        imageUrl: "https://iili.io/HYaXz7e.png",
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
        imageUrl: "https://iili.io/HYaMHdu.png",
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
        imageUrl: "https://iili.io/HYaMJ5b.png",
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
        imageUrl: "https://iili.io/HYaGp19.png",
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
        imageUrl: "https://iili.io/HYaGyge.png",
        steamId: "",
        team: team_9_Pandas
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "boX",
        age: 27,
        firstName: "Антон",
        lastName: "Бурко",
        country: "Беларусь",
        countryLogo: "https://iili.io/HayZGcv.png",
        imageUrl: "https://iili.io/HYaYQ6b.png",
        steamId: "",
        team: team_Websterz
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "mds",
        age: 24,
        firstName: "Александр",
        lastName: "Рубец",
        country: "Беларусь",
        countryLogo: "https://iili.io/HayZGcv.png",
        imageUrl: "https://iili.io/HYaYLMu.png",
        steamId: "",
        team: team_Websterz
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "tN1R",
        age: 21,
        firstName: "Андрей",
        lastName: "Татаринович",
        country: "Беларусь",
        countryLogo: "https://iili.io/HayZGcv.png",
        imageUrl: "https://iili.io/HYaY6w7.png",
        steamId: "",
        team: team_Websterz
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "znxxX",
        age: 21,
        firstName: "Алексей",
        lastName: "Златковский",
        country: "Беларусь",
        countryLogo: "https://iili.io/HayZGcv.png",
        imageUrl: "https://iili.io/HYaYPt9.png",
        steamId: "",
        team: team_Websterz
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "lollipop21k",
        age: 26,
        firstName: "Игорь",
        lastName: "Солодков",
        country: "Беларусь",
        countryLogo: "https://iili.io/HayZGcv.png",
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
        imageUrl: "https://iili.io/HYaaIoX.png",
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
        imageUrl: "https://iili.io/HYaaC9p.png",
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
        imageUrl: "https://iili.io/HYaaxtt.png",
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
        imageUrl: "https://iili.io/HYaaoNI.png",
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
        imageUrl: "https://iili.io/HYacXLX.png",
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
        imageUrl: "https://iili.io/HYacjBn.png",
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
        imageUrl: "https://iili.io/HYacGmN.png",
        steamId: "",
        team: team_K23
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "Jyo",
        age: 27,
        firstName: "Рассим",
        lastName: "Валиев",
        country: "Эстония",
        imageUrl: "https://iili.io/HYacVII.png",
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
        countryLogo: "https://iili.io/HayZGcv.png",
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
        imageUrl: "https://iili.io/HYaXPG2.png",
        steamId: "76561198347665147",
        team: team_ARCRED
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "Ryujin",
        age: 20,
        firstName: "Борис",
        lastName: "Ким",
        country: "Узбекистан",
        imageUrl: "https://iili.io/HYaXi4S.png",
        steamId: "76561198116280987",
        team: team_ARCRED
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "DSSj",
        age: 24,
        firstName: "Тимур",
        lastName: "Абдуллин",
        country: "Узбекистан",
        imageUrl: "https://iili.io/HYaX6Cl.png",
        steamId: "76561198860030314",
        team: team_ARCRED
    }))

    players.push(AppDataSource.manager.create(Player, {
        nickName: "T4RG3T",
        age: 19,
        firstName: "Кирилл",
        lastName: "Ковалёв",
        country: "Беларусь",
        countryLogo: "https://iili.io/HayZGcv.png",
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
        nickName: "m1N1",
        age: 17,
        firstName: "TBA",
        lastName: "TBA",
        country: "TBA",
        imageUrl: "",
        steamId: "76561198422389693",
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