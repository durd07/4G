#/bin/sh
cd /opt/ipnc



echo 'read gpio,to judge board version'

echo 18 > /sys/class/gpio/export 
echo 19 > /sys/class/gpio/export 
echo 20 > /sys/class/gpio/export 
echo 21 > /sys/class/gpio/export 
echo 22 > /sys/class/gpio/export 
echo 23 > /sys/class/gpio/export 


gpiofile="/sys/class/gpio/gpio18/value"
if [ -f $gpiofile ]; then
	gpio18=`cat $gpiofile`
else
	echo "File $gpiofile not existed."
fi

gpiofile="/sys/class/gpio/gpio19/value"
if [ -f $gpiofile ]; then
        gpio19=`cat $gpiofile`
else
        echo "File $gpiofile not existed."
fi

gpiofile="/sys/class/gpio/gpio20/value"   
if [ -f $gpiofile ]; then                 
        gpio20=`cat $gpiofile`            
else                                      
        echo "File $gpiofile not existed."
fi  

gpiofile="/sys/class/gpio/gpio21/value"   
if [ -f $gpiofile ]; then                 
        gpio21=`cat $gpiofile`            
else                                      
        echo "File $gpiofile not existed."
fi       

gpiofile="/sys/class/gpio/gpio22/value"   
if [ -f $gpiofile ]; then                 
        gpio22=`cat $gpiofile`            
else                                      
        echo "File $gpiofile not existed."
fi       
gpiofile="/sys/class/gpio/gpio23/value"   

if [ -f $gpiofile ]; then                 
        gpio23=`cat $gpiofile`            
else                                      
        echo "File $gpiofile not existed."
fi       

echo "gpio18 is $gpio18"
echo "gpio19 is $gpio19"
echo "gpio20 is $gpio20"
echo "gpio21 is $gpio21"  
echo "gpio22 is $gpio22"  
echo "gpio23 is $gpio23"  

#new board
#if [ "$gpio18" = "1" -a "$gpio19" = "1" -a "$gpio20" = "1"  -a "$gpio21" = "1"  -a "$gpio22" = "1"  -a "$gpio23" = "1"  ] ; then
#if [ "$gpio20" = "1"  -a "$gpio21" = "1"  -a "$gpio22" = "1"  -a "$gpio23" = "1"  ] ; then
if [ "$gpio20" = "1"  -a "$gpio21" = "1"  -a "$gpio22" = "1"  ] ; then
	echo "six gpio are 1,new board"

	cd /opt/ipnc/
	insmod pinmux_module.ko a=0x48140ac8 v=0x80
	rmmod pinmux_module.ko
	echo 85 > /sys/class/gpio/export
	echo out > /sys/class/gpio/gpio85/direction
	echo 0 > /sys/class/gpio/gpio85/value
	

	#gp0[9] 9
	insmod pinmux_module.ko a=0x4814083c v=0x80
	rmmod pinmux_module.ko
	
	#gp3[3] 99 change uart3 to gpio
	insmod pinmux_module.ko a=0x48140b48 v=0x80
	rmmod pinmux_module.ko
	
	#gp3[4] 100 change uart3 to gpio
	insmod pinmux_module.ko a=0x48140b4c v=0x80
	rmmod pinmux_module.ko
	
	
	#gp1[0] 32
	insmod pinmux_module.ko a=0x4814090c  v=0x80
	rmmod pinmux_module.ko
	echo 32 > /sys/class/gpio/export
	echo out > /sys/class/gpio/gpio32/direction
	echo 0 > /sys/class/gpio/gpio32/value
	echo 1 > /sys/class/gpio/gpio32/value

	echo 9 > /sys/class/gpio/export
	echo out > /sys/class/gpio/gpio9/direction
	echo 0 > /sys/class/gpio/gpio9/value


	echo 100 > /sys/class/gpio/export
	echo out > /sys/class/gpio/gpio100/direction
	echo 0 > /sys/class/gpio/gpio100/value
  
        
fi

#old board
#if [ "$gpio18" = "0" -a "$gpio19" = "0" -a "$gpio20" = "0"  -a "$gpio21" = "0"  -a "$gpio22" = "0"  -a "$gpio23" = "0"  ] ; then           
#if [ "$gpio20" = "0"  -a "$gpio21" = "0"  -a "$gpio22" = "0"  -a "$gpio23" = "0"  ] ; then           
if [ "$gpio20" = "0"  -a "$gpio21" = "0"  -a "$gpio22" = "0"  ] ; then           
	echo "six gpio are 0,old board"                   
       
 	echo 85 > /sys/class/gpio/export 
 	
  echo 28 > /sys/class/gpio/export           
	echo out > /sys/class/gpio/gpio28/direction
	echo 1 > /sys/class/gpio/gpio28/value
	
	echo 72 > /sys/class/gpio/export                                                
	echo out > /sys/class/gpio/gpio72/direction                                     
	echo 0 > /sys/class/gpio/gpio72/value

               
fi 





echo 103 > /sys/class/gpio/export
echo 104 > /sys/class/gpio/export
echo 105 > /sys/class/gpio/export
echo 106 > /sys/class/gpio/export
echo 107 > /sys/class/gpio/export
echo out > /sys/class/gpio/gpio104/direction

echo 92 > /sys/class/gpio/export 
echo out > /sys/class/gpio/gpio92/direction



# alarm in
echo 15 > /sys/class/gpio/export

#park light gpio

echo 73 > /sys/class/gpio/export
echo out > /sys/class/gpio/gpio73/direction
echo 0 > /sys/class/gpio/gpio73/value

echo 99 > /sys/class/gpio/export
echo out > /sys/class/gpio/gpio99/direction
echo 0 > /sys/class/gpio/gpio99/value





