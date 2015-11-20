#!/bin/sh

echo 1 > /sys/module/lc_ether/parameters/rt_debug
dmesg >  /tmp/kernellog1
dmesg -c
date
killall udhcpc                     
echo 4 4 -1 | ndis_test > /dev/null 
echo 3 4  -1 | ndis_test > /dev/null ------发一个disconnect，避免重复拨号
sleep 1                            
echo 4 4 -1 | ndis_test > /dev/null -------确认disconnect response
echo 2 4  -1 | ndis_test > /dev/null ------发送connect qmi request
sleep 20                             
echo 4 4 4 -1 | ndis_test > /dev/null  -----确认connect response
sleep 20                           
echo 4 4 -1 | ndis_test > /dev/null   -----确认connect response
sleep 20                           
echo 4 4 -1 | ndis_test > /dev/null    -----确认connect response，不出意外，应该已经拨号成功了
udhcpc -i wan0 &                  ----dhclient 配置ip/dns/路由
