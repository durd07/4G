pptp --debug 192.168.1.164 user sui password sui require-mppe 
sleep 6 
route add -net 192.168.1.0 netmask 255.255.255.0 dev ppp0