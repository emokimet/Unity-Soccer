import { Room, Client, matchMaker } from "colyseus";
import { TournmentMatchStage, TournmentRoomState } from "./schema/TournmentRoomState";

class ClientStatus {
    name : string = "";
    isReady : boolean = false;
    id : number = 0;
    isQualified : boolean = false;
}

export class TournmentRoom extends Room<TournmentRoomState> {
  onCreate (options: any) {
    this.maxClients = 4;

    this.setState(new TournmentRoomState());

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
        })

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
            this.state.tournmentStage = TournmentMatchStage.STAGE2;
        }

      });
    
    this.onMessage("mark_ready", (client, message) => {
        client.userData.isReady = true;
        if (this.state.tournmentStage == TournmentMatchStage.STAGE1) {
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
            })
    
            if (ready_clients == 4){
                this.matchClients();
            }
        }
        else if (this.state.tournmentStage == TournmentMatchStage.STAGE2)
        {
            if (this.state.match1Winner == client.userData.name)
            {
                this.state.match1WinnerReady = true;
            }

            else if (this.state.match2Winner == client.userData.name)
            {
                this.state.match2WinnerReady = true;
            }

            if (this.state.match1WinnerReady && this.state.match2WinnerReady) {
                this.matchClients();
            }
        }
      });

  }

  async matchClients()
  {
    if (this.state.tournmentStage == TournmentMatchStage.STAGE1)
    {
        var room1 = await matchMaker.createRoom("1v1", {isPrivate: true, isTournment : true, matchNumber : 1, gameTime : global.SEMIFINAL_GAMETIME});
        var client_1_res = await matchMaker.reserveSeatFor(room1, {isPrivate: true, isTournment : true, name: this.clients[0].userData.name});
        var client_2_res = await matchMaker.reserveSeatFor(room1, {isPrivate: true, isTournment : true, name: this.clients[1].userData.name});
        this.clients[0].send("tournament_match_entry", JSON.stringify(client_1_res));
        this.clients[1].send("tournament_match_entry", JSON.stringify(client_2_res));

        var room2 = await matchMaker.createRoom("1v1", {isPrivate: true, isTournment : true, matchNumber : 2, gameTime : global.SEMIFINAL_GAMETIME});
        var client_3_res = await matchMaker.reserveSeatFor(room2, {isPrivate: true, isTournment : true, name: this.clients[2].userData.name});
        var client_4_res = await matchMaker.reserveSeatFor(room2, {isPrivate: true, isTournment : true, name: this.clients[3].userData.name});
        this.clients[2].send("tournament_match_entry", JSON.stringify(client_3_res));
        this.clients[3].send("tournament_match_entry", JSON.stringify(client_4_res));
    }

    else if (this.state.tournmentStage == TournmentMatchStage.STAGE2)
    {
        var finalRoom = await matchMaker.createRoom("1v1", {isPrivate: true, isTournment : true, matchNumber : 3, gameTime : global.FINAL_GAMETIME})
        this.clients.forEach(async (client) => {
            if (client.userData.name == this.state.match1Winner) {
                var winner_seat1 = await matchMaker.reserveSeatFor(finalRoom, {isPrivate: true, isTournment : true, name: client.userData.name});
                client.send("tournament_match_entry", JSON.stringify(winner_seat1))
            }

            if (client.userData.name == this.state.match2Winner) {
                var winner_seat2 = await matchMaker.reserveSeatFor(finalRoom, {isPrivate: true, isTournment : true, name: client.userData.name});
                client.send("tournament_match_entry", JSON.stringify(winner_seat2))
            }
        })
    }
    
  }

  onJoin (client: Client, options: any) {
    var status : ClientStatus = new ClientStatus();

    
    if (this.state.player1Name == "")
    {
        this.state.player1Name = options.name;
        status.id = 1;
    }
    else if (this.state.player2Name == "")
    {
        this.state.player2Name = options.name;
        status.id = 2;
    }
    else if (this.state.player3Name == "")
    {
        this.state.player3Name = options.name;
        status.id = 3
    }
    else if (this.state.player4Name == "")
    {
        this.state.player4Name = options.name;
        status.id = 4;
    }

    status.isReady = false;
    status.name = options.name;
    client.userData = status;
  }

  onLeave (client: Client, consented: boolean) {
    if (this.state.player1Name == client.userData.name)
    {
        this.state.player1Name = "";
    }
    else if (this.state.player2Name == client.userData.name)
    {
        this.state.player2Name = "";
    }
    else if (this.state.player3Name == client.userData.name)
    {
        this.state.player3Name = "";
    }
    else (this.state.player4Name == client.userData.name)
    {
        this.state.player4Name = "";
    }

    if (!this.state.hasFinishedMatch3) {
          // both matches are done, check if one of the winners left....
    if (this.state.hasFinishedMatch1 && this.state.hasFinishedMatch2) {
        if (client.userData.name == this.state.match1Winner || client.userData.name == this.state.match2Winner) {
            this.clients.forEach((client) => {
                client.send("player_left_tournment");
            })
        }
    }
    // only match number 1 is done, check if the winner has left and notify...
    else if (this.state.hasFinishedMatch1)
    {
        if (client.userData.name == this.state.match1Winner) {
            this.clients.forEach((client) => {
                client.send("player_left_tournment");
            })
        }
    }
    // only match number 2 is done, check if the winner has left and notify...
    else if (this.state.hasFinishedMatch2)
    {
        if (client.userData.name == this.state.match2Winner) {
            this.clients.forEach((client) => {
                client.send("player_left_tournment");
            })
        }
    }
    else
    {
        this.clients.forEach((client) => {
            client.send("player_left_tournment");
        })
    }

    }
  


  }

  onDispose() {
    console.log("room disposing");
  }

}
