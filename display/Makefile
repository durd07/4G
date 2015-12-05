TARGET=display
LIB=lib/libnmea.a
CC = arm-arago-linux-gnueabi-gcc
C++ = arm-arago-linux-gnueabi-g++

#CC = gcc
#C++ = g++

CFLAGS += -g -I./include
LD_FLAGS += -I/home/durd/work/ipnc_rdk/ipnc_app/interface/inc -lpthread

APP_LIB_DIR = /home/durd/work/ipnc_rdk/ipnc_app/interface/lib
CMEM_LIB_DIR = /home/durd/work/ti_tools/linuxutils_3_23_00_01/packages/ti/sdo/linuxutils/cmem/lib

LIBS          =  $(APP_LIB_DIR)/Appro_interface.a  \
                 $(APP_LIB_DIR)/share_mem.a        \
                 $(APP_LIB_DIR)/msg_util.a         \
                 $(APP_LIB_DIR)/sysctrl.a          \
                 $(APP_LIB_DIR)/msg_util.a         \
                 $(APP_LIB_DIR)/file_msg_drv.a     \
                 $(APP_LIB_DIR)/sem_util.a         \
                 $(APP_LIB_DIR)/sys_msg_drv.a

$(TARGET): src/display.cpp $(LIB)
	#mkdir bin
	$(C++) $(CFLAGS) $(LD_FLAGS) -o bin/$@ $^ -std=c++0x $(LIBS)

$(LIB):
	$(MAKE) ./nmealib

clean:
	rm -rf ./bin/*
