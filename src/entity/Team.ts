import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert } from "typeorm"
import { Game } from "./Game"
import { Player } from "./Player"

@Entity()
export class Team {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true })
    name: string
    
    @Column({ nullable: true })
    hltvName: string

    @Column({ nullable: true })
    country: string

    @Column({ nullable: true })
    countryLogo: string

    @Column({ nullable: true })
    logo: string

    @Column({ nullable: true })
    logoDark: string

    @Column()
    city: string

    @OneToMany(() => Player, (player) => player.team)
    players: Player[]

    @Column({ nullable: true })
    totalKills: number

    @BeforeInsert()
    setKills(){
        this.totalKills = 0
    }

    @Column({ nullable: true })
    totalGames: number
    

    @BeforeInsert()
    setGames(){
        this.totalGames = 0
    }

    @Column({ nullable: true })
    totalMaps: number

    @BeforeInsert()
    setMaps(){
        this.totalMaps = 0
    }

    @Column({ nullable: true })
    totalDeaths: number

    @BeforeInsert()
    setDeaths(){
        this.totalDeaths = 0
    }

    @Column({ nullable: true })
    totalAssists: number

    @BeforeInsert()
    setAssists(){
        this.totalAssists = 0
    }

    @Column({ nullable: true })
    totalWins: number

    @BeforeInsert()
    setWins(){
        this.totalWins = 0
    }

    @Column({ nullable: true })
    totalDraws: number

    @BeforeInsert()
    setDraws(){
        this.totalDraws = 0
    }

    @Column({ nullable: true })
    totalLoses: number

    @BeforeInsert()
    setLoses(){
        this.totalLoses = 0
    }

    @Column({ nullable: true })
    totalPoints: number

    @BeforeInsert()
    setPoints(){
        this.totalPoints = 0
    }

}
