#insmod usbnet.ko
#insmod GobiNet.ko
#insmod /opt/ipnc/n2n/tun.ko

#route del default  
#sleep 1
/var/ftp/4g -v at+cgdcont=1,\"IP\",\"cmiot\"
sleep 1
/var/ftp/4g -v at\$qcrmcall=1,1
sleep 5
#route add default dev usb0
#sleep 1

/opt/ipnc/n2n/edge -d edge0 -a 10.0.0.10 -c mynetwork -u 1000 -g 1000 -k password -l 58.58.40.162:7878 -m ae:e0:4f:e7:47:5b
