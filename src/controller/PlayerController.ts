import { NextFunction, Request, Response } from "express"
import { Player } from "../entity/Player"
import { AppDataSource } from "../data-source"
import { PlayerStat } from "../entity/PlayerStat"
import { Game } from "../entity/Game"
import { Map } from "../entity/Map"
import { In, IsNull, Not } from "typeorm"

export class PlayerController {

    private playerRepository = AppDataSource.getRepository(Player)

    async all(request: Request, response: Response, next: NextFunction) {

        const take = request.query.take || 10
        const skip = request.query.skip || 0
        const sort = request.query.sort || 'kd'
        let order = {}

        if (sort === 'kd') {
            order = {
                totalKd: "DESC"
            }
        }
        else if (sort === 'team') {
            order = {
                team: {
                    name: "DESC"
                }
            }
        }

        let players = await this.playerRepository.findAndCount({
            relations: {
                team: true
            },
            take: take,
            skip: skip,
            order: order,
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
                    "countryLogo": item.countryLogo,
                    "imageUrl": item.imageUrl
                },
                "team": {
                    "id": item.team.id,
                    "name": item.team.name,
                    "country": item.team.country,
                    "countryLogo": item.team.countryLogo,
                    "logoDark": item.team.logoDark,
                    "logo": item.team.logo,
                },
                "stats": {
                    "games": item.totalGames,
                    "maps": item.totalMaps,
                    "kills": item.totalKills,
                    "deaths": item.totalDeaths,
                    "assists": item.totalAssists,
                    "kd": +item.totalKd.toFixed(2),
                    "kdDiff": item.totalKills - item.totalDeaths
                }
            }
        })

        return {
            "players": playersWithStats,
            "total": players[1]
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

    async matches(request: Request, response: Response, next: NextFunction) {
        let gamesIds = new Set()
        let games = await AppDataSource.getRepository(Game).find({
            relations: {
                maps: {
                    playerStats: {
                        player: true
                    }
                }
            }
        })

        games.forEach(game => {
            game.maps.forEach(map => {
                if (map.playerStats.findIndex(item => item.player.id == request.params.id) !== -1) {
                    gamesIds.add(game.id)
                }
            });
        });

        return await AppDataSource.getRepository(Game).find({
            order: {
                startedAt: "DESC"
            },
            relations: {
                teams: true
            },
            where: {
                id: In(Array.from(gamesIds))
            }
        })
    }

    async save(request: Request, response: Response, next: NextFunction) {
        return this.playerRepository.save(request.body)
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        let playerToRemove = await this.playerRepository.findOneBy({ id: request.params.id })
        await this.playerRepository.remove(playerToRemove)
    }

}