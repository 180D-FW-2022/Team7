const int dirPin = 2;
const int stepPin = 3;
//const int stepsPerRevolution = 200;
const int stepsPerRevolution = 400;
#include <Servo.h>
Servo myservo2;
Servo myservo;
int pos = 0;

void setup()
{
	// Declare pins as Outputs
	pinMode(stepPin, OUTPUT);
	pinMode(dirPin, OUTPUT);
  myservo2.attach(10);
  myservo.attach(9);
}
void loop()
{
  for (pos = 0; pos <= 70; pos += 1) { // goes from 0 degrees to 180 degrees
    // in steps of 1 degree
    myservo2.write(70-pos);
    myservo.write(pos);              // tell servo to go to position in variable 'pos'
    delay(15);                       // waits 15 ms for the servo to reach the position
  }
  for (pos = 70; pos >= 0; pos -= 1) { // goes from 180 degrees to 0 degrees
    myservo2.write(70-pos);
    myservo.write(pos);              // tell servo to go to position in variable 'pos'
    delay(15);                       // waits 15 ms for the servo to reach the position
  }
	// Set motor direction clockwise
	digitalWrite(dirPin, HIGH);

	// Spin motor slowly
	for(int x = 0; x < stepsPerRevolution; x++)
	{
		digitalWrite(stepPin, HIGH);
		delayMicroseconds(2000);
		digitalWrite(stepPin, LOW);
		delayMicroseconds(2000);
	}
	delay(15000); // Wait 15 seconds
}