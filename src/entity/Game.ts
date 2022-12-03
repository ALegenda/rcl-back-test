import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from "typeorm"
import { Map } from "./Map"
import { Team } from "./Team"

export enum GameStatus {
    CANCELED = "canceled",
    PENDING = "pending",
    STARTED = "started",
    FINISHED = "finished",
}

@Entity()
export class Game {

    @PrimaryGeneratedColumn()
    id: number

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

    @Column({
        type: "enum",
        enum: GameStatus,
        default: GameStatus.PENDING,
    })
    status: GameStatus


}
