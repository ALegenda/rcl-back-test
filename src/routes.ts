import { NewsController } from "./controller/NewsController";
import { PlayerController } from "./controller/PlayerController";
import { TeamController } from "./controller/TeamController";


export const Routes = [
    {
        method: "post",
        route: "/match",
        controller: NewsController,
        action: "match"
    },{
        method: "get",
        route: "/",
        controller: NewsController,
        action: "kek"
    }, {
        method: "get",
        route: "/players",
        controller: PlayerController,
        action: "all"
    }, {
        method: "get",
        route: "/players/:id",
        controller: PlayerController,
        action: "one"
    }, {
        method: "get",
        route: "/players/stats/:id",
        controller: PlayerController,
        action: "stats"
    }, {
        method: "post",
        route: "/players",
        controller: PlayerController,
        action: "save"
    }, {
        method: "delete",
        route: "/players/:id",
        controller: PlayerController,
        action: "remove"
    }, {
        method: "get",
        route: "/teams",
        controller: TeamController,
        action: "all"
    }, {
        method: "get",
        route: "/teams/:id",
        controller: TeamController,
        action: "one"
    }, {
        method: "get",
        route: "/teams/lineup/:id",
        controller: TeamController,
        action: "lineup"
    },
    {
        method: "post",
        route: "/teams",
        controller: TeamController,
        action: "save"
    }, {
        method: "delete",
        route: "/teams/:id",
        controller: TeamController,
        action: "remove"
    }, {
        method: "get",
        route: "/news",
        controller: NewsController,
        action: "all"
    }, {
        method: "get",
        route: "/news/:id",
        controller: NewsController,
        action: "one"
    }, {
        method: "post",
        route: "/news",
        controller: NewsController,
        action: "save"
    }, {
        method: "delete",
        route: "/news/:id",
        controller: NewsController,
        action: "remove"
    }]