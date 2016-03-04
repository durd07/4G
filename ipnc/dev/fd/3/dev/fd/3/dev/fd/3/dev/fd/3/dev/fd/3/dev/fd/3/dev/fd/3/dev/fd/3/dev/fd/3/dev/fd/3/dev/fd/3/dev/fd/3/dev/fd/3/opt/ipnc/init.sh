if test -f /opt/ipnc/ubifs_sync.sh; then
	sync
	mv -f /opt/ipnc/ubifs_sync /opt/ipnc/ubifs_sync_done
	echo "####### SYNC DONE ########"
fi
sleep 1
amixer cset name='PCM Playback Volume' 100%,100%
sleep 1

chmod +x *.sh
chmod +x ./bin/*.out
chmod +x ./scripts/*.sh

rmmod ./kermod/syslink.ko 2> /dev/null
rmmod ./kermod/osa_kermod.ko 2> /dev/null
rmmod ./kermod/TI81xx_hdmi.ko 2> /dev/null
rmmod ./kermod/cmemk.ko	2> /dev/null

killall ./bin/fw_load.out 2> /dev/null
killall ./bin/remote_debug_client.out 2> /dev/null

sleep 1

./bin/remote_debug_client.out 0xbff00000 &

insmod ./kermod/syslink.ko TRACE=1 TRACEFAILURE=1 2> /dev/null
sleep 1

./linux_prcm_ipcam r

#
# Format of the system priority setting utility for setting bandwidth regulator
#
# ./bin/sys_pri.out --L3-bw-reg-set <L3-bw-reg-initiator-name> <L3-pressure-High> <L3-pressure-Low> <L3-Bandwidth> <L3-Watermark-cycles>
#
# "L3-bw-reg-initiator-name" can be HDVICP0 or HDVICP1 or HDVICP2 or other initiators
# "L3-pressure-High" can be 0 (low), 1 (medium), 3 (high)
# "L3-pressure-Low"  can be 0 (low), 1 (medium), 3 (high)
# "L3-Bandwidth" is in MB/s
# "L3-Watermark-cycles" is in bytes
#
# See also ./bin/sys_pri.out --help for more details
#
# IVA-HD BW requlator programing.
# TODO. THIS IS CURRENTLY HARDCODED. 
# THIS SHOULD CALCULATED FROM EXPECTED IVA BANDWIDTH USAGE
#
# IVA-HD0, IVA-HD1, IVA-HD2
#
./bin/sys_pri.out --L3-bw-reg-set HDVICP0 0 0 900 2500&
./bin/sys_pri.out --L3-bw-reg-set ISS 3 3 400 2500&
./bin/sys_pri.out --dmm-pri-set ISS 0&
./bin/sys_pri.out --dmm-pri-set HDVICP0 1&
