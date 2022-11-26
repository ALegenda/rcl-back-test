import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from "typeorm"
import { Map } from "./Map"
import { Team } from "./Team"

@Entity()
export class Game {

    @PrimaryGeneratedColumn()
    id: number

    @ManyToMany(() => Team, { onDelete: "SET NULL" })
    @JoinTable()
    teams: Team[]

    @OneToMany(() => Map, (map) => map.game, { cascade: true })
    maps: Map[]

    @Column({ nullable: true })
    matchSeriesId: string

}
