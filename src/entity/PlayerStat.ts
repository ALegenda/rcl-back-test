import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, OneToOne, BeforeInsert } from "typeorm"
import { Map } from "./Map"
import { Player } from "./Player"

@Entity()
export class PlayerStat {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    kills: number

    @Column()
    deaths: number

    @Column({nullable:true})
    kd: number

    @BeforeInsert()
    updateKD() {
        this.kd = this.kills/this.deaths
    }

    @Column()
    assist: number

    @ManyToOne(() => Map, (map) => map.playerStats, { onDelete: "SET NULL" })
    map: Map

    @ManyToOne(() => Player, (player) => player.playerStats, { onDelete: "SET NULL" })
    player: Player

}
