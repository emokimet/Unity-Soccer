import e from 'express';
import { Engine, World, Resolver, Body, Bodies, Collision, Constraint, Composite, Detector } from 'matter-js';
import { NetworkPlayer } from './rooms/schema/NetworkPlayer';

import {ClockTimer} from "@gamestdio/timer/lib/ClockTimer"
import { NetworkBall } from './rooms/schema/NetworkBall';
import { OneVSOneRoomState } from './rooms/schema/OneVSOneRoomState';
import {OneVSOneGameRoom} from './rooms/OneVSOneGameRoom';
class PhysicsPlayer {
    body : Body;
    head : Body;
    footSensor : Body;
    isMovingLeft : boolean = false;
    isMovingRight : boolean = false;
    canShoot : boolean = false;
    side : number = 0;
    isOnGround : boolean = false;
    isFrozen : boolean = false;
    isBig : boolean = false;
    velocity : number = 0;
}
export class GameController {
    physicsEngine : Engine = Engine.create();
    clock : ClockTimer;
    isUsingTablet : boolean = false;

    gameRoom : OneVSOneGameRoom;
    collisionDetector : Detector = Detector.create();

    roomState : OneVSOneRoomState;

    ground : Body;
    wallLeft : Body;
    wallRight : Body;
    wallUp : Body;

    goalLeft : Body;
    goalRight: Body;

    goalTopColLeft : Body;
    goalTopColRight : Body;

    players : PhysicsPlayer[] = new Array(4);

    ball : Body;

    hasGameStarted : boolean = false;
    isResetting : boolean = false;

    defaultPlayerWidth : number = 1;
    defaultPlayerHeight : number = 2.2;
    defaultBallRadius : number = 0.63;

    // ------------- left and right and roof colliders --------------------
    leftWallX : number = -13; // x position of the LEFT WALL
    leftWallY : number = 0; // y position of the LEFT WALL
    leftWallWidth : number = 1; // width of the LEFT WALL
    leftWallHeight : number = 11; // height of the LEFT WALL

    rightWallX : number = 13; // x position of the RIGHT WALL
    rightWallY : number = 0; // y position of the RIGHT WALL
    rightWallWidth : number = 1; // width of the RIGHT WALL
    rightWallHeight : number = 11; // height of the RIGHT WALL

    roofX : number = 0;
    roofY : number = 4.5;
    roofWidth : number = 24;
    roofHeight : number = 1.5;
 // ---------------------------------

    //---------- left and right goal detectors--------------
    goalLeftX : number = -13; // x position of the LEFT NET goal detector
    goalLeftY : number = -3;    // y position of the LEFT NET goal detector

    goalRightX : number = 12.7; // x position of the RIGHT NET goal detector
    goalRightY : number = -3;   // y position of the RIGHT NET goal detector

    defaultGoalWidth : number = 4; // WIDTH of BOTH goal detector
    defaultGoalHeight : number = 9; // HEIGHT of BOTH goal detector
//------------------------

// ----------- NET post collider -------------------

    
    goalPostLeftX : number = -11.2; // x position of the up collider in the LEFT net
    goalPostLeftY : number = 2.5;  // y position of the up collider in LEFT net
    goalPostLeftWidth : number = 4; // up collider width in the LEFT net
    goalPostLeftHeight : number = 1.3;// up collider height in the LEFT net
    goalPostLeftAngle : number = -15;

    goalPostRightX : number = 11.40; // x position of the up collider in the RIGHT net
    goalPostRightY : number = 2.5;  // y position of the up collider in the RIGHT net
    goalPostRightWidth : number = 4; // up collider width in the RIGHT net
    goalPostRightHeight : number = 1.3;// up collider height in the RIGHT net
    goalPostRightAngle : number = 15;
//-------------------------------------------------
    leftGoals : number = 0;
    rightGoals : number = 0;

    setUpEnv()
    {
        if (this.isUsingTablet)
        {
            this.goalLeftX = -8.43;
            this.goalRightX = 8.43;
            this.goalPostLeftX = -8.5;
            this.goalPostRightX = 8.5;
        }
        Resolver._restingThresh = 0.001;
        this.physicsEngine.gravity.y = -1;

        this.ground = Bodies.rectangle(0,-4, 100, 1, { isStatic: true})
        this.wallLeft = Bodies.rectangle(this.leftWallX, this.leftWallY, this.leftWallWidth, this.leftWallHeight, { isStatic: true, friction:0, frictionAir : 0, frictionStatic : 0});
        this.wallRight = Bodies.rectangle(this.rightWallX, this.rightWallY, this.rightWallWidth, this.rightWallHeight, { isStatic: true, friction:0, frictionAir : 0, frictionStatic : 0 });
        this.wallUp = Bodies.rectangle(this.roofX, this.roofY, this.roofWidth, this.roofHeight, { isStatic: true, friction:0, frictionAir : 0, frictionStatic : 0 });

        this.wallLeft.friction = 0;
        this.wallRight.friction = 0;
        this.goalLeft = Bodies.rectangle(this.goalLeftX,this.goalLeftY, this.defaultGoalWidth, this.defaultGoalHeight, { isStatic: true , isSensor : true});
        this.goalRight = Bodies.rectangle(this.goalRightX, this.goalRightY, this.defaultGoalWidth, this.defaultGoalHeight, { isStatic: true , isSensor : true});

        this.goalTopColLeft = Bodies.rectangle(this.goalPostLeftX, this.goalPostLeftY, this.goalPostLeftWidth, this.goalPostLeftHeight, { isStatic: true});
        this.goalTopColRight = Bodies.rectangle(this.goalPostRightX, this.goalPostRightY, this.goalPostRightWidth, this.goalPostRightHeight, { isStatic: true});

        this.goalTopColLeft.angle = this.goalPostLeftAngle * 3.14 / 180;
        this.goalTopColRight.angle = this.goalPostRightAngle * 3.14 / 180;

        this.goalTopColLeft.friction = 1;
        this.goalTopColRight.friction = 1;
        this.goalLeft.label = "goalLeft";
        this.goalRight.label = "goalRight";

        this.collisionDetector.bodies.push(this.goalLeft);
        this.collisionDetector.bodies.push(this.goalRight);
       Composite.add(this.physicsEngine.world, [this.ground, this.wallLeft, this.wallRight, this.wallUp, this.goalLeft, this.goalRight, this.goalTopColLeft, this.goalTopColRight]);
    }

    onCollideHandler()
    {

    }
    createBall(xPos : number, yPos: number)
    {
        this.ball = Bodies.circle(xPos, yPos, this.defaultBallRadius, {friction:0, frictionAir : 0, frictionStatic : 0});
        this.ball.restitution = 0.5;
        this.ball.label = "ball";
        Composite.add(this.physicsEngine.world, this.ball);

        this.collisionDetector.bodies.push(this.ball);
    }
    
    createPlayer(xPos : number, yPos : number, side : number, playerIndex : number)
    {
        this.players[playerIndex] = new PhysicsPlayer();
        this.players[playerIndex].body = Bodies.rectangle(xPos, yPos, this.defaultPlayerWidth, this.defaultPlayerHeight);
        this.players[playerIndex].footSensor = Bodies.rectangle(xPos, yPos, this.defaultPlayerWidth + 1, this.defaultPlayerHeight - 0.5, {isSensor : true, isStatic : true});
        this.players[playerIndex].side = side;
        Body.setInertia(this.players[playerIndex].body, Infinity);
        Body.setDensity(this.players[playerIndex].body, 0.0012)
        Composite.add(this.physicsEngine.world, this.players[playerIndex].body);
        Composite.add(this.physicsEngine.world, this.players[playerIndex].footSensor)
    }

    startMovePlayerLeft(playerIndex : number, velocity : number)
    {
        if (this.hasGameStarted && !this.players[playerIndex].isFrozen && !this.isResetting)
        {
            this.players[playerIndex].isMovingLeft = true;
            this.players[playerIndex].velocity = velocity;
            return true;
        }
        return false;
    }

    stopMovePlayerLeft(playerIndex : number)
    {
        this.players[playerIndex].isMovingLeft = false;

    }

    startMovePlayerRight(playerIndex : number, velocity : number)
    {
        if (this.hasGameStarted && !this.players[playerIndex].isFrozen && !this.isResetting)
        {
            this.players[playerIndex].isMovingRight = true;
            this.players[playerIndex].velocity = velocity;
            return true;
        }

        return false;
    }

    stopMovePlayerRight(playerIndex : number)
    {
        this.players[playerIndex].isMovingRight = false;
    }

    jumpPlayer(playerIndex : number, power : number)
    {
        if (this.players[playerIndex].isOnGround && this.hasGameStarted)
        {
            if (this.players[playerIndex].isBig) {
                Body.applyForce(this.players[playerIndex].body, this.players[playerIndex].body.position, {x : 0, y: power * 5});
                this.clock.setTimeout(() => {
                    Body.applyForce(this.players[playerIndex].body, this.players[playerIndex].body.position, {x : 0, y: -power * 5});
                }, 350)
            }
            else
            {
                Body.applyForce(this.players[playerIndex].body, this.players[playerIndex].body.position, {x : 0, y: power});
                this.clock.setTimeout(() => {
                    Body.applyForce(this.players[playerIndex].body, this.players[playerIndex].body.position, {x : 0, y: -power});
                }, 350)
            }

        }
    }

    degrees_to_radians(degrees : number)
    {
    var pi = Math.PI;
    return degrees * (pi/180);
    }

    shootBall(playerIndex : number, power : number, angle : number)
    {
        if (this.players[playerIndex].canShoot && !this.players[playerIndex].isFrozen)
        {
            if (this.players[playerIndex].side == 0)
            {
                //_shoot * Mathf.Atan(angle_shot * Mathf.Deg2Rad)
                Body.setVelocity(this.ball, {x: 0, y: 0})
                Body.applyForce( this.ball, {x: this.ball.position.x, y: this.ball.position.y}, {x: power, y: (power * Math.atan(this.degrees_to_radians(angle))) / 1.6});
            }
            else
            {
                Body.setVelocity(this.ball, {x: 0, y: 0})
                Body.applyForce( this.ball, {x: this.ball.position.x, y: this.ball.position.y}, {x: -power,  y: (power * Math.atan(this.degrees_to_radians(angle))) / 1.6});
            }
        }
    }

    shootBallFire(player : NetworkPlayer, ball : NetworkBall, clock : ClockTimer)
    {
        if (this.players[player.playerID].canShoot && player.canShootFire && !player.isFrozen)
        {
            if (this.players[player.playerID].side == 0)
            {
                Body.applyForce( this.ball, {x: this.ball.position.x, y: this.ball.position.y}, {x: 0.0003, y: 0.0001});
            }
            else
            {
                Body.applyForce( this.ball, {x: this.ball.position.x, y: this.ball.position.y}, {x: -0.0003, y: 0.0001});
            }

            player.canShootFire = false;
            ball.isOnFire = true;

            clock.setTimeout(() => {
                ball.isOnFire = false;
            }, 2000)

            clock.setTimeout(() => {
                player.canShootFire = true;
            }, 5000)
        }
    }

    scoreGoal(side : number)
    {
        if(!this.isResetting)
        {
            this.isResetting = true;
            if(side == 1)
            {
                this.leftGoals++;
            }
            else if (side == 0)
            {
                this.rightGoals++;
            }

            this.gameRoom.clients.forEach((client_1) => {
                client_1.send("score_goal", 1);
              })
    
            this.clock.setTimeout(() => {
                this.Reset();
                this.isResetting = false;
                if (this.roomState.waitingForGoldenGoal) {
                    this.roomState.waitingForGoldenGoal = false;
                }
            }, 2000)
        }

    }

    Reset()
    {
        Body.setVelocity(this.ball, {x:0, y:0});
        Body.setPosition(this.ball, {x: 0, y: 3});
        for (let index = 0; index < this.players.length; index++) {
            var player : PhysicsPlayer = this.players[index];
            if (player != null) {
                // left
                if (player.side == 0)
                {
                    Body.setPosition(player.body, {x: -5, y : 0});
                }
                // right
                else if (player.side == 1)
                {
                    Body.setPosition(player.body, {x: 5, y : 0});
                }

                Body.setPosition(player.footSensor, player.body.position);
            }
        }
    }

    stepSimulation()
    {

        if (Collision.collides(this.ball, this.wallLeft) != null)
        {
            if (this.isResetting) {
                Body.setVelocity(this.ball, {x : 0, y: 0})
            }
        }
        if (Collision.collides(this.ball, this.wallRight)) {
            if (this.isResetting) {
                Body.setVelocity(this.ball, {x : 0, y: 0})
            }
        }
        if (Collision.collides(this.ball, this.goalTopColLeft)) {
            if (this.isResetting) {
                Body.setVelocity(this.ball, {x : 0, y: 0})
            }
        }
        if (Collision.collides(this.ball, this.goalTopColRight)) {
            if (this.isResetting) {
                Body.setVelocity(this.ball, {x : 0, y: 0})
            }
        }
        for (let index = 0; index < this.players.length; index++) {
            var player : PhysicsPlayer = this.players[index];
            if (player != null) {
                if (Collision.collides(player.body, this.ground) != null) {
                    player.isOnGround = true;
                }
                else
                {
                    player.isOnGround = false;
                }

                if (player.isMovingLeft) {
                    Body.setVelocity(player.body, {x: -(player.velocity / 5000), y : player.body.velocity.y});
                }
                
                if (player.isMovingRight) {

                    Body.setVelocity(player.body, {x: player.velocity / 5000, y : player.body.velocity.y});
                    
                }
                
                Body.setPosition(player.footSensor, player.body.position);
                if (Collision.collides(player.footSensor, this.ball) != null) {
                    player.canShoot = true;
                    console.log("collides !");
                }
                else
                {
                    player.canShoot = false;
                }

                if (Collision.collides(this.ball, player.body) != null)
                {
                    var dY = this.ball.position.y - player.body.position.y;
                    if (dY > 1.5) {
                        if (!player.isOnGround)
                        {
                            if (player.side == 0)
                            {
                                Body.setVelocity(this.ball, {x:0.15, y:0.1});
                            }
                            else
                            {
                                Body.setVelocity(this.ball, {x:-0.15, y:0.1});
                            }
                            // kick animation

                            this.gameRoom.clients.forEach((client_1) => {
                                client_1.send("head_kick", index);
                              })
                        }
                        else
                        {
                            if (player.side == 0)
                            {
                                Body.applyForce(this.ball, this.ball.position, {x:global.HEADKICK_VELOCITY_X, y:global.HEADKICK_VELOCITY_Y});
                            }
                            else
                            {
                               Body.applyForce(this.ball, this.ball.position, {x:-global.HEADKICK_VELOCITY_X, y:global.HEADKICK_VELOCITY_Y});
                            }
                        }

                    }
                    //Body.applyForce(this.ball, this.ball.position, {x:0, y:0.000004});
                }

                if (Collision.collides(this.ball, this.goalTopColLeft) != null)
                {
                    Body.setVelocity(this.ball, {x:0.1, y:0.1});
                }


                if (Collision.collides(this.ball, this.goalTopColRight) != null)
                {
                    Body.setVelocity(this.ball, {x:-0.1, y:0.1});
                }

                if (Collision.collides(this.ball, this.wallRight) != null)
                {
                    //Body.applyForce(this.ball, this.ball.position, {x:-0.00002, y:0.00001});
                }

            }

            
        }
        
        if (Collision.collides(this.ball, this.goalLeft) != null)
        {
           this.scoreGoal(0)
        }

        if (Collision.collides(this.ball, this.goalRight) != null)
        {
            this.scoreGoal(1)
        }

        Engine.update(this.physicsEngine, 1.5);
    }

    endGame()
    {

    }

    usedIce(user : NetworkPlayer, victim : NetworkPlayer, clock : ClockTimer)
    {
        if (!user.hasUsedIce)
        {
            user.hasUsedIce = true;
            victim.isFrozen = true;
            this.players[victim.playerID].isFrozen = true;

            clock.setTimeout(() => {
                victim.isFrozen = false;
                this.players[victim.playerID].isFrozen = false;

            }, 3000)
        }
    }

    usedX2(user : NetworkPlayer, clock : ClockTimer)
    {
        if (!user.isBig && !user.hasUsedX2)
        {
            user.isBig = true;
            user.hasUsedX2 = true;
            user.isFrozen = false;
            this.players[user.playerID].isBig = true;
            Body.scale(this.players[user.playerID].body, 2, 2);
            Body.scale(this.players[user.playerID].footSensor, 2, 2)
            Body.setInertia(this.players[user.playerID].body, Infinity);

            clock.setTimeout(() => {
                Body.scale(this.players[user.playerID].body, 0.5, 0.5);
                Body.scale(this.players[user.playerID].footSensor, 0.5, 0.5)
                Body.setInertia(this.players[user.playerID].body, Infinity);
                this.players[user.playerID].isBig = false;
                user.isBig = false;
            }, 10000)
        }
    }
}