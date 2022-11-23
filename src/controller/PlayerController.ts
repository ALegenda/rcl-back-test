import { NextFunction, Request, Response } from "express"
import { Player } from "../entity/Player"
import { AppDataSource } from "../data-source"
import { PlayerStat } from "../entity/PlayerStat"
import { Game } from "../entity/Game"
import { Map } from "../entity/Map"

export class PlayerController {

    private playerRepository = AppDataSource.getRepository(Player)

    async all(request: Request, response: Response, next: NextFunction) {

        const take = request.query.take || 10
        const skip = request.query.skip || 0

        let players = await this.playerRepository.find({
            relations: {
                team: true
            },
            take: take,
            skip: skip
        })

        let playersWithStats = await players.map((item) => {

            return {
                "player": {
                    "id": item.id,
                    "firstName": item.firstName,
                    "lastName": item.lastName,
                    "nickName": item.nickName,
                    "age": item.age,
                    "country": item.country,
                    "imageUrl": item.imageUrl
                },
                "team": item.team,
                "stats": {
                    "games": item.totalGames,
                    "maps": item.totalMaps,
                    "kills": item.totalKills,
                    "deaths": item.totalDeaths,
                    "assists": item.totalAssists,
                    "kd": item.totalKd
                }

            }
        })

        return playersWithStats;
    }


    resultStats(stats: any[]) {
        let kills = stats.reduce((sum, current) => sum + current.kills, 0)
        let deaths = stats.reduce((sum, current) => sum + current.deaths, 0)
        let assists = stats.reduce((sum, current) => sum + current.assist, 0)
        let kd = kills / deaths

        return {
            "games": 0,
            "maps": stats.length,
            "kills": kills,
            "deaths": deaths,
            "assists": assists,
            "kd": kd
        }
    }

    async one(request: Request, response: Response, next: NextFunction) {
        let id = request.params.id

        return await this.playerRepository.findOne({
            relations: {
                team: true,
            
            },
            where: {
                id: id
            }
        })
    }

    async stats(request: Request, response: Response, next: NextFunction) {

        let id = request.params.id
        
        let player = await this.playerRepository.findOne({
            where: {
                id: id
            }
        })

        return {
            "games": player.totalGames,
            "maps": player.totalMaps,
            "kills": player.totalKills,
            "deaths": player.totalDeaths,
            "assists": player.totalAssists,
            "kd": player.totalKd
        }

    }

    async save(request: Request, response: Response, next: NextFunction) {
        return this.playerRepository.save(request.body)
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        let playerToRemove = await this.playerRepository.findOneBy({ id: request.params.id })
        await this.playerRepository.remove(playerToRemove)
    }

}