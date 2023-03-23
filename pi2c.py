import smbus2
import paho.mqtt.client as mqtt
import numpy as np
import time
bus = smbus2.SMBus(1)
address = 0x08
message = ""

def on_connect(client, userdata, flags, rc):
	print("Connection returned result:"+str(rc))
	client.subscribe("BrewinBrewer/000000000/Touchscreen", qos = 1)
def on_disconnect(client, userdata, rc):
	if rc!=0:
		print("Unexpected Disconnect")
	else:
		print("Expected Disconnect")
def on_message(client, userdata, message):
	print("Received message: " + str(message.payload.decode()) + " on topic " + message.topic + " with QoS " + str(message.qos))
	message = str(message.payload.decode())
	split = message.split()
	for i in range(3):
		bus.write_byte(address, int(split[i]))
		print("Master has sent", int(split[i]))
		read = bus.read_byte(address)
		print("Slave has received", read)
	time.sleep(3)
	client.publish("BrewinBrewer/000000000/DispenseSystem", "done", qos=1)
	print("Notified System")

client = mqtt.Client()
client.on_connect = on_connect
client.on_disconnect = on_disconnect
client.on_message = on_message

client.connect_async('test.mosquitto.org')
client.loop_start()
while True:
	pass
