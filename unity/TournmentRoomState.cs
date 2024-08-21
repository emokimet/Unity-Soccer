// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.38
// 

using Colyseus.Schema;

public partial class TournmentRoomState : Schema {
	[Type(0, "string")]
	public string player1Name = default(string);

	[Type(1, "boolean")]
	public bool player1Ready = default(bool);

	[Type(2, "string")]
	public string player2Name = default(string);

	[Type(3, "boolean")]
	public bool player2Ready = default(bool);

	[Type(4, "string")]
	public string player3Name = default(string);

	[Type(5, "boolean")]
	public bool player3Ready = default(bool);

	[Type(6, "string")]
	public string player4Name = default(string);

	[Type(7, "boolean")]
	public bool player4Ready = default(bool);

	[Type(8, "string")]
	public string match1Winner = default(string);

	[Type(9, "boolean")]
	public bool match1WinnerReady = default(bool);

	[Type(10, "string")]
	public string match2Winner = default(string);

	[Type(11, "boolean")]
	public bool match2WinnerReady = default(bool);

	[Type(12, "string")]
	public string match3Winner = default(string);
}

