#include <Wire.h>
#define SLAVE_ADDRESS 0x08
byte data_to_echo[] = {0, 0, 0};
int j = 0;
bool ready = false;
const int dirPin = 2;
const int stepPin = 3;
//const int stepsPerRevolution = 200;
const int stepsPerRevolution = 375;
#include <Servo.h>
Servo myservo2;
Servo myservo;
int pos = 0;
bool test = true;

void setup()
{
	// Declare pins as Outputs
	pinMode(stepPin, OUTPUT);
	pinMode(dirPin, OUTPUT);
  pinMode(11, OUTPUT);
  pinMode(12, OUTPUT);
  pinMode(13, OUTPUT);
  myservo2.attach(10);
  myservo.attach(9);

  Wire.begin(SLAVE_ADDRESS);
  Wire.onReceive(receiveData);
  Wire.onRequest(sendData);
  Serial.begin(9600);
}
void loop()
{
  if(ready) {
    for (pos = 0; pos <= 90; pos += 1) { // goes from 0 degrees to 180 degrees
      // in steps of 1 degree
      myservo2.write(90-pos);
      myservo.write(pos);              // tell servo to go to position in variable 'pos'
     delay(15);                       // waits 15 ms for the servo to reach the position
    }
    for (pos = 90; pos >= 0; pos -= 1) { // goes from 180 degrees to 0 degrees
      myservo2.write(90-pos);
      myservo.write(pos);              // tell servo to go to position in variable 'pos'
     delay(15);                       // waits 15 ms for the servo to reach the position
    }
	  // Set motor direction clockwise
	  digitalWrite(dirPin, LOW);
    delay(2000);

	  // Spin motor slowly
	  for(int x = 0; x < stepsPerRevolution; x++)
	  {
		  digitalWrite(stepPin, HIGH);
		  delayMicroseconds(2000);
		  digitalWrite(stepPin, LOW);
		  delayMicroseconds(2000);
	  }
    digitalWrite(11, HIGH);
    delay(data_to_echo[0] * 1400);
    digitalWrite(11, LOW);
    digitalWrite(12, HIGH);
    delay(data_to_echo[1] * 1410);
    digitalWrite(12, LOW);
    digitalWrite(13, HIGH);
    delay(data_to_echo[2] * 1286);
    digitalWrite(13, LOW);
	  delay(7000); // Wait 7 seconds
    ready = false;
  }
}

void receiveData(int bytecount) {
  for(int i = 0; i < bytecount; ++i) {
    Serial.print("Bytes received: ");
    Serial.print(bytecount);
    Serial.print('\n');
    if(j == 0) {
      data_to_echo[0] = Wire.read();
      Serial.print(data_to_echo[0]);
      Serial.print(data_to_echo[1]);
      Serial.print(data_to_echo[2]);
      Serial.print('\n');
      j = 1;
    }
    else if(j == 1) {
      data_to_echo[1] = Wire.read();
      Serial.print(data_to_echo[0]);
      Serial.print(data_to_echo[1]);
      Serial.print(data_to_echo[2]);
      Serial.print('\n');
      j = 2;
    }
    else if(j == 2) {
      data_to_echo[2] = Wire.read();
      Serial.print(data_to_echo[0]);
      Serial.print(data_to_echo[1]);
      Serial.print(data_to_echo[2]);
      Serial.print('\n');
      ready = true;
      j = 0;
    }
  }
}

void sendData() {
  Serial.print("Sending to Pi: ");
  Serial.print(data_to_echo[j]);
  Wire.write(data_to_echo[j]);
  Serial.print('\n');
}
