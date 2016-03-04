insmod pinmux_module.ko a=0x48140C34  v=0x02
rmmod pinmux_module.ko
echo 7 > /sys/class/gpio/export
echo out > /sys/class/gpio/gpio7/direction
echo 1 > /sys/class/gpio/gpio7/value
