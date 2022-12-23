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
    dathost_id: string

    @Column()
    number: number

    @Column({ nullable: true })
    demo: string

    @Column({ type: 'timestamptz', nullable: true })
    started_at: Date

    @Column({ type: 'timestamptz', nullable: true })
    finished_at: Date

    @ManyToOne(() => Game, (game) => game.maps, { onDelete: "SET NULL" })
    game: Game

    @OneToMany(() => PlayerStat, (stat) => stat.map, { cascade: true })
    player_stats: PlayerStat[]

    @Column({
        type: "enum",
        enum: MapStatus,
        default: MapStatus.PENDING,
    })
    status: MapStatus

    @Column()
    team1_id: number

    @Column()
    team2_id: number

    @Column()
    team1_score: number

    @Column()
    team2_score: number

    @Column({ nullable: true })
    map_name: string

}
