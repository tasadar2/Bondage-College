// Chapter 8 - Drama Class Load
function C008_DramaClass_Intro_Load() {

	// Time is always 13:00 on the intro, no timer
	StopTimer(13.00 * 60 * 60 * 1000);
	
}

// Chapter 8 - Drama Class Run
function C008_DramaClass_Intro_Run() {
	
	// Paints the background
	var ctx = document.getElementById("MainCanvas").getContext("2d");
	DrawImage(ctx, CurrentChapter + "/" + CurrentScreen + "/Background.jpg", 0, 0);

	// Write the chapter introduction
	DrawText(ctx, GetText("Intro1"), 600, 150, "White");
	if (TextPhase >= 1) DrawText(ctx, GetText("Intro2"), 600, 250, "White");
	if (TextPhase >= 2) DrawText(ctx, GetText("Intro3"), 600, 350, "White");
	if (TextPhase >= 3) DrawText(ctx, GetText("Intro4"), 600, 450, "White");

}

// Chapter 8 - Drama Class Click
function C008_DramaClass_Intro_Click() {
	TextPhase++;
	if (TextPhase >= 4) SetScene(CurrentChapter, "JuliaIntro");
}