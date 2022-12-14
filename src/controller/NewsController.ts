import { NextFunction, Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { New } from "../entity/New"

export class NewsController {

    private newsRepository = AppDataSource.getRepository(New)

    async all(request: Request, response: Response, next: NextFunction) {
        return (await this.newsRepository.find()).map(item => {
            return {
                "id" : item.id,
                "title" : item.title,
                "promo" : item.promo,
                "image_url" : item.image_url
            }
        })
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return (await this.newsRepository.findOneBy({ id: request.params.id }))
    }

    async save(request: Request, response: Response, next: NextFunction) {
        return this.newsRepository.save(request.body)
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        let newToRemove = await this.newsRepository.findOneBy({ id: request.params.id })
        await this.newsRepository.remove(newToRemove)
    }

    async kek(request: Request, response: Response, next: NextFunction) {
        return "it works"
    }
}