TARGET=display
LIB=lib/libnmea.a
CC = gcc
C++ = g++

CFLAGS += -g -I./include
LD_FLAGS +=

$(TARGET): src/display.cpp $(LIB)
	mkdir bin
	$(C++) $(CFLAGS) $(LD_FLAGS) -o bin/$@ $^

$(LIB):
	$(MAKE) ./nmealib
