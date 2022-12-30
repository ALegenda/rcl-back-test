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

    async all(request: Request, response: Response, next: NextFunction) {
        const take = request.query.take || 10
        const skip = request.query.skip || 0

        let games = await this.gameRepository.find({
            take: take,
            skip: skip,
            order: {
                started_at: "ASC"
            },
            relations:{
                teams: true
            },
            where: {
                status: GameStatus.FINISHED
            }
        })

        let gamesWithStats = games.map((item) => {
            return {
                "team_1": item.teams[0],
                "team_2": item.teams[1],
                "started_at": item.started_at,
                "team1_score" : item.team1_score,
                "team2_score" : item.team2_score
            }
        })

        return gamesWithStats;
    }

    async pending(request: Request, response: Response, next: NextFunction) {

        let games = await this.gameRepository.find({
            take: 10,
            order: {
                started_at: "ASC"
            },
            where: {
                status: GameStatus.PENDING
            }
        })

        let gamesWithStats = games.map((item) => {
            return {
                "team_1": item.teams[0],
                "team_2": item.teams[1],
                "started_at": item.started_at
            }
        })

        return gamesWithStats;
    }

    async planMatch(request: Request, response: Response, next: NextFunction) {
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
                started_at: configs.started_аt,
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
            .leftJoinAndSelect('map.player_stats', 'player_stats')
            .leftJoinAndSelect('player_stats.player', 'player')
            .getMany()

        let map_stats = maps.map(item => item.player_stats)
        let result = {
            "team1_stats" : [],
            "team2_stats" : [],
            ...game
        }
        
        maps.forEach(map => {
            if(map.status === MapStatus.CLINCH){
                return
            }
            map.player_stats.forEach(stat => {
                if(stat.team_id === game.team1_id){
                    let index = result.team1_stats.findIndex(item => item.player_id === stat.player.id)
                    if(index === -1){
                        result.team1_stats.push({
                            "kills": stat.kills,
                            "deaths": stat.deaths,
                            "assist": stat.assist,
                            "nick_name": stat.player.nick_name,
                            "player_id": stat.player.id,
                            })
                    } else {
                        result.team1_stats[index].kills += stat.kills
                        result.team1_stats[index].deaths += stat.deaths
                        result.team1_stats[index].assist += stat.assist
                    }
                }else{
                    let index = result.team2_stats.findIndex(item => item.player_id === stat.player.id)
                    if(index === -1){
                        result.team2_stats.push({
                            "kills": stat.kills,
                            "deaths": stat.deaths,
                            "assist": stat.assist,
                            "nick_name": stat.player.nick_name,
                            "player_id": stat.player.id,
                            })
                    } else {
                        result.team2_stats[index].kills += stat.kills
                        result.team2_stats[index].deaths += stat.deaths
                        result.team2_stats[index].assist += stat.assist
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
            .leftJoinAndSelect('map.player_stats', 'player_stats')
            .leftJoinAndSelect('player_stats.player', 'player')
            .getOne()
        
        let team1_stats = []
        let team2_stats = []

        map.player_stats.forEach(item => {
            if(item.team_id === map.team1_id){
                team1_stats.push({
                    "kills" : item.kills,
                "deaths" : item.deaths,
                "assist" : item.assist,
                "nick_name" : item.player.nick_name,
                "player_id" : item.player.id,
                })
            }            else{
                team2_stats.push({
                    "kills" : item.kills,
                "deaths" : item.deaths,
                "assist" : item.assist,
                "nick_name" : item.player.nick_name,
                "player_id" : item.player.id,
                })
            }                
            
        })

        return {
            "id" : map.id,
            "number" : map.number,
            "demo" : map.demo,
            "started_at" : map.started_at,
            "finished_at" : map.finished_at,
            "status" : map.status,
            "team1_id" : map.team1_id,
            "team2_id" : map.team2_id,
            "team1_score" : map.team1_score,
            "team2_score" : map.team2_score,
            "map_name" : map.map_name,
            "team1_stats" : team1_stats,
            "team2_stats" : team2_stats
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
                id: map_result.game_id
            }
        })

        let map_index = game.maps.findIndex(item => item.number === map_result.number)

        game.maps[map_index].map_name = map_result.map_name
        game.maps[map_index].finished_at = map_result.finished_at

        if(map_result.status === MapStatus.CLINCH){
            game.maps[map_index].status = MapStatus.CLINCH
            return await this.gameRepository.save(game)
        }

        let player_stats = [];
        let names = [];
        
        map_result.player_stats.forEach(element => {
            names.push(element.nick_name)
        })

        let players = await AppDataSource
            .getRepository(Player)
            .createQueryBuilder("player")
            .where("player.nick_name IN (:...names)", { names: names })
            .leftJoinAndSelect('player.team', 'team')
            .getMany()

        map_result.player_stats.forEach(element => {
            let player = players.find(item => item.nick_name === element.nick_name)
            let stat = new PlayerStat(element.kills, element.deaths, element.assists, player )
            stat.team_id = player.team.id
            player_stats.push(stat)

            player.total_kills += element.kills
            player.total_deaths += element.deaths
            player.total_assists += element.assists
            player.total_maps += 1

            let teamIndex = game.teams.findIndex(team => team.id === player.team.id)

            game.teams[teamIndex].total_kills += element.kills
            game.teams[teamIndex].total_deaths += element.deaths
            game.teams[teamIndex].total_assists += element.assists
            game.teams[teamIndex].total_maps += 1

            if (game.maps[map_index].number === 1) {
                player.total_games += 1
            }
        });

        game.maps[map_index].player_stats = player_stats
        game.maps[map_index].status = MapStatus.FINISHED

        game.maps[map_index].team1_score = map_result.team1_score
        game.maps[map_index].team2_score = map_result.team2_score

        if (game.maps[map_index].team1_score > game.maps[map_index].team2_score) {
            game.team1_score += 1
        } else {
            game.team2_score += 1
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

        let mapId = game.maps.findIndex(map => map.dathost_id === datHostResponse.id)



        if (datHostResponse.cancel_reason !== null) {
            if (datHostResponse.cancel_reason === 'CLINCH') {
                game.maps[mapId].finished_at = new Date()
                game.maps[mapId].status = MapStatus.CLINCH

                let result = await this.gameRepository.save(game)
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


            let teamIndex = game.teams.findIndex(team => team.id === player.team.id)

            game.teams[teamIndex].total_kills += item.kills
            game.teams[teamIndex].total_deaths += item.deaths
            game.teams[teamIndex].total_assists += item.assists
            game.teams[teamIndex].total_maps += 1

            if (game.maps[mapId].number === 1) {
                player.total_games += 1
            }

            return new PlayerStat(item.kills, item.deaths, item.assists, player)
        })

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