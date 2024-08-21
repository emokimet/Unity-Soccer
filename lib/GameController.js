"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameController = void 0;
const matter_js_1 = require("matter-js");
class PhysicsPlayer {
    constructor() {
        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.canShoot = false;
        this.side = 0;
        this.isOnGround = false;
        this.isFrozen = false;
        this.isBig = false;
        this.isElectrify = false;
        this.isFreezed = false;
        this.isLeaves = false;
        this.velocity = 0;
        this.isFlip = false;
    }
}
class GameController {
    constructor() {
        this.physicsEngine = matter_js_1.Engine.create();
        this.isUsingTablet = false;
        this.collisionDetector = matter_js_1.Detector.create();
        this.players = new Array(4);
        this.hasGameStarted = false;
        this.isResetting = false;
        this.defaultPlayerWidth = 1;
        this.defaultPlayerHeight = 2.2;
        this.defaultBallRadius = 0.63;
        // ------------- left and right and roof colliders --------------------
        this.leftWallX = -13; // x position of the LEFT WALL
        this.leftWallY = 0; // y position of the LEFT WALL
        this.leftWallWidth = 1; // width of the LEFT WALL
        this.leftWallHeight = 11; // height of the LEFT WALL
        this.rightWallX = 13; // x position of the RIGHT WALL
        this.rightWallY = 0; // y position of the RIGHT WALL
        this.rightWallWidth = 1; // width of the RIGHT WALL
        this.rightWallHeight = 11; // height of the RIGHT WALL
        this.roofX = 0;
        this.roofY = 4.5;
        this.roofWidth = 24;
        this.roofHeight = 1.5;
        // ---------------------------------
        //---------- left and right goal detectors--------------
        this.goalLeftX = -13; // x position of the LEFT NET goal detector
        this.goalLeftY = -3; // y position of the LEFT NET goal detector
        this.goalRightX = 12.7; // x position of the RIGHT NET goal detector
        this.goalRightY = -3; // y position of the RIGHT NET goal detector
        this.defaultGoalWidth = 4; // WIDTH of BOTH goal detector
        this.defaultGoalHeight = 9; // HEIGHT of BOTH goal detector
        //------------------------
        // ----------- NET post collider -------------------
        this.goalPostLeftX = -11.2; // x position of the up collider in the LEFT net
        this.goalPostLeftY = 2.5; // y position of the up collider in LEFT net
        this.goalPostLeftWidth = 4; // up collider width in the LEFT net
        this.goalPostLeftHeight = 1.3; // up collider height in the LEFT net
        this.goalPostLeftAngle = -15;
        this.goalPostRightX = 11.40; // x position of the up collider in the RIGHT net
        this.goalPostRightY = 2.5; // y position of the up collider in the RIGHT net
        this.goalPostRightWidth = 4; // up collider width in the RIGHT net
        this.goalPostRightHeight = 1.3; // up collider height in the RIGHT net
        this.goalPostRightAngle = 15;
        //-------------------------------------------------
        this.leftGoals = 0;
        this.rightGoals = 0;
    }
    setUpEnv() {
        
        if (this.isUsingTablet) {
            this.goalLeftX = -8.43;
            this.goalRightX = 8.43;
            this.goalPostLeftX = -8.5;
            this.goalPostRightX = 8.5;
        }
        matter_js_1.Resolver._restingThresh = 0.001;
        this.physicsEngine.gravity.y = -1;
        this.ground = matter_js_1.Bodies.rectangle(0, -4, 100, 1, { isStatic: true });
        this.wallLeft = matter_js_1.Bodies.rectangle(this.leftWallX, this.leftWallY, this.leftWallWidth, this.leftWallHeight, { isStatic: true, friction: 0, frictionAir: 0, frictionStatic: 0 });
        this.wallRight = matter_js_1.Bodies.rectangle(this.rightWallX, this.rightWallY, this.rightWallWidth, this.rightWallHeight, { isStatic: true, friction: 0, frictionAir: 0, frictionStatic: 0 });
        this.wallUp = matter_js_1.Bodies.rectangle(this.roofX, this.roofY, this.roofWidth, this.roofHeight, { isStatic: true, friction: 0, frictionAir: 0, frictionStatic: 0 });
        this.wallLeft.friction = 0;
        this.wallRight.friction = 0;
        this.goalLeft = matter_js_1.Bodies.rectangle(this.goalLeftX - this.defaultGoalWidth*0, this.goalLeftY, this.defaultGoalWidth, this.defaultGoalHeight, { isStatic: true, isSensor: true });
        this.goalRight = matter_js_1.Bodies.rectangle(this.goalRightX + this.defaultGoalWidth*0, this.goalRightY, this.defaultGoalWidth, this.defaultGoalHeight, { isStatic: true, isSensor: true });
        this.goalTopColLeft = matter_js_1.Bodies.rectangle(this.goalPostLeftX, this.goalPostLeftY, this.goalPostLeftWidth, this.goalPostLeftHeight, { isStatic: true });
        this.goalTopColRight = matter_js_1.Bodies.rectangle(this.goalPostRightX, this.goalPostRightY, this.goalPostRightWidth, this.goalPostRightHeight, { isStatic: true });
        this.goalTopColLeft.angle = this.goalPostLeftAngle * 3.14 / 180;
        this.goalTopColRight.angle = this.goalPostRightAngle * 3.14 / 180;
        this.goalTopColLeft.friction = 1;
        this.goalTopColRight.friction = 1;
        this.goalLeft.label = "goalLeft";
        this.goalRight.label = "goalRight";
        this.collisionDetector.bodies.push(this.goalLeft);
        this.collisionDetector.bodies.push(this.goalRight);
        matter_js_1.Composite.add(this.physicsEngine.world, [this.ground, this.wallLeft, this.wallRight, this.wallUp, this.goalLeft, this.goalRight, this.goalTopColLeft, this.goalTopColRight]);
    }
    onCollideHandler() {
    }
    createBall(xPos, yPos) {
        this.ball = matter_js_1.Bodies.circle(xPos, yPos, this.defaultBallRadius, { friction: 0, frictionAir: 0, frictionStatic: 0 });
        this.ball.restitution = 0.5;
        this.ball.label = "ball";
        matter_js_1.Composite.add(this.physicsEngine.world, this.ball);
        this.collisionDetector.bodies.push(this.ball);
    }
    createElectricityEffect(xPos, yPos) {
        this.electricity = matter_js_1.Bodies.circle(xPos, yPos, this.defaultBallRadius, { friction: 0, frictionAir: 0, frictionStatic: 0 });
        this.ball.label = "electricity";
        matter_js_1.Composite.add(this.physicsEngine.world, this.electricity);
        this.collisionDetector.bodies.push(this.electricity);
    }
    createPlayer(xPos, yPos, side, playerIndex) {
        this.players[playerIndex] = new PhysicsPlayer();
        this.players[playerIndex].body = matter_js_1.Bodies.rectangle(xPos, yPos, this.defaultPlayerWidth, this.defaultPlayerHeight);
        this.players[playerIndex].footSensor = matter_js_1.Bodies.rectangle(xPos, yPos, this.defaultPlayerWidth + 1, this.defaultPlayerHeight - 0.5, { isSensor: true, isStatic: true });
        this.players[playerIndex].side = side;
        matter_js_1.Body.setInertia(this.players[playerIndex].body, Infinity);
        matter_js_1.Body.setDensity(this.players[playerIndex].body, 0.0012);
        matter_js_1.Composite.add(this.physicsEngine.world, this.players[playerIndex].body);
        matter_js_1.Composite.add(this.physicsEngine.world, this.players[playerIndex].footSensor);
    }
    startMovePlayerLeft(playerIndex, velocity) {
        if (this.hasGameStarted && !this.players[playerIndex].isFrozen && !this.isResetting) {
            this.players[playerIndex].isMovingLeft = true;
            this.players[playerIndex].velocity = velocity;
            return true;
        }
        return false;
    }
    stopMovePlayerLeft(playerIndex) {
        this.players[playerIndex].isMovingLeft = false;
    }
    startMovePlayerRight(playerIndex, velocity) {
        if (this.hasGameStarted && !this.players[playerIndex].isFrozen && !this.isResetting) {
            this.players[playerIndex].isMovingRight = true;
            this.players[playerIndex].velocity = velocity;
            return true;
        }
        return false;
    }
    stopMovePlayerRight(playerIndex) {
        this.players[playerIndex].isMovingRight = false;
    }
    jumpPlayer(playerIndex, power) {
        if (this.players[playerIndex].isOnGround && this.hasGameStarted) {
            this.players[playerIndex].isOnGround=false
            if (this.players[playerIndex].isBig) {
                matter_js_1.Body.applyForce(this.players[playerIndex].body, this.players[playerIndex].body.position, { x: 0, y: power * 5 });
                this.clock.setTimeout(() => {
                    matter_js_1.Body.applyForce(this.players[playerIndex].body, this.players[playerIndex].body.position, { x: 0, y: -power * 5 });
                }, 350);
            }
            else {
                matter_js_1.Body.applyForce(this.players[playerIndex].body, this.players[playerIndex].body.position, { x: 0, y: power });
                this.clock.setTimeout(() => {
                    matter_js_1.Body.applyForce(this.players[playerIndex].body, this.players[playerIndex].body.position, { x: 0, y: -power });
                }, 350);
            }
            this.players[playerIndex].isOnGround=true;
        }
    }
    degrees_to_radians(degrees) {
        var pi = Math.PI;
        return degrees * (pi / 180);
    }
    shootBall(playerIndex, power, angle) {
        console.log('shootBall function is calling:index, power, anglue ', playerIndex, power, angle)
        
        if (this.players[playerIndex].canShoot && !this.players[playerIndex].isFrozen) {
            if (this.players[playerIndex].side == 0) {
                //_shoot * Mathf.Atan(angle_shot * Mathf.Deg2Rad)
                matter_js_1.Body.setVelocity(this.ball, { x: 0, y: 0 });
                matter_js_1.Body.applyForce(this.ball, { x: this.ball.position.x, y: this.ball.position.y }, { x: power, y: (power * Math.atan(this.degrees_to_radians(angle))) / 1.6 });
            }
            else {
                matter_js_1.Body.setVelocity(this.ball, { x: 0, y: 0 });
                matter_js_1.Body.applyForce(this.ball, { x: this.ball.position.x, y: this.ball.position.y }, { x: -power, y: (power * Math.atan(this.degrees_to_radians(angle))) / 1.6 });
            }
        }
    }
    flipPlayer(playerIndex, power, angle){
        //matter_js_1.Body.setPosition(this.ball,{x : this.ball.position.x, y : this.ball.position.y+2})
        console.log('flipPlayer');
        console.log(this.ball.position);  
        console.log(power+"::"+angle);  
        if(!this.players[playerIndex].isFrozen && this.players[playerIndex].canShoot){
            if (this.players[playerIndex].side == 0) {
                matter_js_1.Body.setVelocity(this.ball, { x: 0, y: 0 });
                matter_js_1.Body.applyForce(this.ball, { x: this.ball.position.x, y: this.ball.position.y }, { x: power, y: (power * Math.atan(this.degrees_to_radians(angle))) / 1.6 });
            }
            else {
                matter_js_1.Body.setVelocity(this.ball, { x: 0, y: 0 });
                matter_js_1.Body.applyForce(this.ball, { x: this.ball.position.x, y: this.ball.position.y }, { x: -power, y: (power * Math.atan(this.degrees_to_radians(angle))) / 1.6 });
            }
         
        }
       
    }
    shootElectricity(playerIndex, power) {
        if (this.players[playerIndex].canShoot && !this.players[playerIndex].isFrozen) {
            if (this.players[playerIndex].side == 0) {
                //_shoot * Mathf.Atan(angle_shot * Mathf.Deg2Rad)
                matter_js_1.Body.setVelocity(this.electricity, { x: 0, y: 0 });
                matter_js_1.Body.applyForce(this.electricity, { x: this.electricity.position.x, y: this.electricity.position.y }, {x:power, y:0});
            }
            else {
                matter_js_1.Body.setVelocity(this.electricity, { x: 0, y: 0 });
                matter_js_1.Body.applyForce(this.electricity, { x: this.electricity.position.x, y: this.electricity.position.y }, {x:power, y:0});
            }
        }
    }
    shootBallFire(player, ball, clock) {
        if (this.players[player.playerID].canShoot && player.canShootFire && !player.isFrozen) {
            if (this.players[player.playerID].side == 0) {
                matter_js_1.Body.applyForce(this.ball, { x: this.ball.position.x, y: this.ball.position.y }, { x: 0.0003, y: 0.0001 });
            }
            else {
                matter_js_1.Body.applyForce(this.ball, { x: this.ball.position.x, y: this.ball.position.y }, { x: -0.0003, y: 0.0001 });
            }
            player.canShootFire = false;
            ball.isOnFire = true;
            clock.setTimeout(() => {
                ball.isOnFire = false;
            }, 2000);
            clock.setTimeout(() => {
                player.canShootFire = true;
            }, 5000);
        }
    }
    scoreGoal(side) {
        if (!this.isResetting) {
            this.isResetting = true;
            if (side == 1) {
                this.leftGoals++;
            }
            else if (side == 0) {
                this.rightGoals++;
            }
            this.gameRoom.clients.forEach((client_1) => {
                client_1.send("score_goal", 1);
            });
            this.clock.setTimeout(() => {
                this.Reset();
                this.isResetting = false;
                if (this.roomState.waitingForGoldenGoal) {
                    this.roomState.waitingForGoldenGoal = false;
                }
            }, 2000);
        }
    }
    Reset() {
        matter_js_1.Body.setVelocity(this.ball, { x: 0, y: 0 });
        matter_js_1.Body.setPosition(this.ball, { x: 0, y: 3 });
        for (let index = 0; index < this.players.length; index++) {
            var player = this.players[index];
            if (player != null) {
                // left
                if (player.side == 0) {
                    matter_js_1.Body.setPosition(player.body, { x: -5, y: 0 });
                }
                // right
                else if (player.side == 1) {
                    matter_js_1.Body.setPosition(player.body, { x: 5, y: 0 });
                }
                matter_js_1.Body.setPosition(player.footSensor, player.body.position);
            }
        }
    }
    stepSimulation() {
        if (matter_js_1.Collision.collides(this.ball, this.wallLeft) != null) {
            if (this.isResetting) {
                matter_js_1.Body.setVelocity(this.ball, { x: 0, y: 0 });
            }
        }
        if (matter_js_1.Collision.collides(this.ball, this.wallRight)) {
            if (this.isResetting) {
                matter_js_1.Body.setVelocity(this.ball, { x: 0, y: 0 });
            }
        }
        if (matter_js_1.Collision.collides(this.ball, this.goalTopColLeft)) {
            if (this.isResetting) {
                matter_js_1.Body.setVelocity(this.ball, { x: 0, y: 0 });
            }
        }
        if (matter_js_1.Collision.collides(this.ball, this.goalTopColRight)) {
            if (this.isResetting) {
                matter_js_1.Body.setVelocity(this.ball, { x: 0, y: 0 });
            }
        }
        for (let index = 0; index < this.players.length; index++) {
            var player = this.players[index];
            if (player != null) {
                if (matter_js_1.Collision.collides(player.body, this.ground) != null) {
                    player.isOnGround = true;
                    //console.log("Ground");
                }
                else {
                    player.isOnGround = false;
                   
                }
                
                if (player.isMovingLeft) {
                    matter_js_1.Body.setVelocity(player.body, { x: -(player.velocity / 5000), y: player.body.velocity.y });
                    //matter_js_1.Body.setVelocity(player.footSensor, { x: -(player.velocity / 5000), y: player.body.velocity.y });
                }
                if (player.isMovingRight) {
                    matter_js_1.Body.setVelocity(player.body, { x: player.velocity / 5000, y: player.body.velocity.y });
                    //matter_js_1.Body.setVelocity(player.footSensor, { x:player.velocity / 5000, y: player.body.velocity.y });
                }
                matter_js_1.Body.setPosition(player.footSensor, player.body.position);
                if (matter_js_1.Collision.collides(player.footSensor, this.ball) != null) {
                    player.canShoot = true;
                }
                else {
                    player.canShoot = false;
                }
                
                if (matter_js_1.Collision.collides(player.body, this.ball) != null) {
                     player.canShoot = true;
                     
                }
                else {
                     player.canShoot = false;
                    
                }

                if (matter_js_1.Collision.collides(this.ball, player.body) != null) {
                    var dY = this.ball.position.y - player.body.position.y;
                    if (dY > 1.5) {
                        if (!player.isOnGround) {
                            if (player.side == 0) {
                                matter_js_1.Body.setVelocity(this.ball, { x: 0.15, y: 0.1 });
                            }
                            else {
                                matter_js_1.Body.setVelocity(this.ball, { x: -0.15, y: 0.1 });
                            }
                            // kick animation
                            this.gameRoom.clients.forEach((client_1) => {
                                client_1.send("head_kick", index);
                            });
                        }
                        else {

                            if (player.side == 0) {
                                matter_js_1.Body.applyForce(this.ball, this.ball.position, { x: global.HEADKICK_VELOCITY_X, y: global.HEADKICK_VELOCITY_Y });
                            }
                            else {
                                matter_js_1.Body.applyForce(this.ball, this.ball.position, { x: -global.HEADKICK_VELOCITY_X, y: global.HEADKICK_VELOCITY_Y });
                            }
                        }
                    }
                    //player.canShoot = true;
                    //Body.applyForce(this.ball, this.ball.position, {x:0, y:0.000004});
                }
                else{
                    var dY = this.ball.position.y - player.body.position.y;
                    var dX = this.ball.position.x - player.body.position.x;
                    if( dY > 2.7 && dY < 4 && Math.abs(dX) < 0.1)
                    {
                        if (player.side == 0) {
                            matter_js_1.Body.setVelocity(this.ball, { x: 0, y: 0 });
                            matter_js_1.Body.applyForce(this.ball, { x: this.ball.position.x, y: this.ball.position.y }, { x: 0.00011, y: (0.00011 * Math.tan(this.degrees_to_radians(50))) / 1.6 });
                        }
                        else {
                            matter_js_1.Body.setVelocity(this.ball, { x: 0, y: 0 });
                            matter_js_1.Body.applyForce(this.ball, { x: this.ball.position.x, y: this.ball.position.y }, { x: -0.00011, y: (0.00011 * Math.tan(this.degrees_to_radians(50))) / 1.6 });
                        }
                        
                    }
                    if( dY < 2.7 && Math.abs(dX) < 0.1)
                        {
                            if (player.side == 0) {
                                matter_js_1.Body.applyForce(this.ball, this.ball.position, { x: global.HEADKICK_VELOCITY_X, y: global.HEADKICK_VELOCITY_Y });
                            }
                            else {
                                matter_js_1.Body.applyForce(this.ball, this.ball.position, { x: -global.HEADKICK_VELOCITY_X, y: global.HEADKICK_VELOCITY_Y });
                            }
                            
                        }
                }
                if (matter_js_1.Collision.collides(this.ball, this.goalTopColLeft) != null) {
                    matter_js_1.Body.setVelocity(this.ball, { x: 0.1, y: 0.1 });
                }
                if (matter_js_1.Collision.collides(this.ball, this.goalTopColRight) != null) {
                    matter_js_1.Body.setVelocity(this.ball, { x: -0.1, y: 0.1 });
                }
                if (matter_js_1.Collision.collides(this.ball, this.wallRight) != null) {
                    //Body.applyForce(this.ball, this.ball.position, {x:-0.00002, y:0.00001});
                }
                if(player.isFreezed){
                    matter_js_1.Body.setPosition(player.body, { x: player.body.position.x, y: 0.8 });
                }
              
            }
        }
        if (matter_js_1.Collision.collides(this.ball, this.goalLeft) != null) {
            console.log('ball pos:', this.ball.position.x);
            this.scoreGoal(0);
        }
        if (matter_js_1.Collision.collides(this.ball, this.goalRight) != null) {
            this.scoreGoal(1);
        }
        matter_js_1.Engine.update(this.physicsEngine, 1.5);
    }
    endGame() {
    }
    usedIce(user, victim, clock) {
        console.log('usedIce: isElectrify, isLeaves', victim.isElectrify, victim.isLeaves);
        if (!user.hasUsed && !victim.isElectrify && !victim.isLeaves) {
            console.log('usedIce');
            user.hasUsedIce = true;
            victim.isFrozen = true;
            this.players[victim.playerID].isFrozen = true;
            clock.setTimeout(() => {
                victim.isFrozen = false;
                this.players[victim.playerID].isFrozen = false;
            }, 3000);
        }
    }
    usedX2(user, clock) {
        if (!user.isBig && !user.hasUsedX2) {
            user.isBig = true;
            user.hasUsedX2 = true;
            user.isFrozen = false;
            this.players[user.playerID].isBig = true;
            matter_js_1.Body.scale(this.players[user.playerID].body, 2, 2);
            matter_js_1.Body.scale(this.players[user.playerID].footSensor, 2, 2);
            matter_js_1.Body.setInertia(this.players[user.playerID].body, Infinity);
            clock.setTimeout(() => {
                matter_js_1.Body.scale(this.players[user.playerID].body, 0.5, 0.5);
                matter_js_1.Body.scale(this.players[user.playerID].footSensor, 0.5, 0.5);
                matter_js_1.Body.setInertia(this.players[user.playerID].body, Infinity);
                this.players[user.playerID].isBig = false;
                user.isBig = false;
            }, 10000);
        }
    }
    usedElectricity(user, victim, clock, power, lifting_time){
        if (!user.usedElectricity && !victim.isLeaves && !victim.isFrozen) {
            user.usedElectricity = true;
            victim.isElectrify = true;
            this.players[victim.playerID].isElectrify = true;
            
            matter_js_1.Body.applyForce(this.players[victim.playerID].body, this.players[victim.playerID].body.position, { x: 0, y: power*10 });
            this.players[victim.playerID].isFreezed = true;
            victim.isFreezed = true;

            clock.setTimeout(() => {
                this.players[victim.playerID].isFreezed = false;
                victim.isFreezed = false;
            }, lifting_time);
            clock.setTimeout(()=>{
                this.players[victim.playerID].isElectrify = false;
                victim.isElectrify = false;
                matter_js_1.Body.applyForce(this.players[victim.playerID].body, this.players[victim.playerID].body.position, { x: 0, y: -power*10 });
            }, lifting_time+500)
        }
    }
    
    usedLeaves(user, victim, clock, power, lifting_time) {
        console.log('usedLeaves: isElectrify, isFrozen', victim.isElectrify, victim.isFrozen);
        if (!user.hasUsedLeaves && !victim.isElectrify && !victim.isFrozen) {
            user.hasUsedLeaves = true;
            victim.isLeaves = true;
            this.players[victim.playerID].isLeaves = true;
            
            matter_js_1.Body.applyForce(this.players[victim.playerID].body, this.players[victim.playerID].body.position, { x: 0, y: power*10 });
            this.players[victim.playerID].isFreezed = true;
                victim.isFreezed = true;
            // clock.setTimeout(() => {
            //     this.players[victim.playerID].isFreezed = true;
            //     victim.isFreezed = true;
            // }, 5);

            clock.setTimeout(() => {
                this.players[victim.playerID].isFreezed = false;
                victim.isFreezed = false;
            }, lifting_time);
            clock.setTimeout(()=>{
                this.players[victim.playerID].isLeaves = false;
                victim.isLeaves = false;
                matter_js_1.Body.applyForce(this.players[victim.playerID].body, this.players[victim.playerID].body.position, { x: 0, y: -power*10 });
            }, lifting_time+500)
        }
    }
}
exports.GameController = GameController;
