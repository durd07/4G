#BINFILE = $(LC_LIB_DIR)
#CC = $(CROSS_COMPILE)gcc
BINFILE = $(LC_LIB_DIR)/libndis_dail.so
#CFLAGS += -Wall -I$(KERNDIR)include -I$(LC_GENERL_INCLUDE_DIR)
CFLAGS += -Wall
#LDFLAGS += -lpthread
SRCS += ndis_qmi_service.c
OBJS = $(SRCS:%.c=%.o)
#all: prep $(BINFILE)
all:$(BINFILE)

prep:
	ln -sf $(PWD)/ndis_qmi_service.h $(LC_GENERL_INCLUDE_DIR)/ndis_qmi_service.h

$(BINFILE):$(OBJS)
	$(CC) $(CFLAGS) --shared $^ -o $@ $(LDFLAGS)
	$(STRIP) $(BINFILE)

clean:
	rm -f *.o $(BINFILE) $(LC_GENERL_INCLUDE_DIR)/ndis_qmi_service.h

install:
	cp -f $(BINFILE) $(INSTALL_ROOT)/lib/

