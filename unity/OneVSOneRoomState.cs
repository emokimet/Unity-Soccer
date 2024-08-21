// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.38
// 

using Colyseus.Schema;

public partial class OneVSOneRoomState : Schema {
	[Type(0, "ref", typeof(NetworkPlayer))]
	public NetworkPlayer leftPlayer = new NetworkPlayer();

	[Type(1, "ref", typeof(NetworkPlayer))]
	public NetworkPlayer rightPlayer = new NetworkPlayer();

	[Type(2, "ref", typeof(NetworkPlayer))]
	public NetworkPlayer leftPlayer1 = new NetworkPlayer();

	[Type(3, "ref", typeof(NetworkPlayer))]
	public NetworkPlayer rightPlayer1 = new NetworkPlayer();

	[Type(4, "ref", typeof(NetworkBall))]
	public NetworkBall ball = new NetworkBall();

	[Type(5, "number")]
	public float stadium_id = default(float);

	[Type(6, "number")]
	public float ball_id = default(float);

	[Type(7, "number")]
	public float gameState = default(float);

	[Type(8, "boolean")]
	public bool ready_to_start = default(bool);

	[Type(9, "number")]
	public float seconds_left = default(float);

	[Type(10, "number")]
	public float goals_left = default(float);

	[Type(11, "number")]
	public float goals_right = default(float);

	[Type(12, "boolean")]
	public bool surrender_left = default(bool);

	[Type(13, "boolean")]
	public bool surrender_right = default(bool);

	[Type(14, "number")]
	public float amount_coins = default(float);

	[Type(15, "boolean")]
	public bool isTournment = default(bool);

	[Type(16, "boolean")]
	public bool waitingForGoldenGoal = default(bool);

	[Type(17, "number")]
	public float tournmentMatchNumber = default(float);

	[Type(18, "number")]
	public float LeftPostX = default(float);

	[Type(19, "number")]
	public float LeftPostY = default(float);

	[Type(20, "number")]
	public float LeftPostWidth = default(float);

	[Type(21, "number")]
	public float LeftPostHeight = default(float);

	[Type(22, "number")]
	public float LeftPostAngle = default(float);

	[Type(23, "number")]
	public float RightPostX = default(float);

	[Type(24, "number")]
	public float RightPostY = default(float);

	[Type(25, "number")]
	public float RightPostWidth = default(float);

	[Type(26, "number")]
	public float RightPostHeight = default(float);

	[Type(27, "number")]
	public float RightPostAngle = default(float);

	[Type(28, "number")]
	public float LeftDetectorX = default(float);

	[Type(29, "number")]
	public float LeftDetectorY = default(float);

	[Type(30, "number")]
	public float LeftDetectorWidth = default(float);

	[Type(31, "number")]
	public float LeftDetectorHeight = default(float);

	[Type(32, "number")]
	public float RightDetectorX = default(float);

	[Type(33, "number")]
	public float RightDetectorY = default(float);

	[Type(34, "number")]
	public float RightDetectorWidth = default(float);

	[Type(35, "number")]
	public float RightDetectorHeight = default(float);
}

