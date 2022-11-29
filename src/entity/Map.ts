import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, BeforeInsert } from "typeorm"
import { Game } from "./Game"
import { PlayerStat } from "./PlayerStat"

export enum MapStatus {
    CANCELED = "canceled",
    PENDING = "pending",
    STARTED = "started",
    FINISHED = "finished",
    CLINCH = "clinch"
}

@Entity()
export class Map {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true })
    DatHostId: string

    @Column()
    number: number

    @Column({ nullable: true })
    demo: string

    @Column({ type: 'timestamptz', nullable: true })
    startedAt: Date

    @Column({ type: 'timestamptz', nullable: true })
    finishedAt: Date

    @ManyToOne(() => Game, (game) => game.maps, { onDelete: "SET NULL" })
    game: Game

    @OneToMany(() => PlayerStat, (stat) => stat.map, { cascade: true })
    playerStats: PlayerStat[]

    @Column({
        type: "enum",
        enum: MapStatus,
        default: MapStatus.PENDING,
    })
    status: MapStatus

    @Column()
    team1Id: number

    @Column()
    team2Id: number

    @Column()
    team1Score: number

    @Column()
    team2Score: number

    @Column({ nullable: true })
    mapName: string

}
