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
            skip: skip,
            order: {
                total_kills: "DESC"
            }
        })

        let playersWithStats = players.map((item) => {
            return {
                "player": {
                    "id": item.id,
                    "first_name": item.first_name,
                    "last_name": item.last_name,
                    "nick_name": item.nick_name,
                    "age": item.age,
                    "country": item.country,
                    "image_url": item.image_url
                },
                "team": {
                    "id": item.team.id,
                    "name": item.team.name,
                    "country": item.team.country,
                    "country_logo": item.team.country_logo,
                    "logo": item.team.logo,
                },
                "stats": {
                    "games": item.total_games,
                    "maps": item.total_maps,
                    "kills": item.total_kills,
                    "deaths": item.total_deaths,
                    "assists": item.total_assists,
                    "kd": item.total_kills / item.total_deaths,
                    "kd_diff": item.total_kills - item.total_deaths
                }
            }
        })

        return playersWithStats;
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
            "games": player.total_games,
            "maps": player.total_maps,
            "kills": player.total_kills,
            "deaths": player.total_deaths,
            "assists": player.total_assists,
            "kd": player.total_kills / player.total_deaths,
            "kd_diff": player.total_kills - player.total_deaths
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