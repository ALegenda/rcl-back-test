import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Player } from "./Player"

@Entity()
export class Team {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    country: string

    @Column({ nullable: true })
    logo: string

    @Column()
    city: string

    @OneToMany(() => Player, (player) => player.team)
    players: Player[]

}
