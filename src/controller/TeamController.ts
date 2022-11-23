import { NextFunction, Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { Team } from "../entity/Team"

export class TeamController {

    private teamRepository = AppDataSource.getRepository(Team)

    async all(request: Request, response: Response, next: NextFunction) {
        return this.teamRepository.find()
    }

    async lineup(request: Request, response: Response, next: NextFunction) {
        return (await this.teamRepository.findOne({ 
            relations:{
                players:true
            },
            where:{
                id:request.params.id
            }
         })).players
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return (await this.teamRepository.findOneBy({ id: request.params.id }))
    }

    async save(request: Request, response: Response, next: NextFunction) {
        return this.teamRepository.save(request.body)
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        let teamToRemove = await this.teamRepository.findOneBy({ id: request.params.id })
        await this.teamRepository.remove(teamToRemove)
    }

}