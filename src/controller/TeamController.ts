import { NextFunction, Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { Game, GameStatus } from "../entity/Game"
import { Team } from "../entity/Team"
import { In, Not } from "typeorm"

export class TeamController {

    private teamRepository = AppDataSource.getRepository(Team)

    async all(request: Request, response: Response, next: NextFunction) {
        const take = request.query.take || 14
        const skip = request.query.skip || 0

        let teams = await this.teamRepository.findAndCount({
            take: take,
            skip: skip,
            order: {
                id: "ASC"
            },
            where: {
                id: Not(In([30,31]))
            }
        })

        return {
            "teams" : teams[0],
            "total" : teams[1]
        }
    }

    async matches(request: Request, response: Response, next: NextFunction){
        return await AppDataSource.getRepository(Game).find({
            order: {
                startedAt: "DESC"
            },
            relations: {
                teams: true
            },
            where:
                [
                    {
                        team1Id: request.params.id,
                    },
                    {
                        team2Id: request.params.id,
                    }
                ]
        })
    }

    async lineup(request: Request, response: Response, next: NextFunction) {
        return (await this.teamRepository.findOne({
            relations: {
                players: true
            },
            where: {
                id: request.params.id
            }
        })).players
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return (await this.teamRepository.findOneBy({ id: request.params.id }))
    }

    async shortresults(request: Request, response: Response, next: NextFunction) {
        const take = request.query.take || 14
        const skip = request.query.skip || 0

        let teams = await this.teamRepository.findAndCount({
            take: take,
            skip: skip,
            order: {
                totalPoints: "DESC",
                totalWins: "DESC",
                totalLoses: "ASC",
                id: "DESC"
            }
        })
        let index = 1;
        let total = teams[1]
        let teamsWithStats = teams[0].map((item) => {
            return {
                "place": index++,
                "team": {
                    "id": item.id,
                    "name": item.name,
                    "country": item.country,
                    "countryLogo": item.countryLogo,
                    "logo": item.logo,
                    "logoDark": item.logoDark
                },
                "wins": item.totalWins,
                "loses": item.totalLoses,
                "draws": item.totalDraws,
                "points": item.totalPoints
            }
        })

        return {
            "teams" : teamsWithStats,
            "total": total
        };

    }

    async stats(request: Request, response: Response, next: NextFunction) {
        let id = request.params.id

        let team = await this.teamRepository.findOne({
            where: {
                id: id
            }
        })

        return {
            "games": team.totalGames,
            "maps": team.totalMaps,
            "kills": team.totalKills,
            "deaths": team.totalDeaths,
            "assists": team.totalAssists,
            "kd": team.totalKills / team.totalDeaths || 0,
            "kdDiff": team.totalKills - team.totalDeaths
        }
    }

    async save(request: Request, response: Response, next: NextFunction) {
        return this.teamRepository.save(request.body)
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        let teamToRemove = await this.teamRepository.findOneBy({ id: request.params.id })
        await this.teamRepository.remove(teamToRemove)
    }

}
