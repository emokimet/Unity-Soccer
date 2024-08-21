"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournmentRoomState = exports.TournmentMatchStage = void 0;
const schema_1 = require("@colyseus/schema");
var TournmentMatchStage;
(function (TournmentMatchStage) {
    TournmentMatchStage[TournmentMatchStage["STAGE1"] = 0] = "STAGE1";
    TournmentMatchStage[TournmentMatchStage["STAGE2"] = 1] = "STAGE2";
})(TournmentMatchStage || (exports.TournmentMatchStage = TournmentMatchStage = {}));
class TournmentRoomState extends schema_1.Schema {
    constructor() {
        super(...arguments);
        // not using array for the sake of simplicity...
        this.player1Name = "";
        this.player1Ready = false;
        this.player2Name = "";
        this.player2Ready = false;
        this.player3Name = "";
        this.player3Ready = false;
        this.player4Name = "";
        this.player4Ready = false;
        this.match1Winner = "";
        this.match1WinnerReady = false;
        this.match2Winner = "";
        this.match2WinnerReady = false;
        this.match3Winner = "";
        this.tournmentStage = 0;
        this.hasFinishedMatch1 = false;
        this.hasFinishedMatch2 = false;
        this.hasFinishedMatch3 = false;
        this.fee = 0;
    }
}
exports.TournmentRoomState = TournmentRoomState;
__decorate([
    (0, schema_1.type)("string")
], TournmentRoomState.prototype, "player1Name", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], TournmentRoomState.prototype, "player1Ready", void 0);
__decorate([
    (0, schema_1.type)("string")
], TournmentRoomState.prototype, "player2Name", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], TournmentRoomState.prototype, "player2Ready", void 0);
__decorate([
    (0, schema_1.type)("string")
], TournmentRoomState.prototype, "player3Name", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], TournmentRoomState.prototype, "player3Ready", void 0);
__decorate([
    (0, schema_1.type)("string")
], TournmentRoomState.prototype, "player4Name", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], TournmentRoomState.prototype, "player4Ready", void 0);
__decorate([
    (0, schema_1.type)("string")
], TournmentRoomState.prototype, "match1Winner", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], TournmentRoomState.prototype, "match1WinnerReady", void 0);
__decorate([
    (0, schema_1.type)("string")
], TournmentRoomState.prototype, "match2Winner", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], TournmentRoomState.prototype, "match2WinnerReady", void 0);
__decorate([
    (0, schema_1.type)("string")
], TournmentRoomState.prototype, "match3Winner", void 0);
__decorate([
    (0, schema_1.type)("number")
], TournmentRoomState.prototype, "tournmentStage", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], TournmentRoomState.prototype, "hasFinishedMatch1", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], TournmentRoomState.prototype, "hasFinishedMatch2", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], TournmentRoomState.prototype, "hasFinishedMatch3", void 0);
__decorate([
    (0, schema_1.type)("number")
], TournmentRoomState.prototype, "fee", void 0);
