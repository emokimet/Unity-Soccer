import { Schema, Context, type } from "@colyseus/schema";

export enum TournmentMatchStage {
    STAGE1, STAGE2
}


export class TournmentRoomState extends Schema {
    // not using array for the sake of simplicity...
    @type("string") player1Name : string = "";
    @type("boolean") player1Ready : boolean = false;
    
    @type("string") player2Name : string = "";
    @type("boolean") player2Ready : boolean = false;
    
    @type("string") player3Name : string = "";
    @type("boolean") player3Ready : boolean = false;
    
    @type("string") player4Name : string = "";
    @type("boolean") player4Ready : boolean = false;
    
    @type("string") match1Winner : string = "";
    @type("boolean") match1WinnerReady : boolean = false;
    
    @type("string") match2Winner : string = "";
    @type("boolean") match2WinnerReady : boolean = false;
  
    @type("string") match3Winner : string = "";
    @type("number") tournmentStage : number = 0;

    @type("boolean") hasFinishedMatch1 : boolean = false;
    @type("boolean") hasFinishedMatch2 : boolean = false;
    @type("boolean") hasFinishedMatch3 : boolean = false;

    @type("number") fee : number = 0;
}
