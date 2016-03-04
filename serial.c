#include <stdio.h>
#include <unistd.h> 
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <termios.h>
#include <errno.h>
#include <stdlib.h>
#include <string.h>

int Open_Port(char* comport)
{
    char port_tmp[20];
    sprintf(port_tmp, comport, comport);	

    int fd=0;
    // O_NOCTTY If path refers to a terminal device, do not allocate the device as the
    // controlling terminal for this process
    // can use O_NONBLOCK instead of O_NDELAY
    //fd=open(port_tmp,O_RDWR|O_NOCTTY|O_NDELAY);
    fd=open(port_tmp,O_RDWR);
    if(fd==-1){
        perror("Can not open serial port");
        return -1;
    }else{
        //printf("  -open %s ... done!\n", port_tmp);
    }

    // restore the serial port to block.
    if(fcntl(fd,F_SETFL,0)<0)
    {
        printf("fcntl failed!\n");
    }
    else
    {
        //printf("  -fcntl ... done!\n");
    }		
    if(isatty(STDIN_FILENO)==0)
    {
        printf("standard input is not a termined device\n");
    }
    else
    {
        //printf("  -istty ... done!\n");
    }		
    return fd;			
}


int Set_Opt(int fd, int nSpeed, int nBits, char nEvent, int nStop)
{
    struct termios newtio, oldtio;	
    if(tcgetattr(fd,&oldtio)!=0)
    {
        perror("Setup serial");
        return -1;
    }
    memset(&newtio, 0, sizeof(newtio));
    newtio.c_cflag|=CLOCAL|CREAD;
    newtio.c_cflag&=~CSIZE;	
    switch(nSpeed)
    {
        case 300:
            cfsetispeed(&newtio,B300);
            cfsetospeed(&newtio,B300);
            break;		
        case 600:
            cfsetispeed(&newtio,B600);
            cfsetospeed(&newtio,B600);
            break;			
        case 1200:
            cfsetispeed(&newtio,B1200);
            cfsetospeed(&newtio,B1200);
            break;			
        case 2400:
            cfsetispeed(&newtio,B2400);
            cfsetospeed(&newtio,B2400);
            break;		
        case 4800:
            cfsetispeed(&newtio,B4800);
            cfsetospeed(&newtio,B4800);
            break;			
        case 9600:
            cfsetispeed(&newtio,B9600);
            cfsetospeed(&newtio,B9600);
            break;			
        case 19200:
            cfsetispeed(&newtio,B19200);
            cfsetospeed(&newtio,B19200);
            break;			
        case 38400:
            cfsetispeed(&newtio,B38400);
            cfsetospeed(&newtio,B38400);
            break;			
        case 57600:
            cfsetispeed(&newtio,B57600);
            cfsetospeed(&newtio,B57600);
            break;		
        case 115200:
            cfsetispeed(&newtio,B115200);
            cfsetospeed(&newtio,B115200);
            break;		
        default:
            cfsetispeed(&newtio,B9600);
            cfsetospeed(&newtio,B9600);
            break;	
    }	
    switch(nBits)
    {
        case 7:
            newtio.c_cflag|=CS7;
            break;
        case 8:
            newtio.c_cflag|=CS8;
            break;			
        default:
            newtio.c_cflag|=CS8;
            break;			
    }  	
    switch(nEvent)
    {
        case 'O':
        case 'o':
            newtio.c_cflag|=PARENB;
            newtio.c_cflag|=PARODD;
            newtio.c_iflag|=(INPCK|ISTRIP);
            break;		
        case 'E':
        case 'e':
            newtio.c_iflag|=(INPCK|ISTRIP);
            newtio.c_cflag|=PARENB;
            newtio.c_cflag&=~PARODD;
            break;			
        case 'N':
        case 'n':
            newtio.c_cflag&=~PARENB;
            break;		
        default:
            newtio.c_cflag&=~PARENB;
            break;
    }  
    switch(nStop)
    {
        case 1:
            newtio.c_cflag&=~CSTOPB;
            break;			
        case 2:
            newtio.c_cflag|=CSTOPB;
            break;		
        default:
            newtio.c_cflag&=~CSTOPB;
            break; 			
    } 	
    newtio.c_cc[VTIME]=2;
    newtio.c_cc[VMIN]=0; // 0 non-block ; > 0 block
    tcflush(fd, TCIFLUSH);  
    // This function returns OK if it was able to perform any of the requested actions, even if it couldn’t
    // perform all the requested actions. If the function returns OK, it is our responsibility to
    // see whether all the requested actions were performed. This means that after we call
    // tcsetattr to set the desired attributes, we need to call tcgetattr and compare the
    // actual terminal’s attributes to the desired attributes to detect any differences.
    if((tcsetattr(fd,TCSANOW,&newtio))!=0)
    {
        perror("Com set error");
        return -1;
    }  
    //	printf("  -serial set (%d,%d,%c,%d)... done!\n", nSpeed,nBits,nEvent,nStop);
    return 0;
}


#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>

int main(int argc, char* argv[])
{		
    char *comport = "/dev/ttyUSB2";
    int speed = 115200;
    char snd_buf[128] = "";
    char recv_buf[512] = "";
    int fd = -1; 
    int length = 0;

    int type = 0; // 0 read 1 write 2 readwrite 3 writeread
    int result = 0;
    while( (result = getopt(argc, argv, "rw:a:v:t:s:")) != -1 )
    {
        switch(result)
        {
            case 'r': // read serail port
                type = 0; 
                break;
            case 'w': // write to serial port
                type = 1;
                memcpy(snd_buf, optarg, strlen(optarg) + 1);
                snd_buf[strlen(optarg)] = '\r';
                break;
            case 'a': // read serail port and write 
                type = 2;
                memcpy(snd_buf, optarg, strlen(optarg) + 1);
                snd_buf[strlen(optarg)] = '\r';
                break;
            case 'v': // write serial port and read
                type = 3;
                memcpy(snd_buf, optarg, strlen(optarg) + 1);
                snd_buf[strlen(optarg)] = '\r';
                break;
            case 't': // select device /dev/ttyUSB0
                comport = optarg;
                break;
            case 's': // set speed 115200 
                speed = atoi(optarg);
                break;
            default:
                printf("Usage: %s [rwavts] r read w write a readwrite v writeread t device s speed\n", argv[0]);
                break;
        }
    }

    if((fd = Open_Port(comport)) < 0)
    {
        printf("Open uart err \n");
        return -1;
    }

    if((Set_Opt(fd,speed,8,'N',1)) < 0)
    {
        perror("Set_Opt RS485 error");
        return -2;
    }

    tcflush(fd, TCIOFLUSH);  
    switch (type){
        case 0:
            while((length = read(fd, recv_buf, 512)) > 0) {
                tcflush(fd, TCIOFLUSH);  
                printf("%s\n", recv_buf);
            }
            break;
        case 1:
            printf("%s\n", snd_buf);
            length = write(fd, snd_buf, 128);
            break;
        case 2:
            printf("%s\n", snd_buf);
            while((length = read(fd, recv_buf, 512)) > 0) {
                tcflush(fd, TCIOFLUSH);  
                printf("%s\n", recv_buf);
            }
            tcflush(fd, TCIOFLUSH);  
            length = write(fd, snd_buf, 128);
            break;
        case 3:
            printf("%s\n", snd_buf);
            length = write(fd, snd_buf, 128);
            while((length = read(fd, recv_buf, 512)) > 0) {
                tcflush(fd, TCIOFLUSH);  
                printf("%s\n", recv_buf);
            }
            break;
        default:
            break;
    }
    close(fd);
    return 0;
}
