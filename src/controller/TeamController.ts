import { NextFunction, Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { Team } from "../entity/Team"

export class TeamController {

    private teamRepository = AppDataSource.getRepository(Team)

    async all(request: Request, response: Response, next: NextFunction) {
        const take = request.query.take || 10
        const skip = request.query.skip || 0

        let teams = await this.teamRepository.findAndCount({
            take: take,
            skip: skip,
            order: {
                total_wins: "ASC"
            }
        })

        return teams
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
        const take = request.query.take || 10
        const skip = request.query.skip || 0

        let teams = await this.teamRepository.findAndCount({
            take: take,
            skip: skip,
            order: {
                total_wins: "ASC"
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
                    "country_logo": item.country_logo,
                    "logo": item.logo,
                },
                "wins": item.total_wins,
                "loses": item.total_loses
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
            "games": team.total_games,
            "maps": team.total_maps,
            "kills": team.total_kills,
            "deaths": team.total_deaths,
            "assists": team.total_assists,
            "kd": team.total_kills / team.total_deaths,
            "kd_diff": team.total_kills - team.total_deaths
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