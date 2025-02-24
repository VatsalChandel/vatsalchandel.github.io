const BAUD_RATE = 9600; // This should match the baud rate in your Arduino sketch

let port, connectBtn; // Declare global variables

let motorVal = 0;
let ledVal = 0;

function setup() {
  setupSerial(); // Run our serial setup function (below)

  // Create a canvas that is the size of our browser window.
  // windowWidth and windowHeight are p5 variables
  createCanvas(windowWidth, windowHeight);

  // p5 text settings. BOLD and CENTER are constants provided by p5.
  // See the "Typography" section in the p5 reference: https://p5js.org/reference/
  textFont("system-ui", 50);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
}

function draw() {
  const portIsOpen = checkPort(); // Check whether the port is open (see checkPort function below)
  if (!portIsOpen) return; // If the port is not open, exit the draw loop

  let str = port.readUntil("\n"); // Read from the port until the newline
  if (str.length == 0) return; // If we didn't read anything, return.
  

  // trim the whitespace (the newline) and convert the string to a number
  const tokens = str.trim().split(",");
  if (tokens.length < 2) return;


  
  // Change text and colors based on button state. In p5, you can set colors
  // using standard CSS color names as well as many other color formats.

  motorVal = Number(tokens[0]);
  ledVal = Number(tokens[1]);

  console.log(motorVal, ledVal);

  let hueValue = map(motorVal, 0, 255, 120, 0);

  let brightness = map(ledVal, 0, 1023, 0, 200); 

  background(hueValue, 100, brightness);
  fill(0); 
  text("Motor: " + motorVal, windowWidth / 2, windowHeight / 2 - 50);
  text("LED: " + ledVal, windowWidth / 2, windowHeight / 2 + 50);
  
}
function keyPressed() {
  // If the "1" key is pressed, send a '1' command to trigger override mode.
  if (key === '1') {
    if (port && port.opened()) {
      port.write('1');
    }
  }
}
// Three helper functions for managing the serial connection.

function setupSerial() {
  port = createSerial();

  // Check to see if there are any ports we have used previously
  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    // If there are ports we've used, open the first one
    port.open(usedPorts[0], BAUD_RATE);
  }

  // create a connect button
  connectBtn = createButton("Connect to Arduino");
  connectBtn.position(5, 5); // Position the button in the top left of the screen.
  connectBtn.mouseClicked(onConnectButtonClicked); // When the button is clicked, run the onConnectButtonClicked function
}

function checkPort() {
  if (!port.opened()) {
    // If the port is not open, change button text
    connectBtn.html("Connect to Arduino");
    // Set background to gray
    background("gray");
    return false;
  } else {
    // Otherwise we are connected
    connectBtn.html("Disconnect");
    return true;
  }
}

function onConnectButtonClicked() {
  // When the connect button is clicked
  if (!port.opened()) {
    // If the port is not opened, we open it
    port.open(BAUD_RATE);
  } else {
    // Otherwise, we close it!
    port.close();
  }
}