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

/opt/ipnc/smart_mount UBIFS /dev/mtd5 /mnt/nand
mkdir /tmp/nand
/opt/ipnc/smart_mount UBIFS /dev/mtd7 /tmp/nand
rm -f /tmp/nand/boa-temp.bin

cd /opt/ipnc
./init.sh

./system_server&
sleep 7
./autorun_ipnc.sh&

cd /

