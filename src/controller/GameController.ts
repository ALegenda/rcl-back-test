import axios from "axios"
import { NextFunction, Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { Game, GameStatus } from "../entity/Game"
import { Map, MapStatus } from "../entity/Map"
import { Player } from "../entity/Player"
import { PlayerStat } from "../entity/PlayerStat"
import { Team } from "../entity/Team"

export class GameController {

    private gameRepository = AppDataSource.getRepository(Game)

    async all(request: Request, response: Response, next: NextFunction) {
        return this.gameRepository.find()
    }

    async createMatch(request: Request, response: Response, next: NextFunction) {
        var configs = request.body;

        axios.defaults.headers.common['authorization'] = `Basic YS5hbGVrc2VldkBydXNjeWJlcmxlYWd1ZS5ydTpzdGVwYXNoa2ExNDg4`;
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


        let team1 = await AppDataSource.getRepository(Team).findOneBy({ name: configs.team1_name })
        let team2 = await AppDataSource.getRepository(Team).findOneBy({ name: configs.team2_name })
         
        let game = await AppDataSource.manager.save(
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

        configs.match_end_webhook_url = `https://rcl-test.herokuapp.com/match/${game.id}`

        let dathostResponse = await axios({
            method: 'post',
            url: 'https://dathost.net/api/0.1/match-series',
            data: configs,
            headers: {
                'Accept-Encoding': 'identity'
            }
        }).then(dathost => {
            console.log(dathost);
            return dathost.data
        }).catch(err => console.error(err));
        
        game.matchSeriesId = dathostResponse.id
        game.maps.forEach(element => {
            element.DatHostId = dathostResponse.matches.find(o => o.map === element.mapName).id
        });

        

        return await AppDataSource.manager.save(game)
    }

    async test() {
        let moq = {
            id: '638725b0e5ddf593e4e433c6',
            game_server_id: '63723bf9266a17e982253a86',
            match_series_id: '638725b0e5ddf593e4e433c5',
            map: 'de_dust2',
            team1_steam_ids: ['STEAM_1:0:73838588'],
            team2_steam_ids: ['STEAM_1:1:717580636'],
            cancel_reason: null,
            team1_stats: { score: 16 },
            team2_stats: { score: 11 },
            player_stats: [
                { steam_id: 'BOT_1', kills: 0, deaths: 0, assists: 0 },
                {
                    steam_id: 'STEAM_1:0:73838588',
                    kills: 11,
                    deaths: 16,
                    assists: 0
                },
                {
                    steam_id: 'STEAM_1:1:717580636',
                    kills: 16,
                    deaths: 11,
                    assists: 0
                }]

        }

        return "kek"
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return (await this.gameRepository.findOneBy({ id: request.params.id }))
    }

    async save(request: Request, response: Response, next: NextFunction) {
        return this.gameRepository.save(request.body)
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        let gameToRemove = await this.gameRepository.findOneBy({ id: request.params.id })
        await this.gameRepository.remove(gameToRemove)
    }

    async match(request: Request, response: Response, next: NextFunction) {
        console.log(request.body)

        let game = await this.gameRepository.findOne({
            relations: {
                maps: true,
            },
            where: {
                id: request.params.id
            }
        })

        let mapId = game.maps.findIndex(o => o.DatHostId === request.body.id)

        if (request.body.cancel_reason === 'CLINCH') {
            game.maps[mapId].finishedAt = new Date()
            game.maps[mapId].status = MapStatus.CLINCH

            let result = await this.gameRepository.save(game)

            console.log(result)

            return "ok"
        }

        let team1_player_ids = request.body.team1_steam_ids
        let team2_player_ids = request.body.team2_steam_ids

        let players_ids = team1_player_ids.concat(team2_player_ids);

        let playerRep = AppDataSource.getRepository(Player)
        let players = await playerRep.createQueryBuilder("player").where("player.steamId IN (:...ids)", { ids: players_ids }).getMany()

        let playerstats = request.body.player_stats.filter(item => {
            if (!item.steam_id.startsWith("STEAM")) {
                return false; // skip
            }
            return true;
        }).map(item => {
            let player = players.find(o => o.steamId === item.steam_id)
            player.totalKills += item.kills
            player.totalDeaths += item.deaths
            player.totalAssists += item.assists
            player.totalMaps += 1

            let teamIndex = game.teams.findIndex(team => team.id === player.team.id)
            game.teams[teamIndex]
            game.teams[teamIndex].totalKills += item.kills
            game.teams[teamIndex].totalDeaths += item.deaths
            game.teams[teamIndex].totalAssists += item.assists
            game.teams[teamIndex].totalMaps += 1

            if (game.maps[mapId].number === 1) {
                player.totalGames += 1
                game.teams[teamIndex].totalGames += 1
            }

            return new PlayerStat(item.kills, item.deaths, item.assists, player)
        })


        console.log(playerstats)

        game.maps[mapId].playerStats = playerstats

        game.maps[mapId].finishedAt = new Date()
        game.maps[mapId].status = MapStatus.FINISHED

        game.maps[mapId].team1Score = request.body.team1_stats.score
        game.maps[mapId].team2Score = request.body.team2_stats.score

        if (game.maps[mapId].team1Score > game.maps[mapId].team2Score) {
            game.team1Score += 1
        } else {
            game.team2Score += 1
        }



        let result = await this.gameRepository.save(game)

        console.log(result)

        return "ok"
    }

}