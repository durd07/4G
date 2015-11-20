echo "TIMEOUT 5 '' AT OK AT+CGDCONT=1,\"IP\",\"3gnet\" OK AT OK ATE0V1 OK AT OK ATS0=0 OK AT OK ATE0V1 OK AT OK ATD*99# CONNECT ''" > /tmp/chatscript;
pppd /dev/ttyUSB1 defaultroute persist connect "chat -v -f /tmp/chatscript"&
