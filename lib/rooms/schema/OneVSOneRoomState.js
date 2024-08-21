"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneVSOneRoomState = exports.GameSessionState = void 0;
const schema_1 = require("@colyseus/schema");
const NetworkPlayer_1 = require("./NetworkPlayer");
const NetworkBall_1 = require("./NetworkBall");
var GameSessionState;
(function (GameSessionState) {
    GameSessionState[GameSessionState["WAITING_FOR_PLAYERS"] = 0] = "WAITING_FOR_PLAYERS";
    GameSessionState[GameSessionState["SETTING_UP"] = 1] = "SETTING_UP";
    GameSessionState[GameSessionState["PLAYING"] = 2] = "PLAYING";
})(GameSessionState || (exports.GameSessionState = GameSessionState = {}));
class OneVSOneRoomState extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.ball = new NetworkBall_1.NetworkBall;
        this.stadium_id = -1; // -1 means a stadium hasn't been selected yet.
        this.ball_id = -1; // -1 means a ball hasn't been selected yet.
        this.gameState = GameSessionState.WAITING_FOR_PLAYERS;
        this.ready_to_start = false;
        this.seconds_left = 90;
        this.goals_left = 0;
        this.goals_right = 0;
        this.surrender_left = false;
        this.surrender_right = false;
        this.amount_coins = 500;
        this.isTournment = false;
        this.waitingForGoldenGoal = false;
        this.tournmentMatchNumber = 0;
        this.LeftPostX = 0;
        this.LeftPostY = 0;
        this.LeftPostWidth = 0;
        this.LeftPostHeight = 0;
        this.LeftPostAngle = 0;
        this.RightPostX = 0;
        this.RightPostY = 0;
        this.RightPostWidth = 0;
        this.RightPostHeight = 0;
        this.RightPostAngle = 0;
        this.LeftDetectorX = 0;
        this.LeftDetectorY = 0;
        this.LeftDetectorWidth = 0;
        this.LeftDetectorHeight = 0;
        this.RightDetectorX = 0;
        this.RightDetectorY = 0;
        this.RightDetectorWidth = 0;
        this.RightDetectorHeight = 0;
        this.RoofX = 0;
        this.RoofY = 0;
        this.RoofWidth = 0;
        this.RoofHeight = 0;
        this.isTablet = false;
        this.FootSensorX = 0;
        this.FootSensorY = 0;
        this.FootSensorWidth = 0;
        this.FootSensorHeight = 0;
    }
}
exports.OneVSOneRoomState = OneVSOneRoomState;
__decorate([
    (0, schema_1.type)(NetworkPlayer_1.NetworkPlayer)
], OneVSOneRoomState.prototype, "leftPlayer", void 0);
__decorate([
    (0, schema_1.type)(NetworkPlayer_1.NetworkPlayer)
], OneVSOneRoomState.prototype, "rightPlayer", void 0);
__decorate([
    (0, schema_1.type)(NetworkPlayer_1.NetworkPlayer)
], OneVSOneRoomState.prototype, "leftPlayer1", void 0);
__decorate([
    (0, schema_1.type)(NetworkPlayer_1.NetworkPlayer)
], OneVSOneRoomState.prototype, "rightPlayer1", void 0);
__decorate([
    (0, schema_1.type)(NetworkBall_1.NetworkBall)
], OneVSOneRoomState.prototype, "ball", void 0);
__decorate([
    (0, schema_1.type)("number")
], OneVSOneRoomState.prototype, "stadium_id", void 0);
__decorate([
    (0, schema_1.type)("number")
], OneVSOneRoomState.prototype, "ball_id", void 0);
__decorate([
    (0, schema_1.type)("number")
], OneVSOneRoomState.prototype, "gameState", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], OneVSOneRoomState.prototype, "ready_to_start", void 0);
__decorate([
    (0, schema_1.type)("number")
], OneVSOneRoomState.prototype, "seconds_left", void 0);
__decorate([
    (0, schema_1.type)("number")
], OneVSOneRoomState.prototype, "goals_left", void 0);
__decorate([
    (0, schema_1.type)("number")
], OneVSOneRoomState.prototype, "goals_right", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], OneVSOneRoomState.prototype, "surrender_left", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], OneVSOneRoomState.prototype, "surrender_right", void 0);
__decorate([
    (0, schema_1.type)("number")
], OneVSOneRoomState.prototype, "amount_coins", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], OneVSOneRoomState.prototype, "isTournment", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], OneVSOneRoomState.prototype, "waitingForGoldenGoal", void 0);
__decorate([
    (0, schema_1.type)("number")
], OneVSOneRoomState.prototype, "tournmentMatchNumber", void 0);
__decorate([
    (0, schema_1.type)("number")
], OneVSOneRoomState.prototype, "LeftPostX", void 0);
__decorate([
    (0, schema_1.type)("number")
], OneVSOneRoomState.prototype, "LeftPostY", void 0);
__decorate([
    (0, schema_1.type)("number")
], OneVSOneRoomState.prototype, "LeftPostWidth", void 0);
__decorate([
    (0, schema_1.type)("number")
], OneVSOneRoomState.prototype, "LeftPostHeight", void 0);
__decorate([
    (0, schema_1.type)("number")
], OneVSOneRoomState.prototype, "LeftPostAngle", void 0);
__decorate([
    (0, schema_1.type)("number")
], OneVSOneRoomState.prototype, "RightPostX", void 0);
__decorate([
    (0, schema_1.type)("number")
], OneVSOneRoomState.prototype, "RightPostY", void 0);
__decorate([
    (0, schema_1.type)("number")
], OneVSOneRoomState.prototype, "RightPostWidth", void 0);
__decorate([
    (0, schema_1.type)("number")
], OneVSOneRoomState.prototype, "RightPostHeight", void 0);
__decorate([
    (0, schema_1.type)("number")
], OneVSOneRoomState.prototype, "RightPostAngle", void 0);
__decorate([
    (0, schema_1.type)("number")
], OneVSOneRoomState.prototype, "LeftDetectorX", void 0);
__decorate([
    (0, schema_1.type)("number")
], OneVSOneRoomState.prototype, "LeftDetectorY", void 0);
__decorate([
    (0, schema_1.type)("number")
], OneVSOneRoomState.prototype, "LeftDetectorWidth", void 0);
__decorate([
    (0, schema_1.type)("number")
], OneVSOneRoomState.prototype, "LeftDetectorHeight", void 0);
__decorate([
    (0, schema_1.type)("number")
], OneVSOneRoomState.prototype, "RightDetectorX", void 0);
__decorate([
    (0, schema_1.type)("number")
], OneVSOneRoomState.prototype, "RightDetectorY", void 0);
__decorate([
    (0, schema_1.type)("number")
], OneVSOneRoomState.prototype, "RightDetectorWidth", void 0);
__decorate([
    (0, schema_1.type)("number")
], OneVSOneRoomState.prototype, "RightDetectorHeight", void 0);
__decorate([
    (0, schema_1.type)("number")
], OneVSOneRoomState.prototype, "RoofX", void 0);
__decorate([
    (0, schema_1.type)("number")
], OneVSOneRoomState.prototype, "RoofY", void 0);
__decorate([
    (0, schema_1.type)("number")
], OneVSOneRoomState.prototype, "RoofWidth", void 0);
__decorate([
    (0, schema_1.type)("number")
], OneVSOneRoomState.prototype, "RoofHeight", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], OneVSOneRoomState.prototype, "isTablet", void 0);
__decorate([
    (0, schema_1.type)("number")
], OneVSOneRoomState.prototype, "FootSensorX", void 0);
__decorate([
    (0, schema_1.type)("number")
], OneVSOneRoomState.prototype, "FootSensorY", void 0);
__decorate([
    (0, schema_1.type)("number")
], OneVSOneRoomState.prototype, "FootSensorWidth", void 0);
__decorate([
    (0, schema_1.type)("number")
], OneVSOneRoomState.prototype, "FootSensorHeight", void 0);
__decorate([
    (0, schema_1.type)("number")
], OneVSOneRoomState.prototype, "zRotation", void 0);
