import { Schema, Context, type } from "@colyseus/schema";
import { NetworkPlayer } from "./NetworkPlayer";
import { NetworkBall } from "./NetworkBall";
export enum GameSessionState
{
  WAITING_FOR_PLAYERS,
  SETTING_UP,
  PLAYING,
}

export class OneVSOneRoomState extends Schema {

  @type(NetworkPlayer) leftPlayer : NetworkPlayer;
  @type(NetworkPlayer) rightPlayer : NetworkPlayer;

  @type(NetworkPlayer) leftPlayer1 : NetworkPlayer;
  @type(NetworkPlayer) rightPlayer1 : NetworkPlayer;
  
  @type(NetworkBall) ball : NetworkBall = new NetworkBall;

  @type("number") stadium_id : number = -1; // -1 means a stadium hasn't been selected yet.
  @type("number") ball_id : number = -1;    // -1 means a ball hasn't been selected yet.
  @type("number") gameState : number = GameSessionState.WAITING_FOR_PLAYERS;
  @type("boolean") ready_to_start : boolean = false;
  @type("number") seconds_left : number = 90;

  @type("number") goals_left : number = 0;
  @type("number") goals_right : number = 0;

  @type("boolean") surrender_left : boolean = false;
  @type("boolean") surrender_right : boolean = false;

  @type("number") amount_coins : number = 500;
  @type("boolean") isTournment : boolean = false;
  @type("boolean") waitingForGoldenGoal : boolean = false;
  @type("number") tournmentMatchNumber : number = 0;

  @type("number") LeftPostX : number = 0;
  @type("number") LeftPostY : number = 0;
  @type("number") LeftPostWidth : number = 0;
  @type("number") LeftPostHeight : number = 0;
  @type("number") LeftPostAngle : number = 0;

  @type("number") RightPostX : number = 0;
  @type("number") RightPostY : number = 0;
  @type("number") RightPostWidth : number = 0;
  @type("number") RightPostHeight : number = 0;
  @type("number") RightPostAngle : number = 0;

  @type("number") LeftDetectorX : number = 0;
  @type("number") LeftDetectorY : number = 0;
  @type("number") LeftDetectorWidth : number = 0;
  @type("number") LeftDetectorHeight : number = 0;

  @type("number") RightDetectorX : number = 0;
  @type("number") RightDetectorY : number = 0;
  @type("number") RightDetectorWidth : number = 0;
  @type("number") RightDetectorHeight : number = 0;

  @type("number") RoofX : number = 0;
  @type("number") RoofY : number = 0;
  @type("number") RoofWidth : number = 0;
  @type("number") RoofHeight : number = 0;

  @type("boolean") isTablet : boolean = false;

  @type("number") FootSensorX : number = 0;
  @type("number") FootSensorY : number = 0;
  @type("number") FootSensorWidth : number = 0;
  @type("number") FootSensorHeight : number = 0;
  
  
}
