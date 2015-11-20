modify the usb-serial.c at divers/usb/serial/

modify the usb-serial.c specified file line code as supplied usb-serial.c

int usb_serial_probe(...
...
//added by qiao to avoid mismatch
	if ( interface->cur_altsetting->desc.bInterfaceNumber>=4)
		return -EDOM;


you can use option as usb serial dirver(add vid-1c9e and pid-9605 )

