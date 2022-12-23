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
    country: string

    @Column({ nullable: true })
    country_logo: string

    @Column({ nullable: true })
    logo: string

    @Column()
    city: string

    @OneToMany(() => Player, (player) => player.team)
    players: Player[]

    @Column({ nullable: true })
    total_kills: number

    @BeforeInsert()
    setKills(){
        this.total_kills = 0
    }

    @Column({ nullable: true })
    total_games: number

    @BeforeInsert()
    setGames(){
        this.total_games = 0
    }

    @Column({ nullable: true })
    total_maps: number

    @BeforeInsert()
    setMaps(){
        this.total_maps = 0
    }

    @Column({ nullable: true })
    total_deaths: number

    @BeforeInsert()
    setDeaths(){
        this.total_deaths = 0
    }

    @Column({ nullable: true })
    total_assists: number

    @BeforeInsert()
    setAssists(){
        this.total_assists = 0
    }

    @Column({ nullable: true })
    total_wins: number

    @BeforeInsert()
    setWins(){
        this.total_wins = 0
    }

    @Column({ nullable: true })
    total_loses: number

    @BeforeInsert()
    setLoses(){
        this.total_loses = 0
    }

}
