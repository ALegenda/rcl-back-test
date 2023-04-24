import { GameController } from "./controller/GameController";
import { NewsController } from "./controller/NewsController";
import { PlayerController } from "./controller/PlayerController";
import { TeamController } from "./controller/TeamController";


export const Routes = [
    {
        method: "post",
        route: "/creatematch",
        controller: GameController,
        action: "createMatch"
    },
    {
        method: "post",
        route: "/logs",
        controller: GameController,
        action: "logs"
    },
    {
        method: "post",
        route: "/planmatch",
        controller: GameController,
        action: "planMatch"
    },
    {
        method: "post",
        route: "/test",
        controller: GameController,
        action: "test"
    },
    {
        method: "post",
        route: "/games",
        controller: GameController,
        action: "save"
    },
    {
        method: "post",
        route: "/round",
        controller: GameController,
        action: "round"
    },
    {
        method: "get",
        route: "/pending",
        controller: GameController,
        action: "pending"
    },
    {
        method: "get",
        route: "/recalc",
        controller: GameController,
        action: "recalc"
    },
    {
        method: "get",
        route: "/games",
        controller: GameController,
        action: "all"
    },
    {
        method: "get",
        route: "/games/:id",
        controller: GameController,
        action: "one"
    },
    {
        method: "get",
        route: "/maps/:id",
        controller: GameController,
        action: "findMap"
    },
    {
        method: "get",
        route: "/test/:id",
        controller: GameController,
        action: "test"
    }, {
        method: "post",
        route: "/match/:id",
        controller: GameController,
        action: "match"
    }, {
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
    }, {
        method: "get",
        route: "/teams/matches/:id",
        controller: TeamController,
        action: "matches"
    }, {
        method: "get",
        route: "/players/matches/:id",
        controller: PlayerController,
        action: "matches"
    }, {
        method: "get",
        route: "/teams/stats/:id",
        controller: TeamController,
        action: "stats"
    },
    {
        method: "get",
        route: "/shortresults",
        controller: TeamController,
        action: "shortresults"
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