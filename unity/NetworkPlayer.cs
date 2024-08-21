// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.38
// 

using Colyseus.Schema;

public partial class NetworkPlayer : Schema {
	[Type(0, "boolean")]
	public bool isHost = default(bool);

	[Type(1, "number")]
	public float playerID = default(float);

	[Type(2, "number")]
	public float selected_head = default(float);

	[Type(3, "number")]
	public float side = default(float);

	[Type(4, "number")]
	public float xPos = default(float);

	[Type(5, "number")]
	public float yPos = default(float);

	[Type(6, "boolean")]
	public bool hasLoaded = default(bool);

	[Type(7, "boolean")]
	public bool hasUsedIce = default(bool);

	[Type(8, "boolean")]
	public bool hasUsedX2 = default(bool);

	[Type(9, "boolean")]
	public bool isFrozen = default(bool);

	[Type(10, "boolean")]
	public bool isBig = default(bool);

	[Type(11, "boolean")]
	public bool isWalkingLeft = default(bool);

	[Type(12, "boolean")]
	public bool isWalkingRight = default(bool);

	[Type(13, "boolean")]
	public bool isShootingBall = default(bool);

	[Type(14, "boolean")]
	public bool canShootFire = default(bool);

	[Type(15, "string")]
	public string playerName = default(string);
}

