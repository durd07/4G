copy all the files to drivers/net/usb
add to Makefile

lc_ether-objs +=  qmi_oper.o \
		lc_cdc_ether.o 
                  
                  
obj-m +=  lc_ether.o