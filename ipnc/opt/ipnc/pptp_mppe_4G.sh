pptp --debug 58.58.40.162 user sui password sui require-mppe
sleep 5
route add -net 192.168.1.0 netmask 255.255.255.0 dev ppp0
