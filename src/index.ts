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

    console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results")

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
             name: "Team 1",
             country: "Russia",
             city: "Moscow",
             logo: "url"
         })
     )
 
     let team2 = await AppDataSource.manager.save(
         AppDataSource.manager.create(Team,{
             name: "Team 2",
             country: "Russia",
             city: "Moscow",
             logo: "url"
         })
     )
 
 
     // insert new users for test
     let player1 = await AppDataSource.manager.save(
         AppDataSource.manager.create(Player, {
             nickName: "1",
             age: 27,
             firstName: "1",
             lastName: "1",
             country: "1",
             imageUrl: "1",
             team: team1
         })
     )
 
     let player2 = await AppDataSource.manager.save(
         AppDataSource.manager.create(Player, {
             nickName: "2",
             age: 27,
             firstName: "2",
             lastName: "2",
             country: "2",
             imageUrl: "2",
             team: team1
         })
     )
 
     let player3 = await AppDataSource.manager.save(
         AppDataSource.manager.create(Player, {
             nickName: "3",
             age: 27,
             firstName: "3",
             lastName: "3",
             country: "3",
             imageUrl: "3",
             team: team1
         })
     )
 
     let player4 = await AppDataSource.manager.save(
         AppDataSource.manager.create(Player, {
             nickName: "4",
             age: 27,
             firstName: "4",
             lastName: "4",
             country: "4",
             imageUrl: "4",
             team: team1
         })
     )
 
     let player5 = await AppDataSource.manager.save(
         AppDataSource.manager.create(Player, {
             nickName: "5",
             age: 27,
             firstName: "5",
             lastName: "5",
             country: "5",
             imageUrl: "5",
             team: team1
         })
     )
 
     let player6 = await AppDataSource.manager.save(
         AppDataSource.manager.create(Player, {
             nickName: "6",
             age: 27,
             firstName: "6",
             lastName: "6",
             country: "6",
             imageUrl: "6",
             team: team2
         })
     )
 
     let player7 = await AppDataSource.manager.save(
         AppDataSource.manager.create(Player, {
             nickName: "7",
             age: 27,
             firstName: "7",
             lastName: "7",
             country: "7",
             imageUrl: "7",
             team: team2
         })
     )
 
     let player8 = await AppDataSource.manager.save(
         AppDataSource.manager.create(Player, {
             nickName: "8",
             age: 27,
             firstName: "8",
             lastName: "8",
             country: "8",
             imageUrl: "8",
             team: team2
         })
     )
 
     let player9 = await AppDataSource.manager.save(
         AppDataSource.manager.create(Player, {
             nickName: "9",
             age: 27,
             firstName: "9",
             lastName: "9",
             country: "9",
             imageUrl: "9",
             team: team2
         })
     )
 
     let player10 = await AppDataSource.manager.save(
         AppDataSource.manager.create(Player, {
             nickName: "10",
             age: 27,
             firstName: "10",
             lastName: "10",
             country: "10",
             imageUrl: "10",
             team: team2
         })
     )
 
     let game1 = await AppDataSource.manager.save(
         AppDataSource.manager.create(Game, {
             bestOf:1,
             teams: [team1,team2],
         })
     )

     let game2 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Game, {
            bestOf:3,
            teams: [team1,team2],
        })
    )
 
     let map1 = await AppDataSource.manager.save(
         AppDataSource.manager.create(Map, {
             game: game1,
             number:1,
             demo: "url",
             startedAt: "2015-05-20",
             finishedAt: "2015-05-20",
             playerStats: [
                 {
                     player:player1,
                     kills:1,
                     deaths:1,
                     assist:1,
                 },{
                     player:player2,
                     kills:2,
                     deaths:2,
                     assist:2,
                 },{
                     player:player3,
                     kills:3,
                     deaths:3,
                     assist:3,
                 },{
                     player:player4,
                     kills:4,
                     deaths:4,
                     assist:4,
                 },{
                     player:player5,
                     kills:5,
                     deaths:5,
                     assist:5,
                 },{
                     player:player6,
                     kills:6,
                     deaths:6,
                     assist:6,
                 },{
                     player:player7,
                     kills:7,
                     deaths:7,
                     assist:7,
                 },{
                     player:player8,
                     kills:8,
                     deaths:8,
                     assist:8,
                 },{
                     player:player9,
                     kills:9,
                     deaths:9,
                     assist:9,
                 },{
                     player:player10,
                     kills:10,
                     deaths:10,
                     assist:10,
                 },
                 
             ]
         })
     )

     let map2 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Map, {
            game: game1,
            number:1,
            demo: "url",
            startedAt: "2015-05-20",
            finishedAt: "2015-05-20",
            playerStats: [
                {
                    player:player1,
                    kills:1,
                    deaths:1,
                    assist:1,
                },{
                    player:player2,
                    kills:2,
                    deaths:2,
                    assist:2,
                },{
                    player:player3,
                    kills:3,
                    deaths:3,
                    assist:3,
                },{
                    player:player4,
                    kills:4,
                    deaths:4,
                    assist:4,
                },{
                    player:player5,
                    kills:5,
                    deaths:5,
                    assist:5,
                },{
                    player:player6,
                    kills:6,
                    deaths:6,
                    assist:6,
                },{
                    player:player7,
                    kills:7,
                    deaths:7,
                    assist:7,
                },{
                    player:player8,
                    kills:8,
                    deaths:8,
                    assist:8,
                },{
                    player:player9,
                    kills:9,
                    deaths:9,
                    assist:9,
                },{
                    player:player10,
                    kills:10,
                    deaths:10,
                    assist:10,
                },
                
            ]
        })
    )

    let map3 = await AppDataSource.manager.save(
        AppDataSource.manager.create(Map, {
            game: game2,
            number:2,
            demo: "url",
            startedAt: "2015-05-20",
        })
    )
}