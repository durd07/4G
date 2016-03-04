cd /opt/ipnc

insmod sbull.ko
umount /mnt/ramdisk 2>/dev/null
rmmod sbull.ko 2>/dev/null
insmod sbull.ko
sleep 1
mkdosfs -v /dev/sbulla 2>/dev/null
mkdir /mnt/ramdisk 2>/dev/null
mount -t vfat /dev/sbulla /mnt/ramdisk 2>/dev/null
insmod g_file_storage.ko file=/dev/sbulla stall=0 removable=1

amixer sset 'PGA' 80
sleep 1

cd /opt/ipnc
sleep 1
./bin/ipnc_rdk_mcfw.out  TRISTREAM TI2A AEWB &

