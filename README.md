# Brewin' Brews
## ENGR 180DA/DB Capstone Project

### Introduction
The bar service industry has not changed the way they operate for a long time. Since its inception, bars have revolved around 
the role of the bartender. The problem is that bartenders are one major source of lost revenue. They are responsible for spilling 
many drinks, slow to service customers, and can’t work for extremely long/late hours. To keep the party going, our solution is automation. 
Just power up and fill the Brewin’ Brewer with your favorite ingredients (base liquor, syrup, enhancements) and it will automatically take orders, 
make drinks, keep track of customer tabs, conduct sobriety tests, and facilitate payments. This way, bars can provide quick and consistent drinks 
for longer hours.  Bar owners will also have access to an admin page that they maintain their Brewin’ Brewer from. 

### Required Hardware
 - [Raspberry Pi Touch Display](https://www.raspberrypi.com/products/raspberry-pi-touch-display/)
 - [Any Raspberry Pi Model B](https://www.raspberrypi.com/products/)
 - 2 MicroUSB Cables + Adapters to power the Pi and Touch Display
 - [USB Microphone](https://www.amazon.com/gp/product/B077VNGVL2/ref=ppx_yo_dt_b_asin_title_o05_s00?ie=UTF8&psc=1)
 - [BerryIMU](https://www.amazon.com/BerryIMUv2-10DOF-Accelerometer-Gyroscope-Magnetometer-Barometric/dp/B072MN8ZRC/ref=sr_1_11_sspa?keywords=berry+imu&qid=1678139719&sr=8-11-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEyRVRYSUFaUUVXWjJCJmVuY3J5cHRlZElkPUEwMzcxMDE1MjlVMlJVUTRFNldYRSZlbmNyeXB0ZWRBZElkPUEwMTY3NDkzMzM3VkVZT0I1NE03VCZ3aWRnZXROYW1lPXNwX210ZiZhY3Rpb249Y2xpY2tSZWRpcmVjdCZkb05vdExvZ0NsaWNrPXRydWU=)
 - [Arducam 5MP Camera](https://www.amazon.com/dp/B012V1HEP4?ref=nb_sb_ss_w_as-reorder-t1_k0_1_7&amp=&crid=2QYMUEVIRCJCE&amp=&sprefix=arducam)
 - USB keyboard and mouse (for setting up device)
 - Raspberry Pi Zero WH
 - Arduino Uno or any of its counterparts
 - Access to a 3D printer with PLA plastic
 - 1/8" thickness rubber sheet
 - [Set of metric screws and nuts](https://a.co/d/gEhhJih)
 - M3 Lock Nuts
 - NEMA 17 Stepper Motor
 - A4988 Stepper Motor Controller
 - 2 x MG996R Servo Motors
 - 9 oz. Solo Cups
  
 ### Touchscreen Software Setup
  1. Install [Raspberry Pi OS with Desktop](https://www.raspberrypi.com/software/) on Raspberry Pi Model B
  2. Ensure you have the latest version of Raspberry Pi OS
  
    sudo apt-get update
    sudo apt-get upgrade
  3. Install [Node JS](https://www.makersupplies.sg/blogs/tutorials/how-to-install-node-js-and-npm-on-the-raspberry-pi#:~:text=How%20to%20install%20Node%20JS%20and%20NPM%20on,Step%206%3A%20Check%20if%20installation%20was%20successful%20)
  4. Install [Python](https://installvirtual.com/how-to-install-python-3-8-on-raspberry-pi-raspbian/)
  5. Clone this repo and navigate to *TouchscreenUI/brewin-brewer* folder
  6. Run `npm install` to install all required dependencies
  7. Navigate to *TouchscreenUI/brewin-brewer/src/utils/admin.json* and edit json file with your Brewin' Brews username and deviceID
  8. Open up 2 terminals (one for running backend python server, and one to open the front-end app)
  9. On the backend server terminal, navigate to *TouchscreenUI/brewin-brewer/src/utils/* and run `uwsgi --http localhost:9999 --master -p 4 -w backend:app`
  10. On the front-end terminal, navigate to *TouchscreenUI/brewin-brewer/* and run
      ```
      npm run build
      serve -s build
      /usr/bin/chromium-browser --max-old-space-size=750 --noerrdialogs --disable-infobars --kiosk http://localhost:3000
      ```
  App should now be running and take up the whole Touch Display (as a result of kiosk mode)
  
### Admin Page Software Setup
  1. Go to terminal of your choice on your computer
  2. Ensure Node JS and Python are installed
  3. Clone this repo and navigate to *AdminPage/admin-app* and run 
  
    npm run build
    serve -s build
  4. Open a browser and navigate to *localhost* to access Admin Page
    
### Electronics Power System Setup

The Brewer requires a 120V Power strip. A 120AC->12V Power Supply is required for operation via a coaxial cable. Each Pi and Arduino also need 5V power delivered via USB. 
The following is the wiring diagram needed to build the electrical panel. The switches portion are mounted on the front facing touch screen panel 

Electrical Panel: 

![image](https://user-images.githubusercontent.com/56652396/225824222-c83970c8-5b8d-41b4-8c65-ec8a4ce77d06.png)

![image](https://user-images.githubusercontent.com/56652396/225824458-9b38219f-9be3-4e50-9d3e-01945b090750.png)

Touch Screen Panel: (Contains Switch panel, Berry IMU, Touch screen on front, and raspberry Pi 4 on the back)
![image](https://user-images.githubusercontent.com/56652396/225824390-99df2603-0be2-4310-a0b4-6d9cfa45319f.png)


### Cup Dispenser and Conveyor Belt Setup

There exists a set of ready-to-print [cup dispenser](https://www.thingiverse.com/thing:3031499) and [conveyor belt](https://www.thingiverse.com/thing:3031479)
files, but further modification is needed for the cup dispenser as the measurements are too small. We have found that sizing it up to 105% of its 
original scale works well. Once all components are printed, assemble them with M3 and M5 screws and lock nuts. The instructions and images of the print
files should suffice in showing how the parts and motors are assembled.

![image](https://user-images.githubusercontent.com/57472147/226167824-8f9c2d8b-5a7e-4daa-93f9-b665329a7c1c.png)

Once you obtain the Arduino and Raspberry Pi Zero, upload the code labeled `fullIntegration.ino` using the provided USB-B cable and the code
labeleded `pi2c.py` respectively. For the Raspberry Pi, you will need to make sure that the code runs on boot, so access the Pi's OS and run
`sudo crontab -e`, press 1 for nano, and add `@reboot python /home/pi/pi2c.py` to the file. Save and exit, and then wire the devices as follows:

![image](https://user-images.githubusercontent.com/57472147/226167772-93a98920-3f2b-481b-9bd7-97b32066bb36.png)

Mount all of your devices to the container, power them on, and you should be ready to go!

#### Please reach out for any questions/concerns :)
