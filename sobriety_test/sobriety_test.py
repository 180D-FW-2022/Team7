"""
Created by: Ryan Kosasih

This file is the sobriety test, the program that ensures device users only get more drinks if they are still sober.

File status: In progress.

Commments:
* Remember to install pytimedinput (pip install pytimedinput). Might not be needed later since BerryIMUv3 has not been integrated.

Issues:
* Don't know how to use BerryIMUv3 values for tap test.
* Might be better to let input not go to the next step after an input is received.
    For example: after tap 1 is received, it is better to not go to tap 2 right away.

Current target:
* Integrate BerryIMUv3 to the main program

"""

import random # generate random numbers for simon says and instructions
import time # to insert idle time for users to read
from array import * # for 2D array
from pytimedinput import timedInput # for timed input

""" ##### FUNCTIONS ##### """

def simon_says(simon): # argument: array
    ensure = 0 # to ensure at least one of the instructions has simon says
    for i in range(3):
        simon[i] = random.randint(0,1)
        ensure = ensure + simon[i]
    if ensure < 1:
        num = random.randint(0,2)
        simon[num] = 1
    return simon

def instructions(instr): # argument: 2d array
    for i in range(3):
        for j in range(5):
            num = random.randint(0,1)
            if num == 1:
                instr[i][j] = '*'
    return instr

""" ##### END OF FUNCTIONS ##### """

"""
BERRYIMUV3 CODE
"""

""" ##### MAIN ##### """

# Default values   
display = "" # string to be displayed to users to follow instruction
simon = [0, 0, 0] # begins or does not begin with simon says
instr = [['_', '_', '_', '_', '_'], ['_', '_', '_', '_', '_'], ['_', '_', '_', '_', '_']] # instructions
skip = 0 # to skip test instructions
test_pass = 1 # result of the test

simon = simon_says(simon)
instr = instructions(instr)

print("Looks like it's your third or more drink of the day.")
time.sleep(1)
print("To ensure you are drinking responsibly (remain sober), you are required to pass the sobriety test.")
time.sleep(2)
print("Have you ever done the test?") # or input
if skip == 0:
    print("Display the instructions")
    # make sure to insert time.sleep for gaps

for i in range(3):
    if simon[i] == 1:
        display = display + "SIMON SAYS "
    display = display + "FOLLOW THE PATTERN: "
    for j in range(5):
        display = display + " " + instr[i][j] + " "
    print(display)
    time.sleep(2)
    if simon[i] == 0: # do not follow instructions because it does not begin with simon says
        instr[i] = ['_', '_', '_', '_', '_']
    print("Ready?")
    time.sleep(1)
    print("Go!")
    for j in range(5):
        ##### INCOMING BIG MESS #####
        
        tap, timedOut = timedInput("Tap %d: " %(j+1), 2) # time out might need to be reduced
        if timedOut:
            tap = "_"

        ##### END OF BIG MESS #####
        if tap != instr[i][j]:
            test_pass = 0
            break
    if test_pass == 0:
        print("\nYou failed the test.")
        break
    display = ""
    if i != 2:
        print("\nOnto the next instruction.\n")
        time.sleep(0.5)

if test_pass == 1:    
    print("\nYou passed the test. Enjoy your next drink!")

""" ##### END OF MAIN ##### """