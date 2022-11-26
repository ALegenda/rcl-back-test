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
    //url: "postgres://ibmdtmpq:r2R4pxeFT01HC14EhofPGKhweinBBlnk@ella.db.elephantsql.com/ibmdtmpq",
    url: "postgres://ndkxauia:99AuBb_pONctzMBDImcGZDHVO75dY3Nb@ella.db.elephantsql.com/ndkxauia",
    //dropSchema: true,
    poolSize: 100,
    synchronize: true,
    logging: true,
    entities: [Player,Team,Game, Map, PlayerStat, New],
    migrations: [],
    subscribers: [],
})
