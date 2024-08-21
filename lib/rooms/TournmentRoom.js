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
exports.TournmentRoom = void 0;
const colyseus_1 = require("colyseus");
const TournmentRoomState_1 = require("./schema/TournmentRoomState");
class ClientStatus {
    constructor() {
        this.name = "";
        this.isReady = false;
        this.id = 0;
        this.isQualified = false;
    }
}
class TournmentRoom extends colyseus_1.Room {
    onCreate(options) {
        this.maxClients = 4;
        this.setState(new TournmentRoomState_1.TournmentRoomState());
        this.state.fee = options.fee;
        this.onMessage("set_match1_winner", (client, message) => {
            this.state.match1Winner = message;
        });
        this.onMessage("set_match2_winner", (client, message) => {
            this.state.match2Winner = message;
        });
        this.onMessage("set_match3_winner", (client, message) => {
            this.state.match3Winner = message;
        });
        this.onMessage("matchFinished", (client, message) => {
            this.clients.forEach((client) => {
                client.userData.isReady = false;
            });
            this.state.player1Ready = false;
            this.state.player2Ready = false;
            this.state.player3Ready = false;
            this.state.player4Ready = false;
            this.state.match1WinnerReady = false;
            this.state.match2WinnerReady = false;
            var jsonmsg = JSON.parse(message);
            if (jsonmsg.matchNumber == 1) {
                this.state.match1Winner = jsonmsg.winnerName;
                this.state.hasFinishedMatch1 = true;
            }
            if (jsonmsg.matchNumber == 2) {
                this.state.match2Winner = jsonmsg.winnerName;
                this.state.hasFinishedMatch2 = true;
            }
            if (jsonmsg.matchNumber == 3) {
                this.state.match3Winner = jsonmsg.winnerName;
                this.state.hasFinishedMatch3 = true;
            }
            if (this.state.hasFinishedMatch1 && this.state.hasFinishedMatch2) {
                this.state.tournmentStage = TournmentRoomState_1.TournmentMatchStage.STAGE2;
            }
        });
        this.onMessage("mark_ready", (client, message) => {
            client.userData.isReady = true;
            if (this.state.tournmentStage == TournmentRoomState_1.TournmentMatchStage.STAGE1) {
                switch (client.userData.id) {
                    case 1:
                        {
                            this.state.player1Ready = true;
                            break;
                        }
                    case 2:
                        {
                            this.state.player2Ready = true;
                            break;
                        }
                    case 3:
                        {
                            this.state.player3Ready = true;
                            break;
                        }
                    case 4:
                        {
                            this.state.player4Ready = true;
                            break;
                        }
                    default:
                        break;
                }
                var ready_clients = 0;
                this.clients.forEach((c) => {
                    if (c.userData.isReady) {
                        ready_clients++;
                    }
                });
                if (ready_clients == 4) {
                    this.matchClients();
                }
            }
            else if (this.state.tournmentStage == TournmentRoomState_1.TournmentMatchStage.STAGE2) {
                if (this.state.match1Winner == client.userData.name) {
                    this.state.match1WinnerReady = true;
                }
                else if (this.state.match2Winner == client.userData.name) {
                    this.state.match2WinnerReady = true;
                }
                if (this.state.match1WinnerReady && this.state.match2WinnerReady) {
                    this.matchClients();
                }
            }
        });
    }
    matchClients() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.state.tournmentStage == TournmentRoomState_1.TournmentMatchStage.STAGE1) {
                var room1 = yield colyseus_1.matchMaker.createRoom("1v1", { isPrivate: true, isTournment: true, matchNumber: 1, gameTime: global.SEMIFINAL_GAMETIME });
                var client_1_res = yield colyseus_1.matchMaker.reserveSeatFor(room1, { isPrivate: true, isTournment: true, name: this.clients[0].userData.name });
                var client_2_res = yield colyseus_1.matchMaker.reserveSeatFor(room1, { isPrivate: true, isTournment: true, name: this.clients[1].userData.name });
                this.clients[0].send("tournament_match_entry", JSON.stringify(client_1_res));
                this.clients[1].send("tournament_match_entry", JSON.stringify(client_2_res));
                var room2 = yield colyseus_1.matchMaker.createRoom("1v1", { isPrivate: true, isTournment: true, matchNumber: 2, gameTime: global.SEMIFINAL_GAMETIME });
                var client_3_res = yield colyseus_1.matchMaker.reserveSeatFor(room2, { isPrivate: true, isTournment: true, name: this.clients[2].userData.name });
                var client_4_res = yield colyseus_1.matchMaker.reserveSeatFor(room2, { isPrivate: true, isTournment: true, name: this.clients[3].userData.name });
                this.clients[2].send("tournament_match_entry", JSON.stringify(client_3_res));
                this.clients[3].send("tournament_match_entry", JSON.stringify(client_4_res));
            }
            else if (this.state.tournmentStage == TournmentRoomState_1.TournmentMatchStage.STAGE2) {
                var finalRoom = yield colyseus_1.matchMaker.createRoom("1v1", { isPrivate: true, isTournment: true, matchNumber: 3, gameTime: global.FINAL_GAMETIME });
                this.clients.forEach((client) => __awaiter(this, void 0, void 0, function* () {
                    if (client.userData.name == this.state.match1Winner) {
                        var winner_seat1 = yield colyseus_1.matchMaker.reserveSeatFor(finalRoom, { isPrivate: true, isTournment: true, name: client.userData.name });
                        client.send("tournament_match_entry", JSON.stringify(winner_seat1));
                    }
                    if (client.userData.name == this.state.match2Winner) {
                        var winner_seat2 = yield colyseus_1.matchMaker.reserveSeatFor(finalRoom, { isPrivate: true, isTournment: true, name: client.userData.name });
                        client.send("tournament_match_entry", JSON.stringify(winner_seat2));
                    }
                }));
            }
        });
    }
    onJoin(client, options) {
        var status = new ClientStatus();
        if (this.state.player1Name == "") {
            this.state.player1Name = options.name;
            status.id = 1;
        }
        else if (this.state.player2Name == "") {
            this.state.player2Name = options.name;
            status.id = 2;
        }
        else if (this.state.player3Name == "") {
            this.state.player3Name = options.name;
            status.id = 3;
        }
        else if (this.state.player4Name == "") {
            this.state.player4Name = options.name;
            status.id = 4;
        }
        status.isReady = false;
        status.name = options.name;
        client.userData = status;
    }
    onLeave(client, consented) {
        if (this.state.player1Name == client.userData.name) {
            this.state.player1Name = "";
        }
        else if (this.state.player2Name == client.userData.name) {
            this.state.player2Name = "";
        }
        else if (this.state.player3Name == client.userData.name) {
            this.state.player3Name = "";
        }
        else
            (this.state.player4Name == client.userData.name);
        {
            this.state.player4Name = "";
        }
        if (!this.state.hasFinishedMatch3) {
            // both matches are done, check if one of the winners left....
            if (this.state.hasFinishedMatch1 && this.state.hasFinishedMatch2) {
                if (client.userData.name == this.state.match1Winner || client.userData.name == this.state.match2Winner) {
                    this.clients.forEach((client) => {
                        client.send("player_left_tournment");
                    });
                }
            }
            // only match number 1 is done, check if the winner has left and notify...
            else if (this.state.hasFinishedMatch1) {
                if (client.userData.name == this.state.match1Winner) {
                    this.clients.forEach((client) => {
                        client.send("player_left_tournment");
                    });
                }
            }
            // only match number 2 is done, check if the winner has left and notify...
            else if (this.state.hasFinishedMatch2) {
                if (client.userData.name == this.state.match2Winner) {
                    this.clients.forEach((client) => {
                        client.send("player_left_tournment");
                    });
                }
            }
            else {
                this.clients.forEach((client) => {
                    client.send("player_left_tournment");
                });
            }
        }
    }
    onDispose() {
        console.log("room disposing");
    }
}
exports.TournmentRoom = TournmentRoom;
