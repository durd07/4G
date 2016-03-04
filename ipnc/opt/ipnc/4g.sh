#!/bin/sh

pppd call td_lte
sleep 10
route del default
route add default ppp0

insmod /opt/ipnc/n2n/tun.ko
/opt/ipnc/n2n/edge -d edge0 -a 10.0.0.10 -c mynetwork -u 1000 -g 1000 -k password -l 58.58.40.162:7878 -m ae:e0:4f:e7:47:5b
