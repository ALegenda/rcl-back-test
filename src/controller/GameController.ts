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

    async planMatch(request: Request, response: Response, next: NextFunction){
        var configs = request.body;

        let team1 = await AppDataSource.getRepository(Team).findOne({
            where: {
                name: configs.team1_name
            }
        })
        let team2 = await AppDataSource.getRepository(Team).findOne({
            where: {
                name: configs.team2_name
            }
        })

        let game = await AppDataSource.manager.save(
            AppDataSource.manager.create(Game, {
                teams: [team1, team2],
                status: GameStatus.PENDING,
                team1_id: team1.id,
                team1_score: 0,
                team2_id: team2.id,
                team2_score: 0,
                maps: [
                    {
                        started_at: configs.started_аt,
                        status: MapStatus.PENDING,
                        team1_id: team1.id,
                        team1_score: 0,
                        team2_id: team2.id,
                        team2_score: 0,
                        number: 1,
                        map_name: null
                    },
                    {
                        started_at: configs.started_аt,
                        status: MapStatus.PENDING,
                        team1_id: team1.id,
                        team1_score: 0,
                        team2_id: team2.id,
                        team2_score: 0,
                        number: 2,
                        map_name: null
                    },
                    {
                        started_at: configs.started_аt,
                        status: MapStatus.PENDING,
                        team1_id: team1.id,
                        team1_score: 0,
                        team2_id: team2.id,
                        team2_score: 0,
                        number: 3,
                        map_name: null
                    }
                ]
            })
        )

        return game
    }


    async createMapResult(request: Request, response: Response, next: NextFunction) {
        var configs = request.body;




    }


    async createMatch(request: Request, response: Response, next: NextFunction) {
        var configs = request.body;

        axios.defaults.headers.common['authorization'] = `Basic YS5hbGVrc2VldkBydXNjeWJlcmxlYWd1ZS5ydTpzdGVwYXNoa2ExNDg4`;
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

        configs.enable_pause = true
        configs.enable_ready = true
        configs.enable_tech_pause = true
        //configs.game_server_id = "63723bf9266a17e982253a86"
        configs.message_prefix = "RCL BOT"
        configs.number_of_maps = 3
        configs.ready_min_players = 5
        configs.team_size = 5
        configs.wait_for_coaches = false
        configs.wait_for_gotv_before_nextmap = false
        configs.wait_for_spectators = false
        configs.warmup_time = 15
        configs.connect_time = 3600

        let game = await this.gameRepository.findOne({
            relations: {
                maps: true,
                teams: true
            },
            where: {
                id: configs.game_id
            }
        })

        let team1 = await AppDataSource.getRepository(Team).findOne({
            relations: {
                players: true
            },
            where: {
                name: configs.team1_name
            }
        })
        let team2 = await AppDataSource.getRepository(Team).findOne({
            relations: {
                players: true
            },
            where: {
                name: configs.team2_name
            }
        })

        configs.team1_steam_ids = team1.players.map(player => player.steam_id).join()
        configs.team2_steam_ids = team2.players.map(player => player.steam_id).join()

        
        
        game = await AppDataSource.manager.save(
            AppDataSource.manager.create(Game, {
                teams: [team1, team2],
                status: GameStatus.PENDING,
                team1_id: team1.id,
                team1_score: 0,
                team2_id: team2.id,
                team2_score: 0,
                maps: [
                    {
                        started_at: new Date(),
                        status: MapStatus.PENDING,
                        team1_id: team1.id,
                        team1_score: 0,
                        team2_id: team2.id,
                        team2_score: 0,
                        number: 1,
                        demo: "",
                        map_name: configs.map1
                    },
                    {
                        started_at: new Date(),
                        status: MapStatus.PENDING,
                        team1_id: team1.id,
                        team1_score: 0,
                        team2_id: team2.id,
                        team2_score: 0,
                        number: 2,
                        demo: "",
                        map_name: configs.map2
                    },
                    {
                        started_at: new Date(),
                        status: MapStatus.PENDING,
                        team1_id: team1.id,
                        team1_score: 0,
                        team2_id: team2.id,
                        team2_score: 0,
                        number: 3,
                        demo: "",
                        map_name: configs.map3
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
            console.log(dathost.data);
            return dathost.data
        }).catch(err => console.error(err));

        game.match_series_id = dathostResponse.id
        game.maps.forEach(element => {
            let dathostMatch = dathostResponse.matches.find(o => o.map === element.map_name).id
            element.dathost_id = dathostMatch.id
            element.map_name = dathostMatch.map
            element.demo = ""
        });

        return await AppDataSource.manager.save(game)
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

        console.log(game)

        let mapId = game.maps.findIndex(map => map.dathost_id === datHostResponse.id)



        if (datHostResponse.cancel_reason !== null) {
            if (datHostResponse.cancel_reason === 'CLINCH') {
                game.maps[mapId].finished_at = new Date()
                game.maps[mapId].status = MapStatus.CLINCH

                let result = await this.gameRepository.save(game)

                console.log(result)

                return "ok"
            }
            return "ok"
        }

        let team1_player_ids = datHostResponse.team1_steam_ids
        let team2_player_ids = datHostResponse.team2_steam_ids

        let players_ids = team1_player_ids.concat(team2_player_ids);

        let players = await AppDataSource
            .getRepository(Player)
            .createQueryBuilder("player")
            .where("player.steamId IN (:...ids)", { ids: players_ids })
            .leftJoinAndSelect('player.team', 'team')
            .getMany()

        let playerstats = datHostResponse.player_stats.filter(item => {
            if (!(players_ids.includes(item.steam_id))) {
                return false; // skip
            }
            return true;
        }).map(item => {
            let player = players.find(player => player.steam_id === item.steam_id)

            player.total_kills += item.kills
            player.total_deaths += item.deaths
            player.total_assists += item.assists
            player.total_maps += 1

            console.log(`player - ${player}`)
            //console.log(`game - ${game}`)

            let teamIndex = game.teams.findIndex(team => team.id === player.team.id)
            console.log(`teamIndex - ${teamIndex}`)
            console.log(`game.teams[teamIndex] - ${game.teams[teamIndex]}`)

            game.teams[teamIndex].total_kills += item.kills
            game.teams[teamIndex].total_deaths += item.deaths
            game.teams[teamIndex].total_assists += item.assists
            game.teams[teamIndex].total_maps += 1

            if (game.maps[mapId].number === 1) {
                player.total_games += 1
            }

            return new PlayerStat(item.kills, item.deaths, item.assists, player)
        })


        console.log(`playerstats - ${playerstats}`)

        game.maps[mapId].player_stats = playerstats

        game.maps[mapId].finished_at = new Date()
        game.maps[mapId].status = MapStatus.FINISHED

        let nextGameId = game.maps.findIndex(map => map.number === game.maps[mapId].number + 1)

        if (nextGameId !== -1) {
            game.maps[nextGameId].started_at = new Date()
        }


        game.maps[mapId].team1_score = datHostResponse.team1_stats.score
        game.maps[mapId].team2_score = datHostResponse.team2_stats.score

        if (game.maps[mapId].team1_score > game.maps[mapId].team2_score) {
            game.team1_score += 1
        } else {
            game.team2_score += 1
        }

        if (game.team1_score === 2 || game.team2_score === 2) {

        }
        //totalgames totalmaps totalwins totalloses


        let result = await this.gameRepository.save(game)

        console.log(result)

        return "ok"
    }

}