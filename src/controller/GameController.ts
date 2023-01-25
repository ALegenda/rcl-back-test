import axios from "axios"
import { NextFunction, Request, Response } from "express"
import { In } from "typeorm"
import { AppDataSource } from "../data-source"
import { Game, GameStatus } from "../entity/Game"
import { Map, MapStatus } from "../entity/Map"
import { Player } from "../entity/Player"
import { PlayerStat } from "../entity/PlayerStat"
import { Team } from "../entity/Team"

export class GameController {

    private gameRepository = AppDataSource.getRepository(Game)
    private teamRepository = AppDataSource.getRepository(Team)
    private playerRepository = AppDataSource.getRepository(Player)

    async all(request: Request, response: Response, next: NextFunction) {
        const take = request.query.take || 10
        const skip = request.query.skip || 0

        let games = await this.gameRepository.findAndCount({
            take: take,
            skip: skip,
            order: {
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
                "team2Score": item.team2Score
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
                status: GameStatus.PENDING
            }
        })

        let gamesWithStats = games.map((item) => {
            return {
                "id": item.id,
                "team1": item.teams[item.teams.findIndex(i => i.id === item.team1Id)],
                "team2": item.teams[item.teams.findIndex(i => i.id === item.team1Id)],
                "startedAt": item.startedAt
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

    async createMatch(request: Request, response: Response, next: NextFunction) {
        var configs = request.body;

        axios.defaults.headers.common['authorization'] = `Basic YS5hbGVrc2VldkBydXNjeWJlcmxlYWd1ZS5ydTpzdGVwYXNoa2ExNDg4`;
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

        configs.enable_pause = true
        configs.enable_ready = true
        configs.enable_tech_pause = true
        //configs.gameServerId = "63723bf9266a17e982253a86"
        configs.message_prefix = "RCL BOT"
        configs.number_of_maps = 3
        configs.ready_min_players = 5
        configs.teamSize = 5
        configs.wait_for_coaches = false
        configs.wait_for_gotv_beforeNextmap = false
        configs.wait_forSpectators = false
        configs.warmup_time = 15
        configs.connect_time = 3600

        let game = await this.gameRepository.findOne({
            relations: {
                maps: true,
                teams: true
            },
            where: {
                id: configs.gameId
            }
        })

        let team1 = await this.teamRepository.findOne({
            relations: {
                players: true
            },
            where: {
                name: configs.team1Name
            }
        })
        let team2 = await this.teamRepository.findOne({
            relations: {
                players: true
            },
            where: {
                name: configs.team2Name
            }
        })

        configs.team1SteamIds = team1.players.map(player => player.steamId).join()
        configs.team2SteamIds = team2.players.map(player => player.steamId).join()



        game = await AppDataSource.manager.save(
            AppDataSource.manager.create(Game, {
                teams: [team1, team2],
                status: GameStatus.PENDING,
                team1Id: team1.id,
                team1Score: 0,
                team2Id: team2.id,
                team2Score: 0,
                maps: [
                    {
                        startedAt: new Date(),
                        status: MapStatus.PENDING,
                        team1Id: team1.id,
                        team1Score: 0,
                        team2Id: team2.id,
                        team2Score: 0,
                        number: 1,
                        demo: "",
                        mapName: configs.map1
                    },
                    {
                        startedAt: new Date(),
                        status: MapStatus.PENDING,
                        team1Id: team1.id,
                        team1Score: 0,
                        team2Id: team2.id,
                        team2Score: 0,
                        number: 2,
                        demo: "",
                        mapName: configs.map2
                    },
                    {
                        startedAt: new Date(),
                        status: MapStatus.PENDING,
                        team1Id: team1.id,
                        team1Score: 0,
                        team2Id: team2.id,
                        team2Score: 0,
                        number: 3,
                        demo: "",
                        mapName: configs.map3
                    }
                ]
            })
        )

        configs.match_end_webhook_url = `https://rcl-backend.onrender.com/match/${game.id}`

        let dathostResponse = await axios({
            method: 'post',
            url: 'https://dathost.net/api/0.1/match-series',
            data: configs,
            headers: {
                'Accept-Encoding': 'identity'
            }
        }).then(dathost => {
            return dathost.data
        }).catch(err => console.error(err));

        game.matchSeriesId = dathostResponse.id
        game.maps.forEach(element => {
            let dathostMatch = dathostResponse.matches.find(o => o.map === element.mapName).id
            element.dathostId = dathostMatch.id
            element.mapName = dathostMatch.map
            element.demo = ""
        });

        return await this.gameRepository.save(game)
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
            "team1Stats": team1Stats,
            "team2Stats": team2Stats
        }
    }

    async save(request: Request, response: Response, next: NextFunction) {

        let map_result = request.body

        let game = await this.gameRepository.findOne({
            relations: {
                maps: true,
                teams: true
            },
            where: {
                id: map_result.gameId
            }
        })

        let mapIndex = game.maps.findIndex(item => item.number === map_result.number)

        game.maps[mapIndex].mapName = map_result.mapName
        game.maps[mapIndex].finishedAt = map_result.finishedAt

        if (map_result.status === MapStatus.CLINCH) {
            game.maps[mapIndex].status = MapStatus.CLINCH
            return await this.gameRepository.save(game)
        }

        let playerStats = [];
        let names = [];



        map_result.playerStats.forEach(element => {
            names.push(element.nickName)
        })

        let players = await this.playerRepository
            .createQueryBuilder("player")
            .where("player.nickName IN (:...names)", { names: names })
            .leftJoinAndSelect('player.team', 'team')
            .getMany()

        map_result.playerStats.forEach(element => {
            let player = players.find(item => item.nickName === element.nickName)
            if(!player){
                response.status(500)
                response.send([element.nickName, players.map(item => item.nickName)])
            }
            let stat = new PlayerStat(element.kills, element.deaths, element.assists, player)
            stat.teamId = player.team.id
            playerStats.push(stat)

            player.totalKills += element.kills
            player.totalDeaths += element.deaths
            player.totalAssists += element.assists
            player.totalMaps += 1

            let teamIndex = game.teams.findIndex(team => team.id === player.team.id)

            game.teams[teamIndex].totalKills += element.kills
            game.teams[teamIndex].totalDeaths += element.deaths
            game.teams[teamIndex].totalAssists += element.assists
            // game.teams[teamIndex].totalMaps += 1

            if (game.maps[mapIndex].number === 1) {
                player.totalGames += 1
            }
        });

        game.maps[mapIndex].playerStats = playerStats
        game.maps[mapIndex].status = MapStatus.FINISHED

        game.maps[mapIndex].team1Score = map_result.team1Score
        game.maps[mapIndex].team2Score = map_result.team2Score

        if (game.maps[mapIndex].team1Score > game.maps[mapIndex].team2Score) {
            game.team1Score += 1
        } else {
            game.team2Score += 1
        }

        if (game.team1Score === 1 && game.team2Score === 1) {
            game.teams[0].totalDraws += 1
            game.teams[0].totalPoints += 1
            game.teams[1].totalDraws += 1
            game.teams[1].totalPoints += 1
        }

        if (game.team1Score === 2) {
            let team1Index = game.teams.findIndex(team => team.id === game.team1Id)
            let team2Index = game.teams.findIndex(team => team.id === game.team2Id)
            game.teams[team1Index].totalWins += 1
            game.teams[team1Index].totalPoints += 3
            game.teams[team2Index].totalLoses += 1
        }

        if (game.team2Score === 2) {
            let team1Index = game.teams.findIndex(team => team.id === game.team1Id)
            let team2Index = game.teams.findIndex(team => team.id === game.team2Id)
            game.teams[team1Index].totalLoses += 1
            game.teams[team2Index].totalWins += 1
            game.teams[team2Index].totalPoints += 3
        }

        if (map_result.number === 2) {
            game.status = GameStatus.FINISHED
        }


        return await this.gameRepository.save(game)
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        let gameToRemove = await this.gameRepository.findOneBy({ id: request.params.id })
        await this.gameRepository.remove(gameToRemove)
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
        //totalgames totalmaps totalwins totalloses


        let result = await this.gameRepository.save(game)

        return "ok"
    }

}