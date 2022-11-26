import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm"
import { Game } from "./Game"
import { PlayerStat } from "./PlayerStat"

@Entity()
export class Map {

    constructor(number,playerStats){
        this.number = number
        this.demo = ""
        this.finishedAt = new Date()
        this.playerStats = playerStats
    }


    @PrimaryGeneratedColumn()
    id: number

    @Column()
    number: number

    @Column({ nullable: true })
    demo: string

    @Column({ type: 'timestamptz', nullable: true })
    finishedAt: Date

    @ManyToOne(() => Game, (game) => game.maps, { onDelete: "SET NULL" })
    game: Game

    @OneToMany(() => PlayerStat, (stat) => stat.map, { cascade: true })
    playerStats: PlayerStat[]


}
