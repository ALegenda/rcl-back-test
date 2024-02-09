import axios from "axios"
import { NextFunction, Request, Response } from "express"
import { In, Not } from "typeorm"
import { AppDataSource } from "../data-source"
import { Game, GameStage, GameStatus } from "../entity/Game"
import { Map, MapStatus } from "../entity/Map"
import { Player } from "../entity/Player"
import { PlayerStat } from "../entity/PlayerStat"
import { Team } from "../entity/Team"

export class GameController {

    private gameRepository = AppDataSource.getRepository(Game)
    private teamRepository = AppDataSource.getRepository(Team)
    private playerRepository = AppDataSource.getRepository(Player)

    async playoff(request: Request, response: Response, next: NextFunction) {


        let games = await this.gameRepository.find({
            relations: {
                teams: true
            },
            order: {
                playoffId: "ASC"
            },
            where: {
                stage: GameStage.PLAYOFF
            }
        })

        let gamesWithStats = games.map((item) => {
            return {
                "id": item.id,
                "team1": item.teams[item.teams.findIndex(i => i.id === item.team1Id)],
                "team2": item.teams[item.teams.findIndex(i => i.id === item.team2Id)],
                "startedAt": item.startedAt,
                "status": item.status,
                "playoffId": item.playoffId,
                "stage": item.stage,
                "team1Score": item.team1Score,
                "team2Score": item.team2Score

            }
        })

        return gamesWithStats;
    }

    async all(request: Request, response: Response, next: NextFunction) {
        const take = request.query.take || 10
        const skip = request.query.skip || 0

        let games = await this.gameRepository.findAndCount({
            take: take,
            skip: skip,
            order: {
                week: "DESC",
                startedAt: "DESC"
            },
            relations: {
                teams: true
            },
            where: {
                status: GameStatus.FINISHED
            }
        })

        let gamesWithStats = games[0].map((item) => {
            return {
                "id": item.id,
                "team1": item.teams[item.teams.findIndex(i => i.id === item.team1Id)],
                "team2": item.teams[item.teams.findIndex(i => i.id === item.team2Id)],
                "startedAt": item.startedAt,
                "team1Score": item.team1Score,
                "team2Score": item.team2Score,
                "week": item.week,
                "stage": item.stage
            }
        })

        return {
            "games": gamesWithStats,
            "total": games[1]
        };
    }

    async pending(request: Request, response: Response, next: NextFunction) {

        let games = await this.gameRepository.find({
            take: 10,
            relations: {
                teams: true
            },
            order: {
                startedAt: "ASC"
            },
            where: {
                status: In([GameStatus.PENDING, GameStatus.STARTED])
            }
        })

        let gamesWithStats = games.map((item) => {
            return {
                "id": item.id,
                "team1": item.teams[item.teams.findIndex(i => i.id === item.team1Id)],
                "team2": item.teams[item.teams.findIndex(i => i.id === item.team2Id)],
                "startedAt": item.startedAt,
                "status": item.status,
                "week": item.week,
                "stage": item.stage
            }
        })

        return gamesWithStats;
    }

    async planMatch(request: Request, response: Response, next: NextFunction) {
        var configs = request.body;

        let team1 = await this.teamRepository.findOne({
            where: {
                name: configs.team1Name
            }
        })
        let team2 = await this.teamRepository.findOne({
            where: {
                name: configs.team2Name
            }
        })

        let game = await AppDataSource.manager.save(
            AppDataSource.manager.create(Game, {
                teams: [team1, team2],
                status: GameStatus.PENDING,
                startedAt: configs.startedAt,
                week: configs.week,
                stage: configs.stage,
                team1Id: team1.id,
                team1Score: 0,
                team2Id: team2.id,
                team2Score: 0,
                maps: [
                    {
                        startedAt: configs.startedAt,
                        status: MapStatus.PENDING,
                        team1Id: team1.id,
                        team1Score: 0,
                        team2Id: team2.id,
                        team2Score: 0,
                        number: 1,
                        mapName: null
                    },
                    {
                        startedAt: configs.startedAt,
                        status: MapStatus.PENDING,
                        team1Id: team1.id,
                        team1Score: 0,
                        team2Id: team2.id,
                        team2Score: 0,
                        number: 2,
                        mapName: null
                    }
                ]
            })
        )

        return game
    }

    async one(request: Request, response: Response, next: NextFunction) {
        let id = request.params.id

        let game = await this.gameRepository.findOne({
            relations: {
                teams: true,
                maps: true
            },
            where: {
                id: id
            }
        })

        let ids = game.maps.map(item => item.id)

        let maps = await AppDataSource
            .getRepository(Map)
            .createQueryBuilder("map")
            .where("map.id IN (:...ids)", { ids: ids })
            .leftJoinAndSelect('map.playerStats', 'playerStats')
            .leftJoinAndSelect('playerStats.player', 'player')
            .getMany()

        let mapStats = maps.map(item => item.playerStats)
        let result = {
            "team1Stats": [],
            "team2Stats": [],
            ...game
        }

        maps.forEach(map => {
            if (map.status === MapStatus.CLINCH) {
                return
            }
            map.playerStats.forEach(stat => {
                if (stat.teamId === game.team1Id) {
                    let index = result.team1Stats.findIndex(item => item.playerId === stat.player.id)
                    if (index === -1) {
                        result.team1Stats.push({
                            "kills": stat.kills,
                            "deaths": stat.deaths,
                            "assists": stat.assists,
                            "nickName": stat.player.nickName,
                            "playerId": stat.player.id,
                        })
                    } else {
                        result.team1Stats[index].kills += stat.kills
                        result.team1Stats[index].deaths += stat.deaths
                        result.team1Stats[index].assists += stat.assists
                    }
                } else {
                    let index = result.team2Stats.findIndex(item => item.playerId === stat.player.id)
                    if (index === -1) {
                        result.team2Stats.push({
                            "kills": stat.kills,
                            "deaths": stat.deaths,
                            "assists": stat.assists,
                            "nickName": stat.player.nickName,
                            "playerId": stat.player.id,
                        })
                    } else {
                        result.team2Stats[index].kills += stat.kills
                        result.team2Stats[index].deaths += stat.deaths
                        result.team2Stats[index].assists += stat.assists
                    }
                }
            })
        });

        result.team1Stats.sort((a, b) => b.kills - a.kills)
        result.team2Stats.sort((a, b) => b.kills - a.kills)
        result.maps.sort((a, b) => a.number - b.number)

        return result
    }

    async findMap(request: Request, response: Response, next: NextFunction) {
        let id = request.params.id

        let map = await AppDataSource
            .getRepository(Map)
            .createQueryBuilder("map")
            .where("map.id = :id", { id: id })
            .leftJoinAndSelect('map.playerStats', 'playerStats')
            .leftJoinAndSelect('playerStats.player', 'player')
            .getOne()

        let team1Stats = []
        let team2Stats = []

        map.playerStats.forEach(item => {
            if (item.teamId === map.team1Id) {
                team1Stats.push({
                    "kills": item.kills,
                    "deaths": item.deaths,
                    "assists": item.assists,
                    "nickName": item.player.nickName,
                    "playerId": item.player.id,
                })
            } else {
                team2Stats.push({
                    "kills": item.kills,
                    "deaths": item.deaths,
                    "assists": item.assists,
                    "nickName": item.player.nickName,
                    "playerId": item.player.id,
                })
            }

        })

        return {
            "id": map.id,
            "number": map.number,
            "demo": map.demo,
            "startedAt": map.startedAt,
            "finishedAt": map.finishedAt,
            "status": map.status,
            "team1Id": map.team1Id,
            "team2Id": map.team2Id,
            "team1Score": map.team1Score,
            "team2Score": map.team2Score,
            "mapName": map.mapName,
            "team1Stats": team1Stats.sort((a, b) => b.kills - a.kills),
            "team2Stats": team2Stats.sort((a, b) => b.kills - a.kills)
        }
    }

    async round(request: Request, response: Response, next: NextFunction) {

        let map_result = request.body

        let team1 = await this.teamRepository.findOne({
            where: [{
                name: map_result.team1.name
            }, {
                hltvName: map_result.team1.name
            }]
        })

        let team2 = await this.teamRepository.findOne({
            where: [{
                name: map_result.team2.name
            }, {
                hltvName: map_result.team2.name
            }]
        })

        let game = await this.gameRepository.findOne({
            relations: {
                maps: {
                    playerStats: {
                        player: true
                    }
                },
                teams: true,
            },
            where: {
                team1Id: In([team1.id, team2.id]),
                team2Id: In([team1.id, team2.id]),
                status: Not(GameStatus.FINISHED)
            }
        })

        console.log(game)

        let mapIndex = game.maps.findIndex(item => item.mapName === map_result.mapName)
        if (mapIndex === -1) {


            if (game.maps[game.maps.findIndex(item => item.number === 1)].mapName === null) {
                mapIndex = game.maps.findIndex(item => item.number === 1)
            } else {
                if (game.maps[game.maps.findIndex(item => item.number === 2)].mapName === null) {
                    mapIndex = game.maps.findIndex(item => item.number === 2)
                } else {
                    mapIndex = game.maps.findIndex(item => item.number === 3)
                }
            }

            game.maps[mapIndex].mapName = map_result.mapName
            game.maps[mapIndex].status = MapStatus.STARTED
        }
        let team1Index = game.teams.findIndex(item => item.id === game.team1Id)
        let team2Index = game.teams.findIndex(item => item.id === game.team2Id)

        let ids = [];

        map_result.playerStats.forEach(element => {
            ids.push(element.steamId)
        })

        let players = await this.playerRepository
            .createQueryBuilder("player")
            .where("player.steamId IN (:...ids)", { ids: ids })
            .leftJoinAndSelect('player.team', 'team')
            .getMany()

        map_result.playerStats.forEach(element => {
            let player = players.find(item => item.steamId === element.steamId)
            if (!player) {
                response.status(500)
                response.send([element.nickName, players.map(item => item.nickName)])
            }
            let statIndex = game.maps[mapIndex].playerStats.findIndex(stat => stat.player.steamId === player.steamId)
            if (statIndex === -1) {
                let newStat = new PlayerStat(element.kills, element.deaths, element.assists, player)
                newStat.teamId = player.team.id
                game.maps[mapIndex].playerStats.push(newStat)
            }
            else {
                game.maps[mapIndex].playerStats[statIndex].assists = element.assists
                game.maps[mapIndex].playerStats[statIndex].kills = element.kills
                game.maps[mapIndex].playerStats[statIndex].deaths = element.deaths
            }
        });

        game.maps[mapIndex].team1Score = (map_result.team1.name === game.teams[team1Index].name || map_result.team1.name === game.teams[team1Index].hltvName) ? map_result.team1.score : map_result.team2.score
        game.maps[mapIndex].team2Score = (map_result.team2.name === game.teams[team2Index].name || map_result.team2.name === game.teams[team2Index].hltvName) ? map_result.team2.score : map_result.team1.score
        game.status = GameStatus.STARTED

        return await this.gameRepository.save(game)
    }

    async save(request: Request, response: Response, next: NextFunction) {

        let map_result = request.body

        let team1 = await this.teamRepository.findOne({
            where: [{
                name: map_result.team1.name
            }, {
                hltvName: map_result.team1.name
            }]
        })

        let team2 = await this.teamRepository.findOne({
            where: [{
                name: map_result.team2.name
            }, {
                hltvName: map_result.team2.name
            }]
        })

        let game = await this.gameRepository.findOne({
            relations: {
                maps: {
                    playerStats: {
                        player: true
                    }
                },
                teams: true,
            },
            where: {
                team1Id: In([team1.id, team2.id]),
                team2Id: In([team1.id, team2.id]),
                status: Not(GameStatus.FINISHED)
            }
        })

        let mapIndex = game.maps.findIndex(item => item.mapName === map_result.mapName)

        let team1Index = game.teams.findIndex(item => item.id === game.team1Id)
        let team2Index = game.teams.findIndex(item => item.id === game.team2Id)

        game.maps[mapIndex].finishedAt = new Date()
        game.maps[mapIndex].status = MapStatus.FINISHED

        let ids = [];

        map_result.playerStats.forEach(element => {
            ids.push(element.steamId)
        })

        let players = await this.playerRepository
            .createQueryBuilder("player")
            .where("player.steamId IN (:...ids)", { ids: ids })
            .leftJoinAndSelect('player.team', 'team')
            .getMany()

        map_result.playerStats.forEach(element => {
            let player = players.find(item => item.steamId === element.steamId)
            if (!player) {
                response.status(500)
                response.send([element.nickName, players.map(item => item.nickName)])
            }

            let playerStatIndex = game.maps[mapIndex].playerStats.findIndex(item => item.player.steamId === element.steamId)

            game.maps[mapIndex].playerStats[playerStatIndex].player.totalKills += element.kills
            game.maps[mapIndex].playerStats[playerStatIndex].player.totalDeaths += element.deaths
            game.maps[mapIndex].playerStats[playerStatIndex].player.totalAssists += element.assists
            game.maps[mapIndex].playerStats[playerStatIndex].player.totalKd = game.maps[mapIndex].playerStats[playerStatIndex].player.totalKills / game.maps[mapIndex].playerStats[playerStatIndex].player.totalDeaths
            game.maps[mapIndex].playerStats[playerStatIndex].player.totalMaps += 1

            let teamIndex = game.teams.findIndex(team => team.id === player.team.id)

            game.teams[teamIndex].totalKills += element.kills
            game.teams[teamIndex].totalDeaths += element.deaths
            game.teams[teamIndex].totalAssists += element.assists

            if (game.maps[mapIndex].number === 1) {
                game.maps[mapIndex].playerStats[playerStatIndex].player.totalGames += 1
            }
        });

        game.teams[0].totalMaps += 1
        game.teams[1].totalMaps += 1

        if (game.maps[mapIndex].team1Score > game.maps[mapIndex].team2Score) {
            game.team1Score += 1
        } else {
            game.team2Score += 1
        }

        // if (game.team1Score === 1 && game.team2Score === 1) {
        //     game.teams[0].totalDraws += 1
        //     game.teams[0].totalPoints += 1
        //     game.teams[1].totalDraws += 1
        //     game.teams[1].totalPoints += 1
        // }

        if (game.team1Score === 2) {
            game.teams[team1Index].totalWins += 1
            //game.teams[team1Index].totalPoints += 3
            game.teams[team2Index].totalLoses += 1
        }

        if (game.team2Score === 2) {
            game.teams[team1Index].totalLoses += 1
            game.teams[team2Index].totalWins += 1
            //game.teams[team2Index].totalPoints += 3
        }

        if (game.maps[mapIndex].number === 3 || game.team1Score === 2 || game.team2Score === 2) {
            game.teams[0].totalGames += 1
            game.teams[1].totalGames += 1
            game.status = GameStatus.FINISHED
        }

        console.log(game)

        return await this.gameRepository.save(game)
    }

    // async remove(request: Request, response: Response, next: NextFunction) {
    //     let gameToRemove = await this.gameRepository.findOneBy({ id: request.params.id })
    //     await this.gameRepository.remove(gameToRemove)
    // }

    async recalc(request: Request, response: Response, next: NextFunction) {
        await recalculatePlayers()
        await recalculateTeams()
        return "done"
    }

    async match(request: Request, response: Response, next: NextFunction) {

        let datHostResponse = request.body


        console.log(datHostResponse)

        let game = await this.gameRepository.findOne({
            relations: {
                maps: true,
                teams: true
            },
            where: {
                id: request.params.id
            }
        })

        let mapId = game.maps.findIndex(map => map.dathostId === datHostResponse.id)



        if (datHostResponse.cancel_reason !== null) {
            if (datHostResponse.cancel_reason === 'CLINCH') {
                game.maps[mapId].finishedAt = new Date()
                game.maps[mapId].status = MapStatus.CLINCH

                let result = await this.gameRepository.save(game)
                return "ok"
            }
            return "ok"
        }

        let team1_playerIds = datHostResponse.team1SteamIds
        let team2_playerIds = datHostResponse.team2SteamIds

        let playersIds = team1_playerIds.concat(team2_playerIds);

        let players = await AppDataSource
            .getRepository(Player)
            .createQueryBuilder("player")
            .where("player.steamId IN (:...ids)", { ids: playersIds })
            .leftJoinAndSelect('player.team', 'team')
            .getMany()

        let playerstats = datHostResponse.playerStats.filter(item => {
            if (!(playersIds.includes(item.steamId))) {
                return false; // skip
            }
            return true;
        }).map(item => {
            let player = players.find(player => player.steamId === item.steamId)

            player.totalKills += item.kills
            player.totalDeaths += item.deaths
            player.totalAssists += item.assists
            player.totalMaps += 1


            let teamIndex = game.teams.findIndex(team => team.id === player.team.id)

            game.teams[teamIndex].totalKills += item.kills
            game.teams[teamIndex].totalDeaths += item.deaths
            game.teams[teamIndex].totalAssists += item.assists
            game.teams[teamIndex].totalMaps += 1

            if (game.maps[mapId].number === 1) {
                player.totalGames += 1
            }

            return new PlayerStat(item.kills, item.deaths, item.assists, player)
        })

        game.maps[mapId].playerStats = playerstats

        game.maps[mapId].finishedAt = new Date()
        game.maps[mapId].status = MapStatus.FINISHED

        let nextGameId = game.maps.findIndex(map => map.number === game.maps[mapId].number + 1)

        if (nextGameId !== -1) {
            game.maps[nextGameId].startedAt = new Date()
        }


        game.maps[mapId].team1Score = datHostResponse.team1Stats.score
        game.maps[mapId].team2Score = datHostResponse.team2Stats.score

        if (game.maps[mapId].team1Score > game.maps[mapId].team2Score) {
            game.team1Score += 1
        } else {
            game.team2Score += 1
        }

        if (game.team1Score === 2 || game.team2Score === 2) {

        }


        let result = await this.gameRepository.save(game)

        return "ok"
    }
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
                if (game.team1Score === 2) {
                    sumWins += 1
                    sumPoints += 3
                }
                if (game.team1Score === 1) {
                    sumDraws += 1
                    sumPoints += 1
                }
                if (game.team1Score === 0) {
                    sumLoses += 1
                }
            } else {
                if (game.team2Score === 2) {
                    sumWins += 1
                    sumPoints += 3
                }
                if (game.team2Score === 1) {
                    sumDraws += 1
                    sumPoints += 1
                }
                if (game.team2Score === 0) {
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