"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneVSOneGameRoom = void 0;
const colyseus_1 = require("colyseus");
const NetworkPlayer_1 = require("./schema/NetworkPlayer");
const OneVSOneRoomState_1 = require("./schema/OneVSOneRoomState");
const GameController_1 = require("../GameController");
const { convertToObject } = require("typescript");
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LIFTING_TIME = 5000;
function generateRoomIdSingle() {
    let result = '';
    for (var i = 0; i < 6; i++) {
        result += LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
    }
    return result;
}
class OneVSOneGameRoom extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        this.maxClients = 2;
        this.gameController = new GameController_1.GameController();
        this.hasGameStarted = false;
        this.isWaiting = false;
        this.OneVOneChannel = "$1v1";
        this.shouldContinueCount = true;
        this.is2v2 = false;
        this.ad_count = 0;
        this.heli_count = 0;
        this.has_sent_heli1 = false;
        this.has_sent_heli2 = false;
    }
    generateRoomId() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentIds = yield this.presence.smembers(this.OneVOneChannel);
            let id;
            do {
                id = generateRoomIdSingle();
                console.log('room id: ', id);
            } while (currentIds.includes(id));
            yield this.presence.sadd(this.OneVOneChannel, id);
            return id;
        });
    }
    onCreate(options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setState(new OneVSOneRoomState_1.OneVSOneRoomState());
            if (options.is2v2) {
                this.maxClients = 4;
                this.is2v2 = true;
                this.state.seconds_left = global.TWOVSTWO_GAMETIME;
            }
            if (options.isPrivate) {
                this.setPrivate(true);
            }
            this.setPatchRate(5);
            this.roomId = yield this.generateRoomId();
            if (options.matchNumber) {
                this.state.tournmentMatchNumber = options.matchNumber;
            }
            if (options.gameTime) {
                this.state.seconds_left = options.gameTime;
            }
            this.gameController.roomState = this.state;
            this.gameController.gameRoom = this;
            if (options.tablet) {
                this.state.isTablet = true;
                this.gameController.isUsingTablet = true;
            }
            this.state.amount_coins = options.amount_coins;
            if (options.isTournment) {
                this.state.isTournment = true;
            }
            if (!this.state.isTournment && !options.is2v2) {
                this.state.seconds_left = global.ONEVSONE_GAMETIME;
            }
            this.clock.start();
            this.gameController.clock = this.clock;
            this.gameController.setUpEnv();
            this.setSimulationInterval((deltaTime) => this.onUpdate(deltaTime), 16.6);
            this.clock.setInterval(() => {
                if (this.hasGameStarted && this.shouldContinueCount) {
                    this.state.seconds_left -= 1;
                }
            }, 1000);
            this.onMessage("host_start_setup_game", (client) => {
                if (client.userData.isHost) {
                    if (this.canStartGame()) {
                        this.state.gameState = OneVSOneRoomState_1.GameSessionState.SETTING_UP;
                    }
                }
            });
            this.onMessage("host_start_game", (client) => {
                console.log("started game ????");
                if (client.userData.isHost) {
                    this.isWaiting = true;
                }
            });
            this.onMessage("loading_ready", (client) => {
                client.userData.hasLoaded = true;
                this.checkLoadedClients();
            });
            this.onMessage("send_message", (client, message) => {
                var resp = { sender: client.userData.playerID, messageID: message };
                this.broadcast("message_broadcast", JSON.stringify(resp));
            });
            this.onMessage("send_emoji", (client, message) => {
                var resp = { sender: client.userData.playerID, messageID: message };
                this.broadcast("emoji_broadcast", JSON.stringify(resp));
            });
            this.onMessage("shoot_fire", (client) => {
                this.gameController.shootBallFire(client.userData, this.state.ball, this.clock);
            });
            this.onMessage("shoot_ball", (client) => {
                this.gameController.shootBall(client.userData.playerID, client.userData.playerShoot / 100000, client.userData.playerAngleShot);
                this.clients.forEach((client_1) => {
                    client_1.send("shot_ball", client.userData.playerID);
                });
            });
            this.onMessage("start_move_left", (client) => {
                client.userData.isWalkingLeft = this.gameController.startMovePlayerLeft(client.userData.playerID, client.userData.playerVelocity);
            });
            this.onMessage("stop_move_left", (client) => {
                client.userData.isWalkingLeft = false;
                this.gameController.stopMovePlayerLeft(client.userData.playerID);
            });
            this.onMessage("start_move_right", (client) => {
                client.userData.isWalkingRight = this.gameController.startMovePlayerRight(client.userData.playerID, client.userData.playerVelocity);
                this.gameController.startMovePlayerRight(client.userData.playerID, client.userData.playerVelocity);
                this.clients.forEach((client_1) => {
                    client_1.send("start_move_right", client.userData.isWalkingRight);
                });
            });
            this.onMessage("stop_move_right", (client) => {
                client.userData.isWalkingRight = false;
                this.broadcast("start_move_right", client.userData.isWalkingRight);
                this.gameController.stopMovePlayerRight(client.userData.playerID);
            });
            this.onMessage("jump", (client) => {
                this.gameController.jumpPlayer(client.userData.playerID, client.userData.playerJumpForce / 100000);
            });
            this.onMessage("set_ad_count", (client, message) => {
                if (this.checkHostPrivileges(client)) {
                    this.ad_count = message;
                    console.log("set_ad_count", message);
                }
            });
            this.onMessage("set_heli_count", (client, message) => {
                if (this.checkHostPrivileges(client)) {
                    this.heli_count = message;
                    console.log("set_heli_count", message);
                }
            });
            this.onMessage("set_stadium", (client, message) => {
                if (this.checkHostPrivileges(client)) {
                    this.state.stadium_id = message;
                    console.log("set_stadium", message);
                }
            });
            this.onMessage("set_ball", (client, message) => {
                if (this.checkHostPrivileges(client)) {
                    this.state.ball_id = message;
                    console.log("set_ball", message);
                }
            });
            this.onMessage("set_head", (client, message) => {
                client.userData.selected_head = message;
            });
            this.onMessage("use_ice", (client) => {
                var clientIndex = client.userData.playerID;
                var victimIndex = clientIndex>1 ? (clientIndex==2 ? 3 : 2) : (clientIndex==0 ? 1 : 0);
                this.gameController.usedIce(client.userData, this.clients[victimIndex].userData, this.clock);
            });
            this.onMessage("use_x2", (client) => {
                this.gameController.usedX2(client.userData, this.clock);
            });
            this.onMessage("use_electricity", (client, message)=>{
                var clientIndex = client.userData.playerID;
                var victimIndex = clientIndex>1 ? (clientIndex==2 ? 3 : 2) : (clientIndex==0 ? 1 : 0);
                console.log('victim xPos: ', this.clients[victimIndex].userData.xPos);

                if(this.clients[victimIndex].userData.xPos>-8 && this.clients[victimIndex].userData.xPos<8)
                    this.gameController.usedElectricity(client.userData, this.clients[victimIndex].userData, this.clock, client.userData.playerJumpForce / 100000, LIFTING_TIME);
            });
            this.onMessage("use_leaves", (client) => {
                var clientIndex = client.userData.playerID;
                var victimIndex = clientIndex>1 ? (clientIndex==2 ? 3 : 2) : (clientIndex==0 ? 1 : 0);
                if(this.clients[victimIndex].userData.xPos>-8 && this.clients[victimIndex].userData.xPos<8)
                    this.gameController.usedLeaves(client.userData,  this.clients[victimIndex].userData, this.clock, client.userData.playerJumpForce / 100000, LIFTING_TIME);
            });
            this.onMessage("flip", (client) => {
                console.log('flip');
                this.gameController.flipPlayer(client.userData.playerID, client.userData.playerShoot / 100000, client.userData.playerAngleShot);
                this.clients.forEach((client_1) => {
                    client_1.send("shot_flip", client.userData.playerID);
                })
                //flipPlayer(client);
            })
            //Back Left flip of the online character
            this.onMessage("left_flip", (client) => {
                console.log('left_flip');
                this.gameController.flipPlayer(client.userData.playerID, client.userData.playerShoot / 100000, client.userData.playerAngleShot);
                this.clients.forEach((client_1) => {
                    client_1.send("shot_left_flip", client.userData.playerID);
                })
            })
            this.onMessage("set_velocity", (client, message) => {
                client.userData.playerVelocity = message;
                console.log("velocity:", message);
            });
            this.onMessage("set_shoot", (client, message) => {
                client.userData.playerShoot = message;
                console.log("shoot:", message);
            });
            this.onMessage("set_jumpForce", (client, message) => {
                client.userData.playerJumpForce = message;
                console.log("jump:", message);
            });
            this.onMessage("set_angle_shot", (client, message) => {
                client.userData.playerAngleShot = message;
                console.log("angle shot : ", message);
            });
        });
    }
    checkHostPrivileges(client) {
        if (client.userData.isHost) {
            if (this.state.gameState == OneVSOneRoomState_1.GameSessionState.SETTING_UP) {
                return true;
            }
        }
        return false;
    }
    checkLoadedClients() {
        console.log('checkLoadedClients');
        var loadedClients = 0;
        this.clients.forEach((client) => {
            if (client.userData.hasLoaded) {
                loadedClients++;
            }
        });
        if (loadedClients == this.clients.length) {
            this.clock.setTimeout(() => {
                this.startGame();
            }, 3000);
        }
    }
    startGame() {
        console.log("game started");
        this.hasGameStarted = true;
        this.gameController.hasGameStarted = true;
        this.gameController.createBall(this.state.ball.xPos, this.state.ball.yPos);
        
    }
    canStartGame() {
        if (this.clients.length == this.maxClients) {
            return true;
        }
        return false;
    }
    onJoin(client, options) {
        // construct network players accordingly...
        var currentPlayer;
        if (this.state.leftPlayer == null) {
            this.state.leftPlayer = new NetworkPlayer_1.NetworkPlayer();
            this.state.leftPlayer.side = 0;
            this.state.leftPlayer.xPos = -5;
            this.state.leftPlayer.yPos = -2.5;
            this.state.leftPlayer.playerName = options.name;
            client.userData = this.state.leftPlayer;
            currentPlayer = this.state.leftPlayer;
            console.log("filled player 1");
            
        }
        else if (this.state.rightPlayer == null) {
            this.state.rightPlayer = new NetworkPlayer_1.NetworkPlayer();
            this.state.rightPlayer.side = 1;
            this.state.rightPlayer.xPos = 5;
            this.state.rightPlayer.yPos = -2.5;
            this.state.rightPlayer.playerName = options.name;
            client.userData = this.state.rightPlayer;
            currentPlayer = this.state.rightPlayer;
            console.log("filled player 2");
        }
        else if (this.state.leftPlayer1 == null) {
            this.state.leftPlayer1 = new NetworkPlayer_1.NetworkPlayer();
            this.state.leftPlayer1.side = 0;
            this.state.leftPlayer1.xPos = -3;
            this.state.leftPlayer1.yPos = -2.5;
            this.state.leftPlayer1.playerName = options.name;
            client.userData = this.state.leftPlayer1;
            currentPlayer = this.state.leftPlayer1;
            console.log("filled player 3");
        }
        else if (this.state.rightPlayer1 == null) {
            this.state.rightPlayer1 = new NetworkPlayer_1.NetworkPlayer();
            this.state.rightPlayer1.side = 1;
            this.state.rightPlayer1.xPos = 3;
            this.state.rightPlayer1.yPos = -2.5;
            this.state.rightPlayer1.playerName = options.name;
            client.userData = this.state.rightPlayer1;
            currentPlayer = this.state.rightPlayer1;
            console.log("filled player 4");
        }
        // if this is the first client to connect to the room, give it host privileges 
        if (this.clients.length == 1) {
            client.userData.isHost = true;
            console.log("assigned host");
        }
        client.userData.playerID = this.clients.length - 1;
        // create physics body for player...
        this.gameController.createPlayer(client.userData.xPos, client.userData.yPos, client.userData.side, client.userData.playerID);
        if (this.clients.length == this.maxClients) {
            console.log("ready to start");
            this.state.ready_to_start = true;
        }
        console.log(options.name);
        // make the client assign the player.
        client.send("assign_player", JSON.stringify(client.userData.toJSON()));
        this.clients.forEach((otherClient) => {
            if (otherClient != client) {
                client.send("player_joined", JSON.stringify(otherClient.userData.toJSON()));
            }
        });
        this.broadcast("player_joined", JSON.stringify(currentPlayer.toJSON()), { except: client });
    }
    onUpdate(deltaTime) {
        if (this.isWaiting) {
            var ready_clients = 0;
            this.clients.forEach((client) => {
                if (client.userData.selected_head != -1) {
                    ready_clients++;
                }
            });
            if (ready_clients == this.maxClients) {
                this.state.gameState = OneVSOneRoomState_1.GameSessionState.PLAYING;
                this.isWaiting = false;
            }
        }
        if (this.hasGameStarted) {
            this.gameController.stepSimulation();
            // update players position....
            
            if (this.state.leftPlayer != null) {
                this.state.leftPlayer.xPos = this.gameController.players[0].body.position.x;
                this.state.leftPlayer.yPos = this.gameController.players[0].body.position.y;
                this.state.leftPlayer.zRotation = this.gameController.players[0].body.angle;

            }
            if (this.state.rightPlayer != null) {
                this.state.rightPlayer.xPos = this.gameController.players[1].body.position.x;
                this.state.rightPlayer.yPos = this.gameController.players[1].body.position.y;
                this.state.rightPlayer.zRotation = this.gameController.players[1].body.angle;
            }
            if (this.state.leftPlayer1 != null) {
                this.state.leftPlayer1.xPos = this.gameController.players[2].body.position.x;
                this.state.leftPlayer1.yPos = this.gameController.players[2].body.position.y;
                this.state.leftPlayer.zRotation = this.gameController.players[2].body.angle;
            }
            if (this.state.rightPlayer1 != null) {
                this.state.rightPlayer1.xPos = this.gameController.players[3].body.position.x;
                this.state.rightPlayer1.yPos = this.gameController.players[3].body.position.y;
                this.state.leftPlayer.zRotation = this.gameController.players[3].body.angle;
            }
            // update ball position
            this.state.ball.xPos = this.gameController.ball.position.x;
            this.state.ball.yPos = this.gameController.ball.position.y;
            this.state.ball.rotation = this.gameController.ball.angle;
            // update goal status
            this.state.goals_left = this.gameController.leftGoals;
            this.state.goals_right = this.gameController.rightGoals;
            this.state.RightPostX = this.gameController.goalPostRightX + this.gameController.goalPostRightWidth*0.75;
            this.state.RightPostY = this.gameController.goalPostRightY;
            this.state.RightPostWidth = this.gameController.goalPostRightWidth;
            this.state.RightPostHeight = this.gameController.goalPostRightHeight;
            this.state.RightPostAngle = this.gameController.goalPostRightAngle;
            this.state.LeftPostX = this.gameController.goalPostLeftX - this.gameController.goalPostRightWidth*0.75;
            this.state.LeftPostY = this.gameController.goalPostLeftY;
            this.state.LeftPostWidth = this.gameController.goalPostLeftWidth;
            this.state.LeftPostHeight = this.gameController.goalPostLeftHeight;
            this.state.LeftPostAngle = this.gameController.goalPostLeftAngle;
            this.state.LeftDetectorX = this.gameController.goalLeftX;
            this.state.LeftDetectorY = this.gameController.goalLeftY;
            this.state.LeftDetectorWidth = this.gameController.defaultGoalWidth;
            this.state.LeftDetectorHeight = this.gameController.defaultGoalHeight;
            this.state.FootSensorX = this.gameController.players[0].footSensor.position.x;
            this.state.FootSensorY = this.gameController.players[0].footSensor.position.y;
            var { min, max } = this.gameController.players[0].footSensor.bounds;
            var width = max.x - min.x;
            var height = max.y - min.y;
            this.state.FootSensorWidth = width;
            this.state.FootSensorHeight = height;
            this.state.RightDetectorX = this.gameController.goalRightX;

            this.state.RightDetectorY = this.gameController.goalRightY;
            this.state.RightDetectorWidth = this.gameController.defaultGoalWidth;
            this.state.RightDetectorHeight = this.gameController.defaultGoalHeight;
            this.state.RoofX = this.gameController.roofX;
            this.state.RoofY = this.gameController.roofY;
            this.state.RoofWidth = this.gameController.roofWidth;
            this.state.RoofHeight = this.gameController.roofHeight;
            if (this.state.seconds_left <= 0) {
                this.state.seconds_left = 0;
                if (this.state.goals_left == this.state.goals_right && this.state.isTournment) {
                    this.state.waitingForGoldenGoal = true;
                }
                if (!this.state.waitingForGoldenGoal) {
                    this.state.gameState = OneVSOneRoomState_1.GameSessionState.WAITING_FOR_PLAYERS;
                    this.clock.setTimeout(() => {
                        this.clients.forEach((client) => {
                            client.leave();
                        });
                    }, 5000);
                }
            }
        }
        // here is the spawn at 35 seconds
        if (this.state.seconds_left == 35) {
            if (!this.has_sent_heli1) {
                var str = "";
                var adId = this.getRandomInt(this.ad_count);
                var heliId = this.getRandomInt(this.heli_count);
                var str2 = str.concat(adId.toString());
                var str3 = str2.concat("-");
                var str4 = str3.concat(heliId.toString());
                this.broadcast("spawn_helicopter", str4);
                this.has_sent_heli1 = true;
            }
        }
        // here is the spawn it 80 seconds
        if (this.state.seconds_left == 80) {
            if (!this.has_sent_heli2) {
                var str = "";
                var adId = this.getRandomInt(this.ad_count);
                var heliId = this.getRandomInt(this.heli_count);
                var str2 = str.concat(adId.toString());
                var str3 = str2.concat("-");
                var str4 = str3.concat(heliId.toString());
                this.broadcast("spawn_helicopter", str4);
                this.has_sent_heli2 = true;
            }
        }
    }
    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    onLeave(client, consented) {
        if (this.state.leftPlayer == client.userData) {
            this.state.leftPlayer = null;
        }
        else if (this.state.rightPlayer == client.userData) {
            this.state.rightPlayer = null;
        }
        else if (this.state.leftPlayer1 == client.userData) {
            this.state.leftPlayer1 = null;
        }
        else if (this.state.rightPlayer1 == client.userData) {
            this.state.rightPlayer1 = null;
        }
        if (!this.state.isTournment) {
            this.clients.forEach((client) => {
                client.send("player_left");
            });
        }
        if (this.state.gameState == OneVSOneRoomState_1.GameSessionState.PLAYING) {
            this.shouldContinueCount = false;
            this.state.seconds_left = 0;
            if (client.userData.side == 0) {
                this.state.surrender_left = true;
            }
            if (client.userData.side == 1) {
                this.state.surrender_right = true;
            }
            this.clock.setTimeout(() => {
                this.clients.forEach((client) => {
                    client.leave();
                });
            }, 10000);
        }
    }
    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }
}
exports.OneVSOneGameRoom = OneVSOneGameRoom;
