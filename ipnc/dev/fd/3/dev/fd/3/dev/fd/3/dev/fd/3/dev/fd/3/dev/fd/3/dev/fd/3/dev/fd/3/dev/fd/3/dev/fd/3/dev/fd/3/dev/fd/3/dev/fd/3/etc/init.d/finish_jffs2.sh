#!/bin/sh
echo ' inside finish.sh '
if ! test -e /etc/.configured; then
	> /etc/.configured
fi
echo 33 > /sys/class/gpio/export
echo 85 > /sys/class/gpio/export
echo 103 > /sys/class/gpio/export
echo 104 > /sys/class/gpio/export
echo 105 > /sys/class/gpio/export
echo 106 > /sys/class/gpio/export
echo 107 > /sys/class/gpio/export
echo out > /sys/class/gpio/gpio33/direction
echo out > /sys/class/gpio/gpio104/direction
mount -t jffs2 /dev/mtdblock5 /mnt/nand
mkdir /tmp/nand
mount -t jffs2 /dev/mtdblock7 /tmp/nand
rm -f /tmp/nand/boa-temp.bin

cd /opt/ipnc
./init.sh

./system_server&
sleep 10
./autorun_ipnc.sh&

cd /

