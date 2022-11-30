import { NextFunction, Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { Game } from "../entity/Game"
import { Map, MapStatus } from "../entity/Map"
import { Player } from "../entity/Player"
import { PlayerStat } from "../entity/PlayerStat"

export class GameController {

    private gameRepository = AppDataSource.getRepository(Game)

    async all(request: Request, response: Response, next: NextFunction) {
        return this.gameRepository.find()
    }

    async test() {
        let moq = {
            id: '638725b0e5ddf593e4e433c6',
            game_server_id: '63723bf9266a17e982253a86',
            match_series_id: '638725b0e5ddf593e4e433c5',
            map: 'de_dust2',
            team1_steam_ids: [ 'STEAM_1:0:73838588' ],
            team2_steam_ids: [ 'STEAM_1:1:717580636' ],
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

            if (game.maps[mapId].number === 1) {
                player.totalGames += 1
            }

            return new PlayerStat(item.kills, item.deaths, item.assists, player)
        })

        console.log(playerstats)

        game.maps[mapId].playerStats = playerstats

        game.maps[mapId].finishedAt = new Date()
        game.maps[mapId].status = MapStatus.FINISHED
       
        game.maps[mapId].team1Score = request.body.team1_stats.score
        game.maps[mapId].team2Score = request.body.team2_stats.score
        
        if( game.maps[mapId].team1Score > game.maps[mapId].team2Score){
            game.team1Score += 1
        }else{
            game.team2Score += 1
        }

        let result = await this.gameRepository.save(game)

        console.log(result)

        return "ok"
    }

}