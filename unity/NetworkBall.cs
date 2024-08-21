// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.38
// 

using Colyseus.Schema;

public partial class NetworkBall : Schema {
	[Type(0, "number")]
	public float xPos = default(float);

	[Type(1, "number")]
	public float yPos = default(float);

	[Type(2, "number")]
	public float rotation = default(float);

	[Type(3, "boolean")]
	public bool isOnFire = default(bool);
}

