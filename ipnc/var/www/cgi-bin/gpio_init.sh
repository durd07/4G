#/bin/sh
cd /opt/ipnc

#GPIO85#Write Light Control
insmod /opt/ipnc/pinmux_module.ko a=0x48140ac8 v=0x80
rmmod /opt/ipnc/pinmux_module.ko
echo 85 > /sys/class/gpio/export
echo out > /sys/class/gpio/gpio85/direction
echo 0 > /sys/class/gpio/gpio85/value

#GPIO99#三色灯主控
insmod /opt/ipnc/pinmux_module.ko a=0x48140b48 v=0x80
rmmod /opt/ipnc/pinmux_module.ko
echo 99 > /sys/class/gpio/export
echo out > /sys/class/gpio/gpio99/direction
echo 0 > /sys/class/gpio/gpio99/value

#GPIO100#绿灯控制
insmod /opt/ipnc/pinmux_module.ko a=0x48140b4c v=0x80
rmmod /opt/ipnc/pinmux_module.ko
echo 100 > /sys/class/gpio/export
echo out > /sys/class/gpio/gpio100/direction
echo 0 > /sys/class/gpio/gpio100/value

#GPIO73#红灯控制
insmod /opt/ipnc/pinmux_module.ko a=0x48140A3C v=0x80
rmmod /opt/ipnc/pinmux_module.ko
echo 73 > /sys/class/gpio/export
echo out > /sys/class/gpio/gpio73/direction
echo 0 > /sys/class/gpio/gpio73/value

#蓝灯通过8574实现
#8574
insmod /opt/ipnc/pinmux_module.ko a=0x48140924 v=0x20
rmmod /opt/ipnc/pinmux_module.ko
insmod /opt/ipnc/pinmux_module.ko a=0x48140928 v=0x20
rmmod /opt/ipnc/pinmux_module.ko

insmod /opt/ipnc/pinmux_module.ko a=0x48140A38 v=0x80
rmmod /opt/ipnc/pinmux_module.ko
insmod /opt/ipnc/pinmux_module.ko a=0x481408d4 v=0x80
rmmod /opt/ipnc/pinmux_module.ko
echo 72 > /sys/class/gpio/export
echo in > /sys/class/gpio/gpio72/direction

echo 24 > /sys/class/gpio/export
echo in> /sys/class/gpio/gpio24/direction


# audio module
insmod /opt/ipnc/pinmux_module.ko a=0x481408A0 v=0x01
rmmod /opt/ipnc/pinmux_module.ko
insmod /opt/ipnc/pinmux_module.ko a=0x4814089C v=0x01
rmmod /opt/ipnc/pinmux_module.ko
insmod /opt/ipnc/pinmux_module.ko a=0x4814083C v=0x04
rmmod /opt/ipnc/pinmux_module.ko
insmod /opt/ipnc/pinmux_module.ko a=0x48140898 v=0x01
rmmod /opt/ipnc/pinmux_module.ko
insmod /opt/ipnc/pinmux_module.ko a=0x481408A4 v=0x01
rmmod /opt/ipnc/pinmux_module.ko
insmod /opt/ipnc/pinmux_module.ko a=0x48140924 v=0x20
rmmod /opt/ipnc/pinmux_module.ko
insmod /opt/ipnc/pinmux_module.ko a=0x48140928 v=0x20
rmmod /opt/ipnc/pinmux_module.ko

i2c-8812 -w 0x1a 0x01 0x16d
i2c-8812 -w 0x1a 0x03 0x89
i2c-8812 -w 0x1a 0x0a 0x08 #cancel slience
i2c-8812 -w 0x1a 0x38 0x01 #disable loopback
