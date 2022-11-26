import * as express from "express"
import * as bodyParser from "body-parser"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { Routes } from "./routes"
import { Player } from "./entity/Player"
import { Team } from "./entity/Team"
import { Game } from "./entity/Game"
import { Map } from "./entity/Map"
import { New } from "./entity/New"


AppDataSource.initialize().then(async () => {

    // create express app
    const app = express()
    app.use(bodyParser.json())

    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next)
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)

            } else if (result !== null && result !== undefined) {
                res.json(result)
            }
        })
    })

    // setup express app here
    // ...

    // start express server
    app.listen(process.env.PORT ||3000)

    //init()

    console.log(`Express server has started on port ${process.env.PORT}`)

}).catch(error => console.log(error))


async function init() {
    
    

    let news = await AppDataSource.manager.save(
        AppDataSource.manager.create(
            New,{
                title: "title",
                promo: "promo",
                content:"content",
                imageUrl: "url"
            }
        )
    )
    
    let team1 = await AppDataSource.manager.save(
         AppDataSource.manager.create(Team,{
             name: "Drift",
             country: "Russia",
             city: "Moscow",
             logo: "url",
         })
     )
 
     let team2 = await AppDataSource.manager.save(
         AppDataSource.manager.create(Team,{
             name: "RCL",
             country: "Russia",
             city: "Moscow",
             logo: "url"
         })
     )
 
 
     // insert new users for test
     let player1 = await AppDataSource.manager.save(
         AppDataSource.manager.create(Player, {
             nickName: "AntonioGodfather",
             age: 25,
             firstName: "Антон",
             lastName: "Алексеев",
             country: "Россия",
             imageUrl: "Картинка",
             steamId: "STEAM_1:1:36261249",
             team: team1
         })
     )
 
     let player2 = await AppDataSource.manager.save(
         AppDataSource.manager.create(Player, {
             nickName: "GRISHA",
             age: 21,
             firstName: "Григорий",
             lastName: "Михайлов",
             country: "Россия",
             imageUrl: "Картинка",
             steamId: "STEAM_1:1:431045157",
             team: team1
         })
     )
  
     let game = await AppDataSource.manager.save(
         AppDataSource.manager.create(Game, {
             teams: [team1,team2],
         })
     )
     
}