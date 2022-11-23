import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from "typeorm"
import { Map } from "./Map"
import { Team } from "./Team"

@Entity()
export class Score {

    @PrimaryGeneratedColumn()
    id: number

}
