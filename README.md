# Zen Not Zen - These koi fishes really sounds good. 

**Abstract**:
Zen not Zen simulate a Koi pond with the addition of assigning to each fish a particular sound and allowing them to play it whenever they’re near a ripple. In this way the project creates a SoundScape (based on two majors pentatonic scale) ever-changing and evolving both in a random and triggered fashion since the user can decide how many fishes will be swimming in the lake and how many ripples said lake will have. Also, as a twist, by dragging the mouse the user will be able to move around the fishes and by clicking it he/she will add a ripple which will disappear within 5 seconds.

**Link**: https://paolobaigueraunitn.github.io/

(Better with Headphones!!!)

**CHROME**: It was developed for Chrome and should work at his best on this browser.

**SAFARI ISSUE**: For Safari Users go to Preferenze -> Riproduzione Automatica -> rettare il valore associato questo sito a “Sempre”. It could also not work on some versions older than 14.0.

**What’s on the screen**: 

- Several fishes happily swimming within it. 

- Many Ripples expanding and contracting

- Two sliders: Fishes and Ripples

**Interactions**:

- Mouse Click: Create a new Ripple that lasts for only 1 second. In this way the user can choose which fish will play or simply add more momentary ripples.

- Mouse Drag: If a fish is within the dragging space it will disappear and re-render far from the mouse position.

- Sliders: Moving the sliders add or remove respectively Fishes and Ripples which last as long as the user likes

- Automated: Whenever a fish is within any Ripple’s area it plays the note and change his tail’s color. 

- Automated: Every 2 seconds the notes playing changes (either the C or the F pentatonic scale)

**Results**:

- An interactive playground which creates an ever-changing 
	SoundScape. 

		
**Files and so on**:

- All the project’s animations and paints are done through p5.js. This library works on top of web audio and is easy to use yet powerful when it comes to create canvases.
	So, just an index.html,index.js and a CSS stylesheet.

**Give credits where credit’s due**:

I initially followed the Flocking tutorial in order to 	build a customizable framework displaying in-water movements. 

I did not use this code directly, but I did learned a 	lot from these projects.

	https://p5js.org/examples/simulate-flocking.html
	
	https://jsfiddle.net/jagracar/2ctqfwwo/

**To Do**:
	Add falling sticks for very low notes