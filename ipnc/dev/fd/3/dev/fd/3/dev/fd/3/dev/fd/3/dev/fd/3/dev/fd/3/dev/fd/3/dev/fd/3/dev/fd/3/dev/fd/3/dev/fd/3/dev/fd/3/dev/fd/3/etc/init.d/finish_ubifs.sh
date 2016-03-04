#!/bin/sh
echo ' inside finish.sh '
if ! test -e /etc/.configured; then
	> /etc/.configured
fi
#echo 33 > /sys/class/gpio/export
echo 85 > /sys/class/gpio/export
echo 103 > /sys/class/gpio/export
echo 104 > /sys/class/gpio/export
echo 105 > /sys/class/gpio/export
echo 106 > /sys/class/gpio/export
echo 107 > /sys/class/gpio/export
echo 109 > /sys/class/gpio/export
#echo out > /sys/class/gpio/gpio33/direction
echo out > /sys/class/gpio/gpio104/direction
echo in > /sys/class/gpio/gpio109/direction
# alarm in
echo 15 > /sys/class/gpio/export

echo 72 > /sys/class/gpio/export
echo 73 > /sys/class/gpio/export


/etc/init.d/telnetd start
/usr/sbin/sshd -B

/opt/ipnc/smart_mount UBIFS /dev/mtd5 /mnt/nand
mkdir /mnt/log
/opt/ipnc/smart_mount UBIFS /dev/mtd6 /mnt/log
mkdir /tmp/nand
#/opt/ipnc/smart_mount UBIFS /dev/mtd7 /tmp/nand
#rm -f /tmp/nand/boa-temp.bin
/usr/sbin/betaftpd &
cd /opt/ipnc
./init.sh
./CountBoot.sh
touch /tmp/sem_start

infocfg="/mnt/nand/info.cfg"
if [ -f $infocfg ]; then
        ipaddr=`grep ipaddr= $infocfg | cut -d '"' -f 2`
        echo "ipaddr=$ipaddr"
        netmask=`grep netmask= $infocfg | cut -d '"' -f 2`
        echo "netmask=$netmask"
        gateway=`grep gateway= $infocfg | cut -d '"' -f 2`
        echo "gateway=$gateway"
        if [ "$ipaddr" != "" ] ; then
                echo "ifconfig eth0 $ipaddr netmask $netmask"
                ifconfig eth0 $ipaddr netmask $netmask
                echo "route add default gw $gateway"
                route add default gw $gateway
        else
                echo "ipaddr in $infocfg is empty."
        fi
        	
        ethaddr=`cat /sys/class/net/eth0/address`
        sed -i '/ethaddr/ c\\ethaddr="'$ethaddr'"' $infocfg
#        ifconfig eth0 hw ether $ethaddr
else
	echo "File $infocfg not existed."
fi

./update_dev_info
if [ -f $infocfg ]; then
        ethaddr=`grep ethaddr= $infocfg | cut -d '"' -f 2`
        echo "ethaddr=$ethaddr"
        if [ "$ethaddr" != "" ] ; then                      
                echo "ifconfig eth0 hw ether $ethaddr"       
                ifconfig eth0 hw ether $ethaddr              
        else                                                 
                echo "ethaddr in $infocfg is empty."         
        fi                                                   
                                                      
else                                                
        echo "File $infocfg not existed."          
fi  
echo -n wait > /opt/ipnc/pid.rules/wis-streamer
echo -n wait > /opt/ipnc/pid.rules/wis-streamer1
echo -n wait > /opt/ipnc/pid.rules/wis-streamer2
echo -n wait > /opt/ipnc/pid.rules/wis-streamer3
echo -n wait > /opt/ipnc/pid.rules/wis-streamer4
echo -n wait > /opt/ipnc/pid.rules/boa
echo -n wait > /opt/ipnc/pid.rules/sip
echo -n wait > /opt/ipnc/pid.rules/nvcsdk
echo -n wait > /opt/ipnc/pid.rules/ipnc_rdk_mcfw.out
echo -n wait > /opt/ipnc/pid.rules/system_server
echo -n wait > /opt/ipnc/pid.rules/vd

#sh /usr/sbin/count.sh

insmod /opt/ipnc/usbnet.ko
insmod /opt/ipnc/GobiNet.ko
insmod /opt/ipnc/n2n/tun.ko

#sleep 10


#./system_server&
#sleep 5
#./autorun_ipnc.sh&

