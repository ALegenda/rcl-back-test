import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, AfterUpdate, BeforeInsert } from "typeorm"
import { PlayerStat } from "./PlayerStat"
import { Team } from "./Team"

@Entity()
export class Player {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    first_name: string

    @Column()
    last_name: string

    @Column()
    nick_name: string

    @Column()
    steam_id: string

    @Column()
    age: number

    @Column()
    country: string

    @Column({ nullable: true })
    image_url: string

    @ManyToOne(() => Team, (team) => team.players, { onDelete: "SET NULL" })
    team: Team

    @OneToMany(() => PlayerStat, (stat) => stat.player)
    playerStats: PlayerStat[]

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

}
