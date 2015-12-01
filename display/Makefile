TARGET=display
LIB=lib/libnmea.a
CC = arm-arago-linux-gnueabi-gcc
C++ = arm-arago-linux-gnueabi-g++

CFLAGS += -g -I./include
LD_FLAGS +=

$(TARGET): src/display.cpp $(LIB)
	#mkdir bin
	$(C++) $(CFLAGS) $(LD_FLAGS) -o bin/$@ $^

$(LIB):
	$(MAKE) ./nmealib
