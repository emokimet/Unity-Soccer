"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkPlayer = void 0;
const schema_1 = require("@colyseus/schema");
class NetworkPlayer extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.isHost = false;
        this.playerID = -1;
        this.selected_head = -1;
        this.side = 0; // 0 for left, 1 for right.
        this.xPos = 0;
        this.yPos = -2.55;
        this.hasLoaded = false;
        this.hasUsedIce = false;
        this.hasUsedX2 = false;
        this.hasUsedElectricity = false;
        this.hasUsedLeaves = false;
        this.isFrozen = false;
        this.isBig = false;
        this.isElectrify = false;
        this.isFreezed = false;
        this.isLeaves = false;
        this.isWalkingLeft = false;
        this.isWalkingRight = false;
        this.isShootingBall = false;
        this.canShootFire = true;
        this.playerName = "Player";
        this.playerVelocity = 0;
        this.playerShoot = 0;
        this.playerJumpForce = 0;
        this.playerAngleShot = 0;
        this.zRotation = 0;
        this.isFlip = false;
    }
}
exports.NetworkPlayer = NetworkPlayer;
__decorate([
    (0, schema_1.type)("boolean")
], NetworkPlayer.prototype, "isHost", void 0);
__decorate([
    (0, schema_1.type)("number")
], NetworkPlayer.prototype, "playerID", void 0);
__decorate([
    (0, schema_1.type)("number")
], NetworkPlayer.prototype, "selected_head", void 0);
__decorate([
    (0, schema_1.type)("number")
], NetworkPlayer.prototype, "side", void 0);
__decorate([
    (0, schema_1.type)("number")
], NetworkPlayer.prototype, "xPos", void 0);
__decorate([
    (0, schema_1.type)("number")
], NetworkPlayer.prototype, "yPos", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], NetworkPlayer.prototype, "hasLoaded", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], NetworkPlayer.prototype, "hasUsedIce", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], NetworkPlayer.prototype, "hasUsedX2", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], NetworkPlayer.prototype, "hasUsedElectricity", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], NetworkPlayer.prototype, "hasUsedLeaves", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], NetworkPlayer.prototype, "isFrozen", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], NetworkPlayer.prototype, "isBig", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], NetworkPlayer.prototype, "isElectrify", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], NetworkPlayer.prototype, "isFreezed", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], NetworkPlayer.prototype, "isLeaves", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], NetworkPlayer.prototype, "isWalkingLeft", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], NetworkPlayer.prototype, "isWalkingRight", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], NetworkPlayer.prototype, "isShootingBall", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], NetworkPlayer.prototype, "canShootFire", void 0);
__decorate([
    (0, schema_1.type)("string")
], NetworkPlayer.prototype, "playerName", void 0);
__decorate([
    (0, schema_1.type)("number")
], NetworkPlayer.prototype, "zRotation", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], NetworkPlayer.prototype, "isFlip", void 0);