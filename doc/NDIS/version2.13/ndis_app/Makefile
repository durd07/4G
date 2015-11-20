BINFILE = ndis_connect
NDIS_LIB_DIR = $(PWD)/lib_ndis
CFLAGS += -Wall -I$(NDIS_LIB_DIR)
#CC = $(CROSS_COMPILE)gcc
LD_LIBRARY_PATH += $(NDIS_LIB_DIR)
LDFLAGS += -L$(LC_LIB_DIR) -lndis_dail
SRCS += ndis_connect.c 

OBJS = $(SRCS:%.c=%.o)
all: $(BINFILE)

prep:

$(BINFILE):$(OBJS)
	$(CC) $(CFLAGS) -o $@  $^ $(LDFLAGS)
	rm -f *.o

clean:
	rm -f *.o $(BINFILE)

install:
	cp -f $(BINFILE) $(INSTALL_ROOT)/usr/sbin/
	cp -f profile.ini $(INSTALL_ROOT)/usr/sbin/
