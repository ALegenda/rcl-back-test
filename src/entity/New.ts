import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, BeforeInsert } from "typeorm"
import { Game } from "./Game"
import { PlayerStat } from "./PlayerStat"

@Entity()
export class New {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'timestamptz' })
    createdDate: Date

    @BeforeInsert()
    updateDates() {
        this.createdDate = new Date()
    }

    @Column()
    title: string

    @Column()
    promo: string

    @Column()
    content: string

    @Column()
    imageUrl: string

}
