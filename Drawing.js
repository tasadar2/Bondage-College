// A bank of all the chached images
var CacheImage = {};

// Returns the image file or build it from the source
function DrawGetImage(Source) {

    // Search in the cache to find the image
    if (!CacheImage[Source]) {
        var img = new Image;
        img.src = Source;
        CacheImage[Source] = img;
    }

    // returns the final image
    return CacheImage[Source];
}
		
// Draw a zoomed image from a source to the canvas
function DrawImageZoom(ctx, Source, SX, SY, SWidth, SHeight, X, Y, Width, Height) {
	ctx.drawImage(DrawGetImage(Source), SX, SY, SWidth, SHeight, X, Y, Width, Height);
}

// Draw an image from a source to the canvas
function DrawImage(ctx, Source, X, Y) {
	ctx.drawImage(DrawGetImage(Source), X, Y);
}

// Draw an image from a file to the canvas, without using the cache system
function DrawImageNoCache(ctx, Source, X, Y) {

	// The image is created dynamically every time
	var img = new Image;
	img.src = Source;
	ctx.drawImage(img, X, Y);
	
}

// Draw a text in the canvas
function DrawText(ctx, Text, X, Y, Color) {

	// Replace the COMMON_PLAYERNAME keyword with the player name
	Text = Text.replace("COMMON_PLAYERNAME", Common_PlayerName);

	// Font is fixed for now, color can be set
	ctx.font = "24px Arial";
	ctx.fillStyle = Color;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	// Split the text if there's a |
	if (Text.indexOf("|") == -1)
		ctx.fillText(Text, X, Y);
	else {
		ctx.fillText(Text.substring(0, Text.indexOf("|")), X, Y - 19);
		ctx.fillText(Text.substring(Text.indexOf("|") + 1, 1000), X, Y + 19);
	}					

}

// Draw a button
function DrawButton(ctx, Left, Top, Width, Height, Label) {

	// Draw the button rectangle
	ctx.beginPath();
	ctx.rect(Left, Top, Width, Height);
    ctx.fillStyle = 'white'; 
    ctx.fillRect(Left, Top, Width, Height);
	ctx.fill();	
	ctx.lineWidth = '2';
	ctx.strokeStyle = 'black';
	ctx.stroke();
	ctx.closePath();
	
	// Draw the text
	DrawText(ctx, Label, Left + Width / 2, Top + Height / 2, "black");
	
}

// Draw a basic rectangle
function DrawRect(ctx, Left, Top, Width, Height, Color) {
	ctx.beginPath();
	ctx.rect(Left, Top, Width, Height);
    ctx.fillStyle = Color; 
    ctx.fillRect(Left, Top, Width, Height);
	ctx.fill();	
	ctx.closePath();		
}

// Draw a basic circle
function DrawCircle(ctx, CenterX, CenterY, Radius, LineWidth, LineColor) {
	ctx.beginPath();
	ctx.arc(CenterX, CenterY, Radius, 0, 2 * Math.PI, false);
	ctx.lineWidth = LineWidth;
	ctx.strokeStyle = LineColor;
	ctx.stroke();	
}

// Draw --- if zero, +value in green if positive, -value in red if negative
function DrawPosNegValue(ctx, Value, X, Y) {	
	if (Value == 0) DrawText(ctx, "---", X, Y, "black");
	if (Value > 0) DrawText(ctx, "+" + Value.toString(), X, Y, "#00BB00");
	if (Value < 0) DrawText(ctx, Value.toString(), X, Y, "#BB0000");	
}

// Draw the current actor stats toward the player
function DrawActorStats(ctx, Left, Top) {
	
	// Draw the actor name and icon
	DrawText(ctx, CurrentActor, Left - 200, Top + 17, "black");
	DrawImage(ctx, "Icons/Heart.png", Left - 110, Top);
	DrawImage(ctx, "Icons/Submission.png", Left - 10, Top);
	DrawImage(ctx, "Icons/Orgasm.png", Left + 90, Top);
	DrawImage(ctx, "Icons/Bondage.png", Left + 190, Top);
	DrawPosNegValue(ctx, ActorGetValue(ActorLove), Left - 50, Top + 17);
	DrawPosNegValue(ctx, ActorGetValue(ActorSubmission), Left + 50, Top + 17);
	DrawText(ctx, ActorGetValue(ActorOrgasmCount).toString(), Left + 150, Top + 17, "black");
	DrawText(ctx, ActorGetValue(ActorBondageCount).toString(), Left + 250, Top + 17, "black");

}

// Draw the intro box
function DrawIntro(ctx, Intro, CurrentStagePosition, LoveLevel, SubLevel) {

	// Draw the top box and stats
	DrawRect(ctx, 0, 0, 599, 150, "White");	
	if (CurrentActor != "") {
		DrawRect(ctx, 30, 60, 539, 1, "Black");
		DrawActorStats(ctx, 300, 15);
	}
	
	// Find the correct intro text
	var ShowText = "";
	if (OverridenIntroText != "")
		ShowText = OverridenIntroText
	else
		for (var I = 0; I < Intro.length; I++)
			if (Intro[I][IntroStage] == CurrentStagePosition)
				if (ActorInteractionAvailable(Intro[I][IntroLoveReq], Intro[I][IntroSubReq], Intro[I][IntroVarReq], Intro[I][IntroText], true))
					ShowText = Intro[I][IntroText];

	// Draw the intro
	if (CurrentActor != "") DrawText(ctx, ShowText, 300, 105, "black");
	else DrawText(ctx, ShowText, 300, 75, "black");
				
}

// Draw a selectable option on the screen
function DrawOption(ctx, OptionText, Left, Top) {

	// Draw the rectangle and text
	if (OptionText.substr(0, 1) == "@") OptionText = OptionText.substr(1);
	DrawRect(ctx, Left, Top, 299, 89, "White");	
	if ((MouseX >= Left) && (MouseX <= Left + 299) && (MouseY >= Top) && (MouseY <= Top + 89) && !IsMobile) DrawText(ctx, OptionText, Left + 150, Top + 45, "#00BB00");
	else DrawText(ctx, OptionText, Left + 150, Top + 45, "#BB0000");	
	
}

// Draw all the possible interactions 
function DrawInteraction(ctx, Stage, CurrentStagePosition, LoveLevel, SubLevel) {

	// Find all the correct interactions for the current stage
	var Pos = 0;
	for (var S = 0; S < Stage.length; S++)
		if (Stage[S][StageNumber] == CurrentStagePosition) 
			if (ActorInteractionAvailable(Stage[S][StageLoveReq], Stage[S][StageSubReq], Stage[S][StageVarReq], Stage[S][StageInteractionText], false)) {
				
				// Draw the box and interaction
				DrawOption(ctx, Stage[S][StageInteractionText], (Pos % 2) * 300, 151 + (Math.round((Pos - 1) / 2) * 90));
				Pos = Pos + 1;			
				
			}
		
}

// Find the current image file 
function FindImage(Intro, CurrentStagePosition) {
	
	// The image file is a column in the intro CSV file
	var ImageName = "";
	if (OverridenIntroImage != "")
		ImageName = OverridenIntroImage;
	else
		for (var I = 0; I < Intro.length; I++)
			if (Intro[I][IntroStage] == CurrentStagePosition)
				if (ActorInteractionAvailable(Intro[I][IntroLoveReq], Intro[I][IntroSubReq], Intro[I][IntroVarReq], Intro[I][IntroText], true))
					ImageName = Intro[I][IntroImage];
	return ImageName;

}

// Build the full character / object interaction screen
function BuildInteraction(CurrentStagePosition) {

	// Make sure the CSV files for interactions are loaded
	if ((CurrentIntro != null) && (CurrentStage != null)) {

		// Paints the background depending on the current stage
		var ctx = document.getElementById("MainCanvas").getContext("2d");
		DrawImage(ctx, CurrentChapter + "/" + CurrentScreen + "/" + FindImage(CurrentIntro, CurrentStagePosition), 600, 0);
		DrawRect(ctx, 0, 0, 600, 600, "Black");

		// Build all the options for interaction
		DrawIntro(ctx, CurrentIntro, CurrentStagePosition, 0, 0);
		DrawInteraction(ctx, CurrentStage, CurrentStagePosition, 0, 0);

	}

}

// Get the player image file name
function GetPlayerIconImage() {

	// The file name changes if the player is gagged or blinks at specified intervals
	var Image = "Player";
	var seconds = new Date().getTime();
	if (PlayerHasLockedInventory("BallGag") == true) Image = Image + "_BallGag";
    if (PlayerHasLockedInventory("TapeGag") == true) Image = Image + "_TapeGag";
    if (PlayerHasLockedInventory("ClothGag") == true) Image = Image + "_ClothGag";
    if (PlayerHasLockedInventory("DoubleOpenGag") == true) Image = Image + "_DoubleOpenGag";
    if (PlayerHasLockedInventory("Blindfold") == true) Image = Image + "_Blindfold";
	if (Math.round(seconds / 500) % 15 == 0) Image = Image + "_Blink";
	return Image;

}

// Draw all the inventory icons
function DrawInventory(ctx) {

	// Draw the player icon
	if (((MouseX >= 1) && (MouseX <= 74) && (MouseY >= 601) && (MouseY <= 674)) || (IsMobile))
		DrawImage(ctx, "Icons/" + GetPlayerIconImage() + "_Active.png", 0, 601);
	else
		DrawImage(ctx, "Icons/" + GetPlayerIconImage() + "_Inactive.png", 0, 601);
	
	// Scroll in the full inventory to draw the icons and quantity, draw a padlock over the item if it's locked
	var Pos = 1;
	for (var I = 0; I < PlayerInventory.length; I++) {
		var ImgState = "Inactive";
		if (((MouseX >= 1 + Pos * 75) && (MouseX <= 74 + Pos * 75) && (MouseY >= 601) && (MouseY <= 674)) || (IsMobile)) ImgState = "Active";		
		DrawImage(ctx, "Icons/" + PlayerInventory[I][PlayerInventoryName] + "_" + ImgState + ".png", 1 + Pos * 75, 601);
		DrawText(ctx, PlayerInventory[I][PlayerInventoryQuantity].toString(), Pos * 75 + 64, 661, "#000000");
		if (PlayerHasLockedInventory(PlayerInventory[I][PlayerInventoryName]))
			DrawImage(ctx, "Icons/Lock_" + ImgState + ".png", Pos * 75, 600)
		Pos = Pos + 1;
	};

	// Scroll in the locked inventory also to find items that were not loaded
	for (var I = 0; I < PlayerLockedInventory.length; I++) 
		if (!PlayerHasInventory(PlayerLockedInventory[I])) {
			if (((MouseX >= 1 + Pos * 75) && (MouseX <= 74 + Pos * 75) && (MouseY >= 601) && (MouseY <= 674)) || (IsMobile)) {
				DrawImage(ctx, "Icons/" + PlayerLockedInventory[I] + "_Active.png", 1 + Pos * 75, 601);
				DrawImage(ctx, "Icons/Lock_Active.png", Pos * 75, 600);
			}
			else {
				DrawImage(ctx, "Icons/" + PlayerLockedInventory[I] + "_Inactive.png", 1 + Pos * 75, 601);				
				DrawImage(ctx, "Icons/Lock_Inactive.png", Pos * 75, 600);
			}
			Pos = Pos + 1;
		};

}

// Build the bottom bar menu
function BuildBottomBar() {

	// Paints the background depending on the current stage
	var ctx = document.getElementById("MainCanvas").getContext("2d");
	DrawRect(ctx, 0, 600, 1200, 1, "black");
	DrawRect(ctx, 0, 601, 1200, 74, "white");
	DrawRect(ctx, 975, 600, 1, 675, "black");
	DrawInventory(ctx);

	// Draw the leave icon and clock
	if (LeaveIcon != "") {
		DrawImage(ctx, "Icons/Clock.png", 985, 621);
		DrawText(ctx, msToTime(CurrentTime), 1073, 637, "black");
		if (((MouseX >= 1125) && (MouseX <= 1200) && (MouseY >= 600) && (MouseY <= 675)) || (IsMobile)) DrawImage(ctx, "Icons/" + LeaveIcon + "_Active.png", 1125, 600);
		else DrawImage(ctx, "Icons/" + LeaveIcon + "_Inactive.png", 1125, 600);
	} else {
		DrawImage(ctx, "Icons/Clock.png", 1010, 621);
		DrawText(ctx, msToTime(CurrentTime), 1110, 637, "black");
	}

}

// Draw the player image (can zoom if an X and Y are provided)
function DrawPlayerImage(X, Y) {

	// Get the first part of the image
	var ImageCloth = "Clothed";
	if (Common_PlayerUnderwear) ImageCloth = "Underwear";
	if (Common_PlayerNaked) ImageCloth = "Naked";
	if ((Common_PlayerUnderwear || Common_PlayerNaked) && PlayerHasLockedInventory("ChastityBelt")) ImageCloth = "ChastityBelt";
	if (Common_PlayerCostume != "") ImageCloth = Common_PlayerCostume
	
	// Second part is the type of bondage
	var ImageBondage = "_NoBondage";	
	if (PlayerHasLockedInventory("Cuffs") == true) ImageBondage = "_Cuffs";
	if (PlayerHasLockedInventory("Rope") == true) ImageBondage = "_Rope";

	// Third part is the collar, which only shows for certain clothes
	var ImageCollar = "";
	if ((ImageCloth == "Underwear") || (ImageCloth == "Naked") || (ImageCloth == "ChastityBelt") || (ImageCloth == "Damsel")) {
		if (PlayerHasLockedInventory("Collar")) ImageCollar = "_Collar";
		else ImageCollar = "_NoCollar";
	}
	
	// Fourth part is the gag
	var ImageGag = "_NoGag";
	if (PlayerHasLockedInventory("BallGag") == true) ImageGag = "_BallGag";
    if (PlayerHasLockedInventory("TapeGag") == true) ImageGag = "_TapeGag";
    if (PlayerHasLockedInventory("ClothGag") == true) ImageGag = "_ClothGag";
    if (PlayerHasLockedInventory("DoubleOpenGag") == true) ImageGag = "_DoubleOpenGag";

	// Fifth part is the blindfold
	var ImageBlindfold = "";	
    if (PlayerHasLockedInventory("Blindfold") == true) ImageBlindfold = "_Blindfold";
	
	// The image is created from all parts and can be zoomed
	var ctx = document.getElementById("MainCanvas").getContext("2d");
	if ((X == 0) && (Y == 0)) DrawImage(ctx, "C999_Common/Player/" + ImageCloth + ImageBondage + ImageCollar + ImageGag + ImageBlindfold + ".jpg", 600, 0);
	else DrawImageZoom(ctx, "C999_Common/Player/" + ImageCloth + ImageBondage + ImageCollar + ImageGag + ImageBlindfold + ".jpg", X, Y, 600, 600, 600, 0, 1200, 1200);

}

// Draw the transparent actor over the current background
function DrawActor(ActorToDraw, X, Y, Zoom) {

	// First, we retrieve the current clothes
	var ImageCloth = ActorSpecificGetValue(ActorToDraw, ActorCloth);
	if (ImageCloth == "") ImageCloth = "Clothed";
	if (((ImageCloth == "Underwear") || (ImageCloth == "Naked")) && ActorSpecificHasInventory(ActorToDraw, "ChastityBelt")) ImageCloth = "ChastityBelt";
	
	// Second part is the type of bondage
	var ImageBondage = "_NoBondage";	
	if (ActorSpecificHasInventory(ActorToDraw, "Cuffs")) ImageBondage = "_Cuffs";
	if (ActorSpecificHasInventory(ActorToDraw, "Rope")) ImageBondage = "_Rope";
	if (ActorSpecificHasInventory(ActorToDraw, "TwoRopes")) ImageBondage = "_TwoRopes";
	
	// Third part is the gag
	var ImageGag = "_NoGag";
	if (ActorSpecificHasInventory(ActorToDraw, "BallGag")) ImageGag = "_BallGag";
	if (ActorSpecificHasInventory(ActorToDraw, "TapeGag")) ImageGag = "_TapeGag";
	if (ActorSpecificHasInventory(ActorToDraw, "ClothGag")) ImageGag = "_ClothGag";
	
	// Draw the full image from all parts
	var ctx = document.getElementById("MainCanvas").getContext("2d");
	DrawImageZoom(ctx, "Actors/" + ActorToDraw + "/" + ImageCloth + ImageBondage + ImageGag + ".png", 0, 0, 600 / Zoom, 900 / Zoom, X, Y, 600, 900);

}

// Draw the current interaction actor
function DrawInteractionActor() {
	if (ActorHasInventory("TwoRopes")) DrawActor(CurrentActor, 600, -250, 1);
	else DrawActor(CurrentActor, 600, 0, 1);
}
