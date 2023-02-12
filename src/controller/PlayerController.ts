import { NextFunction, Request, Response } from "express"
import { Player } from "../entity/Player"
import { AppDataSource } from "../data-source"
import { PlayerStat } from "../entity/PlayerStat"
import { Game } from "../entity/Game"
import { Map } from "../entity/Map"
import { IsNull, Not } from "typeorm"

export class PlayerController {

    private playerRepository = AppDataSource.getRepository(Player)

    async all(request: Request, response: Response, next: NextFunction) {

        const take = request.query.take || 10
        const skip = request.query.skip || 0

        let players = await this.playerRepository.findAndCount({
            relations: {
                team: true
            },
            take: take,
            skip: skip,
            order: {
                totalKd: "DESC"
            },
            where: {
                team: Not(IsNull())
            }
        })

        let playersWithStats = players[0].map((item) => {
            return {
                "player": {
                    "id": item.id,
                    "firstName": item.firstName,
                    "lastName": item.lastName,
                    "nickName": item.nickName,
                    "age": item.age,
                    "country": item.country,
                    "countryLogo" : item.countryLogo,
                    "imageUrl": item.imageUrl
                },
                "team": {
                    "id": item.team.id,
                    "name": item.team.name,
                    "country": item.team.country,
                    "countryLogo": item.team.countryLogo,
                    "logo": item.team.logo,
                },
                "stats": {
                    "games": item.totalGames,
                    "maps": item.totalMaps,
                    "kills": item.totalKills,
                    "deaths": item.totalDeaths,
                    "assists": item.totalAssists,
                    "kd": item.totalKd,
                    "kdDiff": item.totalKills - item.totalDeaths
                }
            }
        })

        return {
            "players" : playersWithStats,
            "total" : players[1]
        };
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
            "kd": player.totalKd,
            "kdDiff": player.totalKills - player.totalDeaths
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