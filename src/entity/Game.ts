import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from "typeorm"
import { Map } from "./Map"
import { Team } from "./Team"

export enum GameStatus {
    CANCELED = "canceled",
    PENDING = "pending",
    STARTED = "started",
    FINISHED = "finished",
}

export enum GameStage {
    GROUP = "group",
    PLAYOFF = "playoff",
}

@Entity()
export class Game {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'timestamptz', nullable: true })
    startedAt: Date

    @ManyToMany(() => Team, { onDelete: "SET NULL", cascade: true })
    @JoinTable()
    teams: Team[]

    @OneToMany(() => Map, (map) => map.game, { cascade: true })
    maps: Map[]

    @Column({ nullable: true })
    matchSeriesId: string

    @Column()
    team1Id: number

    @Column()
    team2Id: number

    @Column()
    team1Score: number

    @Column()
    team2Score: number

    @Column({ nullable: true })
    week: number

    @Column({ nullable: true })
    stage: string

    @Column({
        type: "enum",
        enum: GameStatus,
        default: GameStatus.PENDING,
    })
    status: GameStatus


}
