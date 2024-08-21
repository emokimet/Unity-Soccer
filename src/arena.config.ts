import config from "@colyseus/tools";
import { WebSocketTransport } from "@colyseus/ws-transport"
import { monitor } from "@colyseus/monitor";

/**
 * Import your Room files
 */
import { OneVSOneGameRoom } from "./rooms/OneVSOneGameRoom";
import { TournmentRoom } from "./rooms/TournmentRoom";

global.ONEVSONE_GAMETIME = 90;
global.TWOVSTWO_GAMETIME = 90;

global.SEMIFINAL_GAMETIME = 75;
global.FINAL_GAMETIME = 85;

// NOTE : only change the last decimal, don't change the zeros....
global.HEADKICK_VELOCITY_X = 0.000006;
global.HEADKICK_VELOCITY_Y = 0.000007;

export default config({
    getId: () => "Your Colyseus App",

    initializeTransport: function(opts) {
        return new WebSocketTransport({
          ...opts,
          pingInterval: 6000,
          pingMaxRetries: 4,
        });
      },
    
    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        gameServer.define('1v1', OneVSOneGameRoom);
        gameServer.define('2v2', OneVSOneGameRoom);

        // room names defined as : gameMode_coinAmount....
        gameServer.define('1v1_100', OneVSOneGameRoom);
        gameServer.define('1v1_500', OneVSOneGameRoom);
        gameServer.define('1v1_1000', OneVSOneGameRoom);
        gameServer.define('1v1_5000', OneVSOneGameRoom);
        gameServer.define('1v1_20000', OneVSOneGameRoom);
        gameServer.define('1v1_50000', OneVSOneGameRoom);

        gameServer.define('2v2_100', OneVSOneGameRoom);
        gameServer.define('2v2_500', OneVSOneGameRoom);
        gameServer.define('2v2_1000', OneVSOneGameRoom);
        gameServer.define('2v2_5000', OneVSOneGameRoom);
        gameServer.define('2v2_20000', OneVSOneGameRoom);
        gameServer.define('2v2_50000', OneVSOneGameRoom);

        gameServer.define("tournment_500", TournmentRoom);
        gameServer.define("tournment_1000", TournmentRoom);


        gameServer.define('tablet_1v1_100', OneVSOneGameRoom, {tablet:true});
        gameServer.define('tablet_1v1_500', OneVSOneGameRoom, {tablet:true});
        gameServer.define('tablet_1v1_1000', OneVSOneGameRoom, {tablet:true});
        gameServer.define('tablet_1v1_5000', OneVSOneGameRoom, {tablet:true});
        gameServer.define('tablet_1v1_20000', OneVSOneGameRoom, {tablet:true});
        gameServer.define('tablet_1v1_50000', OneVSOneGameRoom, {tablet:true});

        gameServer.define('tablet_2v2_100', OneVSOneGameRoom, {tablet:true});
        gameServer.define('tablet_2v2_500', OneVSOneGameRoom, {tablet:true});
        gameServer.define('tablet_2v2_1000', OneVSOneGameRoom, {tablet:true});
        gameServer.define('tablet_2v2_5000', OneVSOneGameRoom, {tablet:true});
        gameServer.define('tablet_2v2_20000', OneVSOneGameRoom, {tablet:true});
        gameServer.define('tablet_2v2_50000', OneVSOneGameRoom, {tablet:true});

        gameServer.define("tablet_tournment_500", TournmentRoom, {tablet:true});
        gameServer.define("tablet_tournment_1000", TournmentRoom, {tablet:true});


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
        app.use("/colyseus", monitor());
    },


    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }
});