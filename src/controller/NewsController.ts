import { NextFunction, Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { New } from "../entity/New"

export class NewsController {

    private newsRepository = AppDataSource.getRepository(New)

    async all(request: Request, response: Response, next: NextFunction) {
        const take = request.query.take || 10
        const skip = request.query.skip || 0

        let news = await this.newsRepository.findAndCount({
            take: take,
            skip: skip,
            order: {
                createdDate: "DESC"
            }
        })
        
        return {
            "news" : news[0].map(item => {
                return {
                    "id" : item.id,
                    "title" : item.title,
                    "promo" : item.promo,
                    "imageUrl" : item.imageUrl,
                    "createdDate" : item.createdDate
                }
            }),
            "total" : news[1]
        }
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