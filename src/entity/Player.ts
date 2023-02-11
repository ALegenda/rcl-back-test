import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, AfterUpdate, BeforeInsert, AfterLoad } from "typeorm"
import { PlayerStat } from "./PlayerStat"
import { Team } from "./Team"

@Entity()
export class Player {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    nickName: string

    @Column()
    steamId: string

    @Column()
    age: number

    @Column()
    country: string

    @Column({ nullable: true })
    countryLogo: string

    @Column({ nullable: true })
    imageUrl: string

    @BeforeInsert()
    setImage() {
        if (this.imageUrl === "" || this.imageUrl === null) {
            this.imageUrl = "https://iili.io/HayAEdb.png"
        }
    }

    @ManyToOne(() => Team, (team) => team.players, { onDelete: "SET NULL" })
    team: Team

    @OneToMany(() => PlayerStat, (stat) => stat.player)
    playerStats: PlayerStat[]

    @Column({ nullable: true })
    totalKills: number

    @BeforeInsert()
    setKills() {
        this.totalKills = 0
    }

    @Column({ nullable: true })
    totalGames: number

    @BeforeInsert()
    setGames() {
        this.totalGames = 0
    }

    @Column({ nullable: true })
    totalMaps: number

    @BeforeInsert()
    setMaps() {
        this.totalMaps = 0
    }

    @Column({ nullable: true })
    totalDeaths: number

    @BeforeInsert()
    setDeaths() {
        this.totalDeaths = 0
    }

    @Column({ nullable: true })
    totalAssists: number

    @BeforeInsert()
    setAssists() {
        this.totalAssists = 0
    }

    @Column({
        nullable: true,
        type: "float",
    })
    totalKd: number

    // @AfterLoad()
    // updateKd() {
    //     this.totalKd = this.totalKills/this.totalDeaths
    // }

}
