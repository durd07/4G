echo 1 > /proc/sys/net/ipv4/ip_forward
ifconfig wlan0 192.168.1.101
hostapd -B /etc/hostapd.conf -P /var/run/hostapd.pid
udhcpd /etc/udhcpd.conf
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
