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
require('dotenv').config()


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
        console.log(players[i].nickName)
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

        console.log(teams[i].name)
    }

    await AppDataSource.manager.save(teams)
}