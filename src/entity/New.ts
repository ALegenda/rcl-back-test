import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, BeforeInsert } from "typeorm"
import { Game } from "./Game"
import { PlayerStat } from "./PlayerStat"

@Entity()
export class New {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'timestamptz' })
    created_date: Date

    @BeforeInsert()
    updateDates() {
        this.created_date = new Date()
    }

    @Column()
    title: string

    @Column()
    promo: string

    @Column()
    content: string

    @Column()
    image_url: string

}
