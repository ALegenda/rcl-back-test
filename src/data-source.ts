import "reflect-metadata"
import { DataSource } from "typeorm"
import { Game } from "./entity/Game"
import { Map } from "./entity/Map"
import { New } from "./entity/New"
import { Player } from "./entity/Player"
import { PlayerStat } from "./entity/PlayerStat"
import { Team } from "./entity/Team"

export const AppDataSource = new DataSource({
    type: "postgres",
    //url: "postgres://omhdxsyu:CHy1pCq5vcRL_8CjbWysMHrMxb9zXMY7@dumbo.db.elephantsql.com/omhdxsyu",
    //url: "postgres://ndkxauia:99AuBb_pONctzMBDImcGZDHVO75dY3Nb@ella.db.elephantsql.com/ndkxauia",
    //url: "postgres://rcl_lqgc_user:xMETV8EWpwGXJR2mv7VuhRaqE90PcDoe@dpg-cf4k5r1gp3js6fjs5neg-a.frankfurt-postgres.render.com/rcl_lqgc?ssl=true",
    url: "postgres://rcl_season2_5wsv_user:8gFqVK2evLe0fb5QCcNR8OzUfcqtDY7L@dpg-cn2vt6gl5elc73cjlkm0-a.frankfurt-postgres.render.com/rcl_season2_5wsv?ssl=true",
    //dropSchema: true,
    poolSize: 1000,
    synchronize: false,
    logging: false,
    entities: [Player, Team, Game, Map, PlayerStat, New],
    migrations: [],
    subscribers: [],
})
