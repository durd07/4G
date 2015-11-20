echo "TIMEOUT 5 '' AT OK ATE0V1 OK AT OK ATS0=0 OK AT OK ATE0V1 OK AT OK ATDT*99*# CONNECT ''" > /tmp/chatscript;
pppd /dev/ttyUSB1 persist connect "chat -v -f /tmp/chatscript"&