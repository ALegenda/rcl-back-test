import { NextFunction, Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { Game } from "../entity/Game"
import { Map } from "../entity/Map"
import { Player } from "../entity/Player"
import { PlayerStat } from "../entity/PlayerStat"

export class GameController {

    private gameRepository = AppDataSource.getRepository(Game)

    async all(request: Request, response: Response, next: NextFunction) {
        return this.gameRepository.find()
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

        let game = await this.gameRepository.findOneBy({ id: request.params.id })

        let team1_player_ids = request.body.team1_steam_ids
        let team2_player_ids = request.body.team2_steam_ids



        let players_ids = [team1_player_ids,team2_player_ids]

        console.log(players_ids)

        let playerRep = AppDataSource.getRepository(Player)
        let players = await playerRep.createQueryBuilder("player").where("player.steamId IN (:...ids)", { ids: players_ids }).getMany()

        console.log(players)

        let playerstats = request.body.player_stats.map(item => {
            let player = players.find(o => o.steamId === item.steam_id);
            return new PlayerStat(item.kills, item.deaths, item.assists,player)
        })
        
        console.log(playerstats)

        let map = new Map(1,playerstats)
        
        console.log(map)

        game.maps.push(map)

        console.log(game)
        
        let kek = await this.gameRepository.save(game)

        console.log(kek)

        return "ok"
    }

}