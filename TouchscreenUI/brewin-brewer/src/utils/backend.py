import random
import string
import time
import sys
import math
#import IMU
import datetime
import os
import random # generate random numbers for simon says and instructions
from array import * # for 2D array, erase later if not needed
import speech_recognition as sr
from venmo_api import Client, PaymentPrivacy
from venmo_api.models.transaction import Transaction
from flask import Flask, request, jsonify, after_this_request, make_response, session
from flask_cors import CORS

""" IMU VARIABLES AND FUNCTIONS """
RAD_TO_DEG = 57.29578
M_PI = 3.14159265358979323846
G_GAIN = 0.070          # [deg/s/LSB]  If you change the dps for gyro, you need to update this value accordingly
AA =  0.40              # Complementary filter constant
MAG_LPF_FACTOR = 0.4    # Low pass filter constant magnetometer
ACC_LPF_FACTOR = 0.4    # Low pass filter constant for accelerometer
ACC_MEDIANTABLESIZE = 9         # Median filter table size for accelerometer. Higher = smoother but a longer delay
MAG_MEDIANTABLESIZE = 9         # Median filter table size for magnetometer. Higher = smoother but a longer delay

prev = 0
curr = 0
diff = 0
tap = 0
change = 0

magXmin =  0
magYmin =  0
magZmin =  0
magXmax =  0
magYmax =  0
magZmax =  0

Q_angle = 0.02
Q_gyro = 0.0015
R_angle = 0.005
y_bias = 0.0
x_bias = 0.0
XP_00 = 0.0
XP_01 = 0.0
XP_10 = 0.0
XP_11 = 0.0
YP_00 = 0.0
YP_01 = 0.0
YP_10 = 0.0
YP_11 = 0.0
KFangleX = 0.0
KFangleY = 0.0

gyroXangle = 0.0
gyroYangle = 0.0
gyroZangle = 0.0
CFangleX = 0.0
CFangleY = 0.0
CFangleXFiltered = 0.0
CFangleYFiltered = 0.0
kalmanX = 0.0
kalmanY = 0.0
oldXMagRawValue = 0
oldYMagRawValue = 0
oldZMagRawValue = 0
oldXAccRawValue = 0
oldYAccRawValue = 0
oldZAccRawValue = 0

a = datetime.datetime.now()

acc_medianTable1X = [1] * ACC_MEDIANTABLESIZE
acc_medianTable1Y = [1] * ACC_MEDIANTABLESIZE
acc_medianTable1Z = [1] * ACC_MEDIANTABLESIZE
acc_medianTable2X = [1] * ACC_MEDIANTABLESIZE
acc_medianTable2Y = [1] * ACC_MEDIANTABLESIZE
acc_medianTable2Z = [1] * ACC_MEDIANTABLESIZE
mag_medianTable1X = [1] * MAG_MEDIANTABLESIZE
mag_medianTable1Y = [1] * MAG_MEDIANTABLESIZE
mag_medianTable1Z = [1] * MAG_MEDIANTABLESIZE
mag_medianTable2X = [1] * MAG_MEDIANTABLESIZE
mag_medianTable2Y = [1] * MAG_MEDIANTABLESIZE
mag_medianTable2Z = [1] * MAG_MEDIANTABLESIZE

def kalmanFilterY ( accAngle, gyroRate, DT):
    y=0.0
    S=0.0

    global KFangleY
    global Q_angle
    global Q_gyro
    global y_bias
    global YP_00
    global YP_01
    global YP_10
    global YP_11

    KFangleY = KFangleY + DT * (gyroRate - y_bias)

    YP_00 = YP_00 + ( - DT * (YP_10 + YP_01) + Q_angle * DT )
    YP_01 = YP_01 + ( - DT * YP_11 )
    YP_10 = YP_10 + ( - DT * YP_11 )
    YP_11 = YP_11 + ( + Q_gyro * DT )

    y = accAngle - KFangleY
    S = YP_00 + R_angle
    K_0 = YP_00 / S
    K_1 = YP_10 / S

    KFangleY = KFangleY + ( K_0 * y )
    y_bias = y_bias + ( K_1 * y )

    YP_00 = YP_00 - ( K_0 * YP_00 )
    YP_01 = YP_01 - ( K_0 * YP_01 )
    YP_10 = YP_10 - ( K_1 * YP_00 )
    YP_11 = YP_11 - ( K_1 * YP_01 )

    return KFangleY

def kalmanFilterX ( accAngle, gyroRate, DT):
    x=0.0
    S=0.0

    global KFangleX
    global Q_angle
    global Q_gyro
    global x_bias
    global XP_00
    global XP_01
    global XP_10
    global XP_11


    KFangleX = KFangleX + DT * (gyroRate - x_bias)

    XP_00 = XP_00 + ( - DT * (XP_10 + XP_01) + Q_angle * DT )
    XP_01 = XP_01 + ( - DT * XP_11 )
    XP_10 = XP_10 + ( - DT * XP_11 )
    XP_11 = XP_11 + ( + Q_gyro * DT )

    x = accAngle - KFangleX
    S = XP_00 + R_angle
    K_0 = XP_00 / S
    K_1 = XP_10 / S

    KFangleX = KFangleX + ( K_0 * x )
    x_bias = x_bias + ( K_1 * x )

    XP_00 = XP_00 - ( K_0 * XP_00 )
    XP_01 = XP_01 - ( K_0 * XP_01 )
    XP_10 = XP_10 - ( K_1 * XP_00 )
    XP_11 = XP_11 - ( K_1 * XP_01 )

    return KFangleX


""" BACKEND APP ROUTES """
app = Flask(__name__)
CORS(app)
app.secret_key = b'&gdfhFG^%*&^%TYJ:KTgf//@25g~'

@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@app.route("/")
def hello_world():
    print("Hello from Python!")
    return jsonify({'test':'test'})

@app.route("/venmoLogin/<adminVenmoUsername>/<adminVenmoPassword>")
def venmoLogin(adminVenmoUsername, adminVenmoPassword):
    # get access token (used to get device ID for every new server session)
    print('getting access token')
    deviceID = "92791724-46W8-3N99-04Y9-7OL73G649FE8"
    access_token = Client.get_access_token(username=adminVenmoUsername, password=adminVenmoPassword, device_id=deviceID)
    print(access_token)
    return jsonify({'result':'success'})


@app.route("/requestPayment/<adminVenmoUsername>/<adminVenmoPassword>/<customerTabTotal>/<userID>", methods=["GET"])
def requestPayment(adminVenmoUsername, adminVenmoPassword, customerTabTotal, userID):
    print('getting access token')
    deviceID = "92791724-46W8-3N99-04Y9-7OL73G649FE8" #retrieve upon first server use (first venmo login on this server)
    access_token = Client.get_access_token(username=adminVenmoUsername, password=adminVenmoPassword, device_id=deviceID)
    venmo = Client(access_token=access_token)

    # request money
    print('requesting payment')
    str_length = 10
    letters = string.ascii_lowercase
    requestID = ''.join(random.choice(letters) for i in range(str_length))
    note = ''.join(["Brewin Brews RequestID: ", requestID]) #generate random transaction ID
    venmo.payment.request_money(float(customerTabTotal), note, userID, privacy_setting=PaymentPrivacy.PUBLIC)

    # check if paid (twice every min)
    count = 0
    while count < 10: # about 5 min running this loop
        time.sleep(30)
        transactions = venmo.user.get_user_transactions(user_id=userID)
        while transactions:
            for transaction in transactions:
                print(transaction.note)
                if((transaction.note == note) and (transaction.status == 'settled')):
                    print("transaction complete")
                    return jsonify({"paid": "true"})
            transactions = transactions.get_next_page()
        count += 1

@app.route("/audioText/")
def getAudioText():
    r = sr.Recognizer()
    with sr.Microphone() as source:
        print("Say Something!")
        audio = r.listen(source)
    try:
        text = r.recognize_google(audio)
        print("Google Speech Recognition thinks you said: " + text)
        return jsonify({"text": text})
    except sr.UnknownValueError:
        print("Google Speech Recognition could not understand audio.")
        return jsonify({"text": "null"})
    except sr.RequestError as e:
        print("Could not request results from Google Speech Recognition service; {0}".format(e))
        return jsonify({"text": "null"})

"""
@app.route("/tapDetection/")
def detectTap():
    # initialize IMU
    IMU.detectIMU()     #Detect if BerryIMU is connected.
    if(IMU.BerryIMUversion == 99):
        print(" No BerryIMU found... exiting ")
        return jsonify({"result": "IMU not detected"})
    IMU.initIMU()       #Initialise the accelerometer, gyroscope and compass

    # detect a tap
    global a
    global oldXMagRawValue
    global oldYMagRawValue
    global oldZMagRawValue
    global oldXAccRawValue 
    global oldYAccRawValue
    global oldZAccRawValue
    global prev
    global curr
    global diff
    global tap
    global change
    global gyroXangle
    global gyroYangle
    global gyroZangle
    global CFangleX
    global CFangleY 
    global CFangleXFiltered 
    global CFangleYFiltered 
    global kalmanX 
    global kalmanY 

    val = "no tap"
    numTap = 2 #might need to change to 1 or 2

    delay = 0.03
    total_iterations = 3/delay
    iterations = 0

    try:
        while iterations < total_iterations:
            iterations += 1

            #Read the accelerometer,gyroscope and magnetometer values
            ACCx = IMU.readACCx()
            ACCy = IMU.readACCy()
            ACCz = IMU.readACCz()
            GYRx = IMU.readGYRx()
            GYRy = IMU.readGYRy()
            GYRz = IMU.readGYRz()
            MAGx = IMU.readMAGx()
            MAGy = IMU.readMAGy()
            MAGz = IMU.readMAGz()


            #Apply compass calibration
            MAGx -= (magXmin + magXmax) /2
            MAGy -= (magYmin + magYmax) /2
            MAGz -= (magZmin + magZmax) /2


            ##Calculate loop Period(LP). How long between Gyro Reads
            b = datetime.datetime.now() - a
            a = datetime.datetime.now()
            LP = b.microseconds/(1000000*1.0)
            outputString = "Loop Time %5.2f " % ( LP )



            ###############################################
            #### Apply low pass filter ####
            ###############################################
            MAGx =  MAGx  * MAG_LPF_FACTOR + oldXMagRawValue*(1 - MAG_LPF_FACTOR);
            MAGy =  MAGy  * MAG_LPF_FACTOR + oldYMagRawValue*(1 - MAG_LPF_FACTOR);
            MAGz =  MAGz  * MAG_LPF_FACTOR + oldZMagRawValue*(1 - MAG_LPF_FACTOR);
            ACCx =  ACCx  * ACC_LPF_FACTOR + oldXAccRawValue*(1 - ACC_LPF_FACTOR);
            ACCy =  ACCy  * ACC_LPF_FACTOR + oldYAccRawValue*(1 - ACC_LPF_FACTOR);
            ACCz =  ACCz  * ACC_LPF_FACTOR + oldZAccRawValue*(1 - ACC_LPF_FACTOR);

            oldXMagRawValue = MAGx
            oldYMagRawValue = MAGy
            oldZMagRawValue = MAGz
            oldXAccRawValue = ACCx
            oldYAccRawValue = ACCy
            oldZAccRawValue = ACCz

            #########################################
            #### Median filter for accelerometer ####
            #########################################
            # cycle the table
            for x in range (ACC_MEDIANTABLESIZE-1,0,-1 ):
                acc_medianTable1X[x] = acc_medianTable1X[x-1]
                acc_medianTable1Y[x] = acc_medianTable1Y[x-1]
                acc_medianTable1Z[x] = acc_medianTable1Z[x-1]

            # Insert the lates values
            acc_medianTable1X[0] = ACCx
            acc_medianTable1Y[0] = ACCy
            acc_medianTable1Z[0] = ACCz

            # Copy the tables
            acc_medianTable2X = acc_medianTable1X[:]
            acc_medianTable2Y = acc_medianTable1Y[:]
            acc_medianTable2Z = acc_medianTable1Z[:]

            # Sort table 2
            acc_medianTable2X.sort()
            acc_medianTable2Y.sort()
            acc_medianTable2Z.sort()

            # The middle value is the value we are interested in
            ACCx = acc_medianTable2X[int(ACC_MEDIANTABLESIZE/2)];
            ACCy = acc_medianTable2Y[int(ACC_MEDIANTABLESIZE/2)];
            ACCz = acc_medianTable2Z[int(ACC_MEDIANTABLESIZE/2)];


            #########################################
            #### Median filter for magnetometer ####
            #########################################
            # cycle the table
            for x in range (MAG_MEDIANTABLESIZE-1,0,-1 ):
                mag_medianTable1X[x] = mag_medianTable1X[x-1]
                mag_medianTable1Y[x] = mag_medianTable1Y[x-1]
                mag_medianTable1Z[x] = mag_medianTable1Z[x-1]

            # Insert the latest values
            mag_medianTable1X[0] = MAGx
            mag_medianTable1Y[0] = MAGy
            mag_medianTable1Z[0] = MAGz

            # Copy the tables
            mag_medianTable2X = mag_medianTable1X[:]
            mag_medianTable2Y = mag_medianTable1Y[:]
            mag_medianTable2Z = mag_medianTable1Z[:]

            # Sort table 2
            mag_medianTable2X.sort()
            mag_medianTable2Y.sort()
            mag_medianTable2Z.sort()

            # The middle value is the value we are interested in
            MAGx = mag_medianTable2X[int(MAG_MEDIANTABLESIZE/2)];
            MAGy = mag_medianTable2Y[int(MAG_MEDIANTABLESIZE/2)];
            MAGz = mag_medianTable2Z[int(MAG_MEDIANTABLESIZE/2)];



            #Convert Gyro raw to degrees per second
            rate_gyr_x =  GYRx * G_GAIN
            rate_gyr_y =  GYRy * G_GAIN
            rate_gyr_z =  GYRz * G_GAIN


            #Calculate the angles from the gyro.
            gyroXangle+=rate_gyr_x*LP
            gyroYangle+=rate_gyr_y*LP
            gyroZangle+=rate_gyr_z*LP

            #Convert Accelerometer values to degrees
            AccXangle =  (math.atan2(ACCy,ACCz)*RAD_TO_DEG)
            AccYangle =  (math.atan2(ACCz,ACCx)+M_PI)*RAD_TO_DEG


            #Change the rotation value of the accelerometer to -/+ 180 and
            #move the Y axis '0' point to up.  This makes it easier to read.
            if AccYangle > 90:
                AccYangle -= 270.0
            else:
                AccYangle += 90.0



            #Complementary filter used to combine the accelerometer and gyro values.
            CFangleX=AA*(CFangleX+rate_gyr_x*LP) +(1 - AA) * AccXangle
            CFangleY=AA*(CFangleY+rate_gyr_y*LP) +(1 - AA) * AccYangle

            #Kalman filter used to combine the accelerometer and gyro values.
            kalmanY = kalmanFilterY(AccYangle, rate_gyr_y,LP)
            kalmanX = kalmanFilterX(AccXangle, rate_gyr_x,LP)

            #Calculate heading
            heading = 180 * math.atan2(MAGy,MAGx)/M_PI

            #Only have our heading between 0 and 360
            if heading < 0:
                heading += 360

            ####################################################################
            ###################Tilt compensated heading#########################
            ####################################################################
            #Normalize accelerometer raw values.
            accXnorm = ACCx/math.sqrt(ACCx * ACCx + ACCy * ACCy + ACCz * ACCz)
            accYnorm = ACCy/math.sqrt(ACCx * ACCx + ACCy * ACCy + ACCz * ACCz)


            #Calculate pitch and roll
            pitch = math.asin(accXnorm)
            roll = -math.asin(accYnorm/math.cos(pitch))


            #Calculate the new tilt compensated values
            #The compass and accelerometer are orientated differently on the the BerryIMUv1, v2 and v3.
            #This needs to be taken into consideration when performing the calculations

            #X compensation
            if(IMU.BerryIMUversion == 1 or IMU.BerryIMUversion == 3):            #LSM9DS0 and (LSM6DSL & LIS2MDL)
                magXcomp = MAGx*math.cos(pitch)+MAGz*math.sin(pitch)
            else:                                                                #LSM9DS1
                magXcomp = MAGx*math.cos(pitch)-MAGz*math.sin(pitch)

            #Y compensation
            if(IMU.BerryIMUversion == 1 or IMU.BerryIMUversion == 3):            #LSM9DS0 and (LSM6DSL & LIS2MDL)
                magYcomp = MAGx*math.sin(roll)*math.sin(pitch)+MAGy*math.cos(roll)-MAGz*math.sin(roll)*math.cos(pitch)
            else:                                                                #LSM9DS1
                magYcomp = MAGx*math.sin(roll)*math.sin(pitch)+MAGy*math.cos(roll)+MAGz*math.sin(roll)*math.cos(pitch)

            #Calculate tilt compensated heading
            tiltCompensatedHeading = 180 * math.atan2(magYcomp,magXcomp)/M_PI

            if tiltCompensatedHeading < 0:
                tiltCompensatedHeading += 360


            ##################### END Tilt Compensation ########################

            prev = curr
            curr = ACCz
            diff = curr - prev

            if (abs(diff) > 75 and abs(diff) < 300):
                change = change + 1

            #slow program down a bit, makes the output more readable
            time.sleep(0.03)
            
            if (change >= 2):
                tap += 1
                change = 0
            if (tap >= numTap):
                val = "tap"
                tap = 0
                break
    except:
        change = 0
        tap = 0
        val = "no tap"
    return jsonify({"result": val})
"""
if __name__ == "__main__":
    app.run(host='localhost', port=80)