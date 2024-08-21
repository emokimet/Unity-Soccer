import { Schema, type } from "@colyseus/schema";

export class NetworkBall extends Schema
{
    @type("number") xPos : number = 0;
    @type("number") yPos : number = 4;
    @type("number") rotation : number = 0;
    @type("boolean") isOnFire : boolean = false;
}