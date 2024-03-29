import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, OneToOne, BeforeInsert } from "typeorm"
import { Map } from "./Map"
import { Player } from "./Player"

@Entity()
export class PlayerStat {

    constructor(kills,deaths,assists, player){
        this.kills = kills
        this.deaths = deaths
        this.assists = assists
        this.player = player
    }
    
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    kills: number

    @Column()
    deaths: number

    @Column()
    assists: number

    @ManyToOne(() => Map, (map) => map.playerStats, { onDelete: "SET NULL" })
    map: Map

    @ManyToOne(() => Player, (player) => player.playerStats, { onDelete: "SET NULL", cascade: true})
    player: Player

    @Column({ nullable: true })
    teamId: number
}
