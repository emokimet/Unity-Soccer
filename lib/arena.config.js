"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tools_1 = __importDefault(require("@colyseus/tools"));
const ws_transport_1 = require("@colyseus/ws-transport");
const monitor_1 = require("@colyseus/monitor");
/**
 * Import your Room files
 */
const OneVSOneGameRoom_1 = require("./rooms/OneVSOneGameRoom");
const TournmentRoom_1 = require("./rooms/TournmentRoom");
global.ONEVSONE_GAMETIME = 9000;
global.TWOVSTWO_GAMETIME = 90;
global.SEMIFINAL_GAMETIME = 75;
global.FINAL_GAMETIME = 85;
// NOTE : only change the last decimal, don't change the zeros....
global.HEADKICK_VELOCITY_X = 0.000006;
global.HEADKICK_VELOCITY_Y = 0.000007;
exports.default = (0, tools_1.default)({
    getId: () => "Your Colyseus App",
    initializeTransport: function (opts) {
        return new ws_transport_1.WebSocketTransport(Object.assign(Object.assign({}, opts), { pingInterval: 6000, pingMaxRetries: 4 }));
    },
    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        gameServer.define('1v1', OneVSOneGameRoom_1.OneVSOneGameRoom);
        gameServer.define('2v2', OneVSOneGameRoom_1.OneVSOneGameRoom);
        // room names defined as : gameMode_coinAmount....
        gameServer.define('1v1_100', OneVSOneGameRoom_1.OneVSOneGameRoom);
        gameServer.define('1v1_500', OneVSOneGameRoom_1.OneVSOneGameRoom);
        gameServer.define('1v1_1000', OneVSOneGameRoom_1.OneVSOneGameRoom);
        gameServer.define('1v1_5000', OneVSOneGameRoom_1.OneVSOneGameRoom);
        gameServer.define('1v1_20000', OneVSOneGameRoom_1.OneVSOneGameRoom);
        gameServer.define('1v1_50000', OneVSOneGameRoom_1.OneVSOneGameRoom);
        gameServer.define('2v2_100', OneVSOneGameRoom_1.OneVSOneGameRoom);
        gameServer.define('2v2_500', OneVSOneGameRoom_1.OneVSOneGameRoom);
        gameServer.define('2v2_1000', OneVSOneGameRoom_1.OneVSOneGameRoom);
        gameServer.define('2v2_5000', OneVSOneGameRoom_1.OneVSOneGameRoom);
        gameServer.define('2v2_20000', OneVSOneGameRoom_1.OneVSOneGameRoom);
        gameServer.define('2v2_50000', OneVSOneGameRoom_1.OneVSOneGameRoom);
        gameServer.define("tournment_500", TournmentRoom_1.TournmentRoom);
        gameServer.define("tournment_1000", TournmentRoom_1.TournmentRoom);
        gameServer.define('tablet_1v1_100', OneVSOneGameRoom_1.OneVSOneGameRoom, { tablet: true });
        gameServer.define('tablet_1v1_500', OneVSOneGameRoom_1.OneVSOneGameRoom, { tablet: true });
        gameServer.define('tablet_1v1_1000', OneVSOneGameRoom_1.OneVSOneGameRoom, { tablet: true });
        gameServer.define('tablet_1v1_5000', OneVSOneGameRoom_1.OneVSOneGameRoom, { tablet: true });
        gameServer.define('tablet_1v1_20000', OneVSOneGameRoom_1.OneVSOneGameRoom, { tablet: true });
        gameServer.define('tablet_1v1_50000', OneVSOneGameRoom_1.OneVSOneGameRoom, { tablet: true });
        gameServer.define('tablet_2v2_100', OneVSOneGameRoom_1.OneVSOneGameRoom, { tablet: true });
        gameServer.define('tablet_2v2_500', OneVSOneGameRoom_1.OneVSOneGameRoom, { tablet: true });
        gameServer.define('tablet_2v2_1000', OneVSOneGameRoom_1.OneVSOneGameRoom, { tablet: true });
        gameServer.define('tablet_2v2_5000', OneVSOneGameRoom_1.OneVSOneGameRoom, { tablet: true });
        gameServer.define('tablet_2v2_20000', OneVSOneGameRoom_1.OneVSOneGameRoom, { tablet: true });
        gameServer.define('tablet_2v2_50000', OneVSOneGameRoom_1.OneVSOneGameRoom, { tablet: true });
        gameServer.define("tablet_tournment_500", TournmentRoom_1.TournmentRoom, { tablet: true });
        gameServer.define("tablet_tournment_1000", TournmentRoom_1.TournmentRoom, { tablet: true });
    },
    initializeExpress: (app) => {
        /**
         * Bind your custom express routes here:
         */
        app.get("/", (req, res) => {
            res.send("Main route");
        });
        /**
         * Bind @colyseus/monitor
         * It is recommended to protect this route with a password.
         * Read more: https://docs.colyseus.io/tools/monitor/
         */
        app.use("/colyseus", (0, monitor_1.monitor)());
    },
    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }
});
