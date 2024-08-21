import { Schema, type } from "@colyseus/schema";

export class NetworkPlayer extends Schema
{
    @type("boolean") isHost: boolean = false;
    @type("number") playerID: number = -1;
    @type("number") selected_head: number = -1;
    @type("number") side : number = 0; // 0 for left, 1 for right.
    @type("number") xPos : number = 0;
    @type("number") yPos : number = -2.55;

    @type("boolean") hasLoaded : boolean = false;

    @type("boolean") hasUsedIce : boolean = false;
    @type("boolean") hasUsedX2 : boolean = false;

    @type("boolean") isFrozen : boolean = false;
    @type("boolean") isBig : boolean = false;

    @type("boolean") isWalkingLeft : boolean = false;
    @type("boolean") isWalkingRight : boolean = false;
    @type("boolean") isShootingBall : boolean = false;
    @type("boolean") canShootFire : boolean = true;
    @type("string") playerName : string = "Player";

    playerVelocity : number = 0;
    playerShoot : number = 0;
    playerJumpForce : number = 0;
    playerAngleShot : number = 0;

}