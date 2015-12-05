#include <stdio.h>
#include <unistd.h> 
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <termios.h>
#include <errno.h>
#include <stdlib.h>
#include <string.h>
#include <map>

#define CONFIG_FILE "/mnt/nand/lte.conf"

int Open_Port(char* comport)
{
    char port_tmp[20];
    sprintf(port_tmp, comport, comport);    

    int fd=0;
    // O_NOCTTY If path refers to a terminal device, do not allocate the 
    // device as the controlling terminal for this process
    // can use O_NONBLOCK instead of O_NDELAY
    // fd=open(port_tmp,O_RDWR|O_NOCTTY|O_NDELAY);
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
    // This function returns OK if it was able to perform any of the 
    // requested actions, even if it couldn’tperform all the requested actions.
    // If the function returns OK, it is our responsibility to
    // see whether all the requested actions were performed. This means that 
    // after we call tcsetattr to set the desired attributes, we need to call 
    // tcgetattr and compare the actual terminal’s attributes to the desired a
    // ttributes to detect any differences.
    if((tcsetattr(fd,TCSANOW,&newtio))!=0)
    {
        perror("Com set error");
        return -1;
    }  
    // printf("serial set (%d,%d,%c,%d)... done!\n", nSpeed,nBits,nEvent,nStop);
    return 0;
}

int write_read_serial(char* msg, char* result)
{
    int fd = -1;
    char *comport = "/dev/ttyUSB2";
    int length = 0;
    if((fd = Open_Port(comport)) < 0)
    {
        printf("Open uart err \n");
        return -1;
    }

    if((Set_Opt(fd,115200,8,'N',1)) < 0)
    {
        perror("Set_Opt RS485 error");
        return -2;
    }

    tcflush(fd, TCIOFLUSH);  
    length = write(fd, msg, 128);
    while((length = read(fd, result, 512)) > 0) {
        tcflush(fd, TCIOFLUSH);  
        printf("%s\n", result);
    }

}

int read_gps(char* msg, char* result)
{
    write_read_serial("AT+GPSMODE=1\r", result);
    write_read_serial("AT+GPSSTART\r", result);

    // TODO check return result.
    
    int fd = -1;
    char *comport = "/dev/ttyUSB3";
    int length = 0;
    if((fd = Open_Port(comport)) < 0)
    {
        printf("Open uart err \n");
        return -1;
    }

    if((Set_Opt(fd,115200,8,'N',1)) < 0)
    {
        perror("Set_Opt RS485 error");
        return -2;
    }

    tcflush(fd, TCIOFLUSH);  
    memset(result, 0, 2048);
    while((length = read(fd, result, 2048)) > 0) {
        tcflush(fd, TCIOFLUSH);  
        printf("#### %s", result);
    }

}
//#include <sys/types.h>
//#include <sys/stat.h>
//#include <fcntl.h>
//#include <unistd.h>
//
//int serial(int argc, char* argv[])
//{     
//    char *comport = "/dev/ttyUSB2";
//    int speed = 115200;
//    char snd_buf[128] = "";
//    char recv_buf[512] = "";
//    int fd = -1; 
//    int length = 0;
//
//    int type = 0; // 0 read 1 write 2 readwrite 3 writeread
//    int result = 0;
//    while( (result = getopt(argc, argv, "rw:a:v:t:s:")) != -1 )
//    {
//        switch(result)
//        {
//            case 'r': // read serail port
//                type = 0; 
//                break;
//            case 'w': // write to serial port
//                type = 1;
//                memcpy(snd_buf, optarg, strlen(optarg) + 1);
//                snd_buf[strlen(optarg)] = '\r';
//                break;
//            case 'a': // read serail port and write 
//                type = 2;
//                memcpy(snd_buf, optarg, strlen(optarg) + 1);
//                snd_buf[strlen(optarg)] = '\r';
//                break;
//            case 'v': // write serial port and read
//                type = 3;
//                memcpy(snd_buf, optarg, strlen(optarg) + 1);
//                snd_buf[strlen(optarg)] = '\r';
//                break;
//            case 't': // select device /dev/ttyUSB0
//                comport = optarg;
//                break;
//            case 's': // set speed 115200 
//                speed = atoi(optarg);
//                break;
//            default:
//                printf("Usage: %s [rwavts] r read w write a readwrite v writeread t device s speed\n", argv[0]);
//                break;
//        }
//    }
//
//    if((fd = Open_Port(comport)) < 0)
//    {
//        printf("Open uart err \n");
//        return -1;
//    }
//
//    if((Set_Opt(fd,speed,8,'N',1)) < 0)
//    {
//        perror("Set_Opt RS485 error");
//        return -2;
//    }
//
//    tcflush(fd, TCIOFLUSH);  
//    switch (type){
//        case 0:
//            while((length = read(fd, recv_buf, 512)) > 0) {
//                tcflush(fd, TCIOFLUSH);  
//                printf("%s\n", recv_buf);
//            }
//            break;
//        case 1:
//            length = write(fd, snd_buf, 128);
//            break;
//        case 2:
//            while((length = read(fd, recv_buf, 512)) > 0) {
//                tcflush(fd, TCIOFLUSH);  
//                printf("%s\n", recv_buf);
//            }
//            tcflush(fd, TCIOFLUSH);  
//            length = write(fd, snd_buf, 128);
//            break;
//        case 3:
//            length = write(fd, snd_buf, 128);
//            while((length = read(fd, recv_buf, 512)) > 0) {
//                tcflush(fd, TCIOFLUSH);  
//                printf("%s\n", recv_buf);
//            }
//            break;
//        default:
//            printf("Wrong type %d\n", type);
//            break;
//    }
//    close(fd);
//    return 0;
//}

// ============================================================================
#include <string>
#include <vector>
#include <iostream>
#include <fstream>
#include <algorithm>
using namespace std;

#define DISPLAY_INTERVAL 5 // seconds

#if 0
map<char, string>DLSX;

void initializeDLSX(){
    DLSX['A'] = "00"; DLSX['B'] = "01"; DLSX['C'] = "02"; DLSX['D'] = "03";
    DLSX['E'] = "04"; DLSX['F'] = "05"; DLSX['G'] = "06"; DLSX['H'] = "07";
    DLSX['I'] = "08"; DLSX['J'] = "09"; DLSX['K'] = "0a"; DLSX['L'] = "0b";
    DLSX['M'] = "0c"; DLSX['N'] = "0d"; DLSX['O'] = "0e"; DLSX['P'] = "0f";
    DLSX['Q'] = "10"; DLSX['R'] = "11"; DLSX['S'] = "12"; DLSX['T'] = "13";
    DLSX['U'] = "14"; DLSX['V'] = "15"; DLSX['W'] = "16"; DLSX['X'] = "17";
    DLSX['Y'] = "18"; DLSX['Z'] = "19"; DLSX['&'] = "1a"; DLSX[' '] = "1b";
    DLSX['?'] = "1c"; DLSX['!'] = "1d"; DLSX['1'] = "1e"; DLSX['2'] = "1f";
    DLSX['3'] = "20"; DLSX['4'] = "21"; DLSX['5'] = "22"; DLSX['6'] = "23";
    DLSX['7'] = "24"; DLSX['8'] = "25"; DLSX['9'] = "26"; DLSX['0'] = "27";
    DLSX['"'] = "49"; DLSX['*'] = "50"; DLSX['<'] = "51"; DLSX['>'] = "52";
    //DLSX['.'] = "b1"; DLSX['-'] = "c9"; DLSX['x'] = "d4"; DLSX['%'] = "d5";
    DLSX['.'] = "63"; DLSX['-'] = "c9"; DLSX['x'] = "d4"; DLSX['%'] = "d5";
    DLSX[','] = "1b"; // dlsx don't support ',' just work as space;
    DLSX['+'] = ""; // dlsx don't support ',' just work as space;
    DLSX[':'] = ""; // dlsx don't support ',' just work as space;
}
#endif
enum DisplayType
{
    DCSQ = 0,
    DPSRAT,
    DCOPS,
    DNETRATE,
    DGPS
};

enum DisplayDirection
{
    ToVideo = 0,
    ToLogFile,
    ToWebPage,
    ToStdout,
    None
};  

#include <syslog.h>
#include "sysctrl.h"
#include "sys_msg_drv.h"
#include "file_msg_drv.h"

class Item
{
public:
    Item(DisplayType type, DisplayDirection disp):m_type(type), m_disp(disp){}
    virtual int Display()=0;

#if 0
    virtual void DisplayOnVideo(string &value, string &position)
    {
        cout << "value = " << value << endl;
        string cmd = "~/bit_dlsx 81 01 04 73 " + position;
        size_t value_size = value.size();
        int actual_count = 0;
        // only display 10 chars peer item.
        for(int i = 0, actual_count = 0; actual_count < 10; i++) {
            if(i < value_size){
                if(DLSX[value[i]] != "") {
                    cmd += " " + DLSX[value[i]];
                    actual_count++; 
                }
            } else {
                cmd += " 1b";
                actual_count++;
            }
        }
        cmd += " ff";
        system(cmd.c_str());
    }
#else
    static void InitLineBuff()
    {
        memset(line_buf, ' ', 96);
    }
    static void DisplayOnVideo()
    {
        // |----------|----------|----------|----------|----------|----------|----------|----------|----------|------|
        //  IIIII CMCC      TDSCD MA                    RX:xxx.xkb /s TX:xxx. xkb/s            N37. 09.39  E115.09.38 
        printf("====%s====\n", line_buf);
        printf("TRACE %s   %d\n", __FILE__, __LINE__);

        char text_enable = 1; 
        int ret;
        if((ret = ControlSystemData(SFIELD_SET_TEXTENABLE1, &text_enable, sizeof(text_enable))) < 0)
        {
            fprintf(stderr, "send SFIELD_SET_TEXTENABLE1 failed. ret = %d\n", ret);
            return;
        }
        printf("TRACE %s   %d\n", __FILE__, __LINE__);
        char text_position = 1; //right
        if(ControlSystemData(SFIELD_SET_TEXT_POSITION1, &text_position, sizeof(text_position)) < 0)
        {
            fprintf(stderr, "send SFIELD_SET_TEXT_POSITION1 failed.\n");
            return;
        }

        printf("TRACE %s   %d\n", __FILE__, __LINE__);
        if(ControlSystemData(SFIELD_SET_OVERLAY_TEXT1, &line_buf, strlen(line_buf)) < 0)
        {
            fprintf(stderr, "send SFIELD_SET_OVERLAY_TEXT1 failed.\n");
            return;
        }
    }
#endif
    virtual void DisplayToStdout(string &value)
    {
        cout << value << endl;
    }
    virtual void DisplayToLogFile(string &value)
    {
        syslog(LOG_INFO, value.c_str());
    }
    virtual void DisplayOnWebPage(string &value)
    {
    }
    //    private:
    DisplayDirection m_disp;
    DisplayType m_type; 
    // |----------|----------|----------|----------|----------|----------|----------|----------|----------|------|
    //  IIIII CMCC      TDSCD MA                    RX:xxx.xkb /s TX:xxx. xkb/s            N37. 09.39  E115.09.38 
    static char line_buf[97];
};

char Item::line_buf[97] = {0};

#include <sstream>
class CSQ : public Item
{
public:
    CSQ(DisplayType type, DisplayDirection disp) : Item(type, disp){}
    virtual int Display()
    { 
        char buf[512] = {0};
        write_read_serial("ATE\r", buf);
        memset(buf, 0, sizeof(buf));
        write_read_serial("AT+CSQ\r", buf);

        string tmp(buf);
        int pos = 0, start_pos = 0;
        while((pos = tmp.find("\r\n", start_pos)) != string::npos)
        {
            string sentence = tmp.substr(start_pos, pos);
            start_pos = pos + 2;
            if(sentence.find("+CSQ:") != string::npos)
            {
                string value = sentence.substr(0, sentence.find("\r\n"));
                switch(m_disp)
                {
                    case ToVideo: {
                        string dispvalue = value.substr(value.find(":") + 2, value.find(",") - value.find(":") - 2);
                        // convert string dispvalue into int disp.
                        int disp;
                        stringstream ss;
                        ss << dispvalue;
                        ss >> disp; 
                        char signal[7];
                        if (disp <= 6)       memcpy(signal, "      ", 7); //signal = "     ";
                        else if (disp <= 13) memcpy(signal, "I     ", 7); //signal = "I    ";
                        else if (disp <= 20) memcpy(signal, "II    ", 7); //signal = "II   ";
                        else if (disp <= 27) memcpy(signal, "III   ", 7); //signal = "III  ";
                        else if (disp <= 31) memcpy(signal, "IIII  ", 7); //signal = "IIII ";
                        else                 memcpy(signal, "XXXX  ", 7); //signal = "XXXX ";
                        //string position("20");
                        //DisplayOnVideo(signal, position);
                        memcpy(line_buf, &signal, strlen(signal));
                        //snprintf(line_buf, strlen(signal), "%s", signal);
                    }
                        case ToWebPage:
                                      DisplayOnWebPage(value);
                        case ToLogFile:
                                      DisplayToLogFile(value);
                        case ToStdout:
                                      DisplayToStdout(value);
                    default:
                        break;
                }
                break;
            }
        }
    }
};

class PSRAT : public Item
{
    public:
        PSRAT(DisplayType type, DisplayDirection disp) : Item(type, disp){}
        virtual int Display()
        {
            char buf[512] = {0};
            write_read_serial("ATE\r", buf);
            memset(buf, 0, sizeof(buf));
            write_read_serial("AT+PSRAT\r", buf);

            string tmp(buf);
            int pos = 0, start_pos = 0;
            while((pos = tmp.find("\r\n", start_pos)) != string::npos)
            {
                string sentence = tmp.substr(start_pos, pos);
                start_pos = pos + 2;
                if(sentence.find("+PSRAT:") != string::npos)
                {
                    string value = sentence.substr(0, sentence.find("\r\n"));
                    switch (m_disp) 
                    {
                        case ToVideo: {
                            const char* dispvalue = value.substr((value.find(":") + 2)).c_str();
                            //string position("21");
                            //DisplayOnVideo(dispvalue, position);
                            memcpy(line_buf + 15, dispvalue, strlen(dispvalue));
                            //snprintf(line_buf + 15, strlen(dispvalue), "%s", dispvalue);
                        }
                        case ToWebPage:
                                      DisplayOnWebPage(value);
                        case ToLogFile:
                                      DisplayToLogFile(value);
                        case ToStdout:
                                      DisplayToStdout(value);
                        default:
                                      break;
                    }
                    break;
                }
            }
        }
};

class COPS : public Item
{
    public:
        COPS(DisplayType type, DisplayDirection disp) : Item(type, disp){}
        virtual int Display()
        {
            char buf[512] = {0};
            write_read_serial("ATE\r", buf);
            memset(buf, 0, sizeof(buf));
            // use short string for IPS. CMCC/CU-GSM
            write_read_serial("AT+COPS=3,1\r", buf);
            write_read_serial("AT+COPS?\r", buf);

            string tmp(buf);
            int pos = 0, start_pos = 0;
            while((pos = tmp.find("\r\n", start_pos)) != string::npos)
            {
                string sentence = tmp.substr(start_pos, pos);
                start_pos = pos + 2;
                if(sentence.find("+COPS:") != string::npos)
                {
                    string value = sentence.substr(0, sentence.find("\r\n"));
                    switch (m_disp) 
                    {
                        case ToVideo: {
                            const char* dispvalue = value.substr(value.find("\"") + 1, value.rfind("\"") - value.find("\"") - 1).c_str();
                            //string position("22");
                            //DisplayOnVideo(dispvalue, position);
                            memcpy(line_buf + 6, dispvalue, strlen(dispvalue));
                            //snprintf(line_buf + 6, strlen(dispvalue), "%s", dispvalue);
                        }
                        case ToWebPage:
                                      DisplayOnWebPage(value);
                        case ToLogFile:
                                      DisplayToLogFile(value);
                        case ToStdout:
                                      DisplayToStdout(value);
                        default:
                                      break;
                    }
                    break;
                }
            }

        }
};

class NETRATE : public Item
{
    public:
        NETRATE(DisplayType type, DisplayDirection disp) : Item(type, disp){}
        virtual int Display()
        {
            static unsigned long old_recv = 0;
            static unsigned long old_tras = 0;
            unsigned long current_recv = 0; 
            unsigned long current_tras = 0;

            char tmp[64] = {0};
            FILE* rp = popen("ifconfig eth0 | grep \"RX bytes\" | cut -d : -f 2 | cut - -d \" \" -f 1", "r");
            while(fgets(tmp, sizeof(tmp), rp) != NULL)
            {
                if (tmp[strlen(tmp) - 1] == '\n') {
                    tmp[strlen(tmp) - 1] = '\0'; //去除换行符
                }
                current_recv = atol(tmp);
            }
            pclose(rp);

            // check peer DISPLAY_INTERVAL seconds.
            double recv_rate = 0;

            // incase the byte up to 4294967295 then down to 0;
            if ((old_recv != 0) && (current_recv >= old_recv)) 
                recv_rate = ((double)(current_recv - old_recv)) / DISPLAY_INTERVAL;
            old_recv = current_recv;

            FILE* tp = popen("ifconfig eth0 | grep \"RX bytes\" | cut -d : -f 3 | cut - -d \" \" -f 1", "r");
            while(fgets(tmp, sizeof(tmp), tp) != NULL)
            {
                if (tmp[strlen(tmp) - 1] == '\n') {
                    tmp[strlen(tmp) - 1] = '\0'; //去除换行符
                }
                current_tras = atol(tmp);
            }
            pclose(tp);
            double tras_rate = 0;
            // incase the byte up to 4294967295 then down to 0;
            if ((old_tras != 0) && (current_tras >= old_tras))
            {
                tras_rate = ((double)(current_tras - old_tras)) / DISPLAY_INTERVAL;
            }
            old_tras = current_tras;

            // --------------------------------------------------------
            char str[13] = {0};
            double disp_recv_rate = recv_rate;
            if ((disp_recv_rate / 1024) >= 1)
            {
                disp_recv_rate = disp_recv_rate / 1024;
                if ((disp_recv_rate / 1024) >= 1)
                {
                    disp_recv_rate = disp_recv_rate / 1024;
                    sprintf(str, "RX:%5.1fmb/s", disp_recv_rate);
                    //snprintf(line_buf + 40, 12, "RX:%4.1fmb/s", disp_recv_rate);
                }
                else
                {
                    sprintf(str, "RX:%5.1fkb/s", disp_recv_rate);
                    //snprintf(line_buf + 40, 12, "RX:%4.1fkb/s", disp_recv_rate);
                }
            }
            else
            {
                sprintf(str, "RX:%5.1f0b/s", disp_recv_rate);
                //snprintf(line_buf + 40, 12, "RX:%4.1f0b/s", disp_recv_rate);
            }

            // --------------------------------------------------------
            char str1[13] = {0};
            double disp_tras_rate = tras_rate;
            cout << "tras" << tras_rate << endl;
            if ((disp_tras_rate / 1024) >= 1)
            {
                disp_tras_rate = disp_tras_rate / 1024;
                if ((disp_tras_rate / 1024) >= 1)
                {
                    disp_tras_rate = disp_tras_rate / 1024;
                    sprintf(str1, "TX:%5.1fmb/s", disp_tras_rate);
                    //snprintf(line_buf + 53, 12, "TX:%4.1fmb/s", disp_tras_rate);
                }
                else
                {
                    sprintf(str1, "TX:%5.1fkb/s", disp_tras_rate);
                    //snprintf(line_buf + 53, 12, "TX:%4.1fkb/s", disp_tras_rate);
                }
            }
            else
            {
                sprintf(str1, "TX:%5.1f0b/s", disp_tras_rate);
                //snprintf(line_buf + 53, 12, "TX:%4.1f0b/s", disp_tras_rate);
            }

            switch (m_disp)
            {
                case ToVideo: {
                    //string position("23");
                    //DisplayOnVideo(value, position);
                    //string position1("24");
                    //DisplayOnVideo(value1, position1);
                    memcpy(line_buf + 40, str, strlen(str));
                    memcpy(line_buf + 53, str1, strlen(str1));
                    //snprintf(line_buf + 40, 25, "%s %s", str, str1);
                }
                case ToWebPage:
                              //DisplayOnWebPage(value);
                case ToLogFile:
                              //DisplayToLogFile(value);
                case ToStdout:
                              //DisplayToStdout(value);
                default:
                              break;
            }
        }
};

#include "nmea/nmea.h"
#include <math.h>
class GPS : public Item
{
    public:
        GPS(DisplayType type, DisplayDirection disp) : Item(type, disp){}
        virtual int Display()
        {
            // get gps info
            char result[2048] = "";
            read_gps(NULL, result);

            cout << "=== GPS ===" << result << endl;
            for(int i = 0; i < 2048; i++)
            {
                printf("%x ", result[i]);
            }
            printf("\n");

            nmeaINFO info;
            nmeaPARSER parser;
            nmea_zero_INFO(&info);
            nmea_parser_init(&parser);

            int pos = 0, start_pos = 0;
            string tmp(result);
            while((pos = tmp.find("\n", start_pos)) != string::npos)
            {
                nmea_parse(&parser, tmp.substr(start_pos, pos - start_pos + 1).c_str(), pos - start_pos + 1, &info);
                start_pos = pos + 1;
            }
            nmea_parser_destroy(&parser);

            char str[13] = {0};
            char str1[13] = {0};
            if(info.lat > 0)
            {
                sprintf(str, "N%11.6f", fabs(info.lat));
            }
            else
            {
                sprintf(str, "S%11.6f", fabs(info.lat));
            }

            if(info.lon > 0)
            {
                sprintf(str1, "E%12.6f", fabs(info.lon));
            }
            else
            {
                sprintf(str1, "W%12.6f", fabs(info.lon));
            }

            string value(str);
            string value1(str1);

            switch (m_disp)
            {
                case ToVideo: {
                    char str2[27] = {0};
                    //string position("25");
                    //DisplayOnVideo(value, position);
                    //string position1("26");
                    //DisplayOnVideo(value1, position1);
                    snprintf(str2, 27, "%s %s", str, str1);
                    memcpy(line_buf + 70, str2, 27);
                }
                case ToWebPage:
                    DisplayOnWebPage(value);
                case ToLogFile:
                    DisplayToLogFile(value);
                case ToStdout:
                    DisplayToStdout(value);
                default:
                              break;
            }
        }
};

class DisplayFactory
{
    public:
        static Item* createDisplay(DisplayType type, DisplayDirection direction)
        {
            Item* p = NULL;
            switch(type){
                case DCSQ:
                    p = new CSQ(type, direction);
                    break;
                case DPSRAT:
                    p = new PSRAT(type, direction);
                    break;
                case DCOPS:
                    p = new COPS(type, direction);
                    break;
                case DNETRATE:
                    p = new NETRATE(type, direction);
                    break;
                case DGPS:
                    p = new GPS(type, direction);
                    break;
                default:
                    break;
            }
            return p;
        }
};
// ============================================================================
#include <map>
bool parse_config(const string & filename, map<string, string> & m);

// ----------------------------------------------------------------------------
#define COMMENT_CHAR '#'

bool IsSpace(char c)
{
    if (' ' == c || '\t' == c)
        return true;
    return false;
}

bool IsCommentChar(char c)
{
    switch(c) {
        case COMMENT_CHAR:
            return true;
        default:
            return false;
    }
}

void Trim(string & str)
{
    if (str.empty()) {
        return;
    }
    int i, start_pos, end_pos;
    for (i = 0; i < str.size(); ++i) {
        if (!IsSpace(str[i])) {
            break;
        }
    }
    if (i == str.size()) { // 全部是空白字符串
        str = "";
        return;
    }

    start_pos = i;

    for (i = str.size() - 1; i >= 0; --i) {
        if (!IsSpace(str[i])) {
            break;
        }
    }
    end_pos = i;

    str = str.substr(start_pos, end_pos - start_pos + 1);
}

bool AnalyseLine(const string & line, string & key, string & value)
{
    if (line.empty())
        return false;
    int start_pos = 0, end_pos = line.size() - 1, pos;
    if ((pos = line.find(COMMENT_CHAR)) != -1) {
        if (0 == pos) {  // 行的第一个字符就是注释字符
            return false;
        }
        end_pos = pos - 1;
    }
    // 预处理，删除注释部分
    string new_line = line.substr(start_pos, start_pos + 1 - end_pos);  
    if ((pos = new_line.find('=')) == -1)
        return false;  // 没有=号

    key = new_line.substr(0, pos);
    value = new_line.substr(pos + 1, end_pos + 1- (pos + 1));

    Trim(key);
    if (key.empty()) {
        return false;
    }
    Trim(value);
    return true;
}

bool parse_config(const string & filename, map<string, string> & m)
{
    m.clear();
    ifstream infile(filename.c_str());
    if (!infile) {
        cout << filename << " open error" << endl;
        return false;
    }
    string line, key, value;
    while (getline(infile, line)) {
        if (AnalyseLine(line, key, value)) {
            m[key] = value;
        }
    }
    return true;
}

bool write_config(const string & filename, map<string, string> & m)
{
    ofstream outfile(filename.c_str());
    if (!outfile) {
        cout << filename << " write error." << endl;
        return false;
    }

    outfile << "# This file is about wireless and vpn configuration which is\n"
            << "# created automatically by process display.\n"
            << "# you can modify it manually, but it will not take effect until 
            << "# you restart the process display."
            << "# another method to change the configuration is from web\n"
            << "# which will take effect immediately." << endl;
    map<string, string>::iterator it;
    for(it = m.begin(); it != m.end(); ++it)
    {
        outfile << it->first << "=" << it->second << endl;
    }
    return true;
}
// =============================================================================
int display_info(void)
{
    map<string, string> cfg; // key value for log config

    map<string, DisplayType> map_type; // map the string to enum display type
    map_type["CSQ"] = DCSQ;
    map_type["PSRAT"] = DPSRAT;
    map_type["COPS"] = DCOPS;
    map_type["NETRATE"] = DNETRATE;
    map_type["GPS"] = DGPS;

    map<string, DisplayDirection> map_direction; // string to enum direction
    map_direction["ToLogFile"] = ToLogFile;
    map_direction["ToStdout"] = ToStdout;
    map_direction["ToVideo"] = ToVideo;
    map_direction["ToWebPage"] = ToWebPage;

#if 0
    initializeDLSX();
#endif

    InitFileMsgDrv(FILE_MSG_KEY, FILE_SDK_MSG);
    SysDrvInit(SYS_SDK_MSG);
    Item::InitLineBuff();
    while(true) 
    {
        // TODO now check the config file then start instance peer config, 
        // delete the instances everytime. 
        // enhance should be do to check the config file compare to the old 
        // one to determine which instance should add or delete.
        parse_config("/mnt/nand/lte.conf", cfg);
        vector<Item*> display_list; 

        bool display_on_video = false;
        map<string, string>::iterator itc = cfg.begin();
        for(; itc != cfg.end(); ++itc)
        {
            if(itc->second == "ToVideo")
                display_on_video = true;
            Item* p = DisplayFactory::createDisplay(map_type[itc->first], 
                    map_direction[itc->second]);
            display_list.push_back(p);
        }

        vector<Item*>::iterator it;
        for(it = display_list.begin(); it != display_list.end(); ++it)
        {
            (*it)->Display();
        }

        if(display_on_video)
            Item::DisplayOnVideo();
        sleep(DISPLAY_INTERVAL);

        for(it = display_list.begin(); it != display_list.end(); ++it)
        {
            delete (*it);
        }
    }
    return 0;
}

// =============================================================================

#include <pthread.h>

void* start_wireless_thread(void *)
{
    // start wireless network.
    //system("pppd call td_lte");

    display_info();
    return NULL;
}

pthread_t start_wireless(void)
{
    pthread_t p_wireless;
    int ret = pthread_create(&p_wireless, NULL, start_wireless_thread, NULL);
    if(ret != 0)
    {
        fprintf(stderr, "create wireless_thread failed. errno = %d", errno);
        exit(-1);
    }
    return p_wireless;
}

#define CMD_START_WIRELESS   (1)
#define CMD_START_VPN        (2)
#define CMD_STOP_WIRELESS    (3)
#define CMD_STOP_VPN         (4)
#define CMD_CHANGE_LOG_LEVEL (5)


#define MAX_TEXT 256
struct msg_st {  
    long mtype;  
    long cmd;
    char data[MAX_TEXT];  
};  

#include <sys/msg.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <errno.h>
#include <signal.h>

#define TRUE 1
#define FALSE 0
#define INVALID -1

void bool_value(string & value)
{
    if(value == "")
        return INVALID;

    vector<string> true_value = {"True", "true", "Yes", "yes", "TRUE", "YES", "1", "y"};
    vector<string> false_value = {"False", "false", "No", "no", "FALSE", "NO", "0", "n"};
    
    if(find(true_value.begin(), true_value.end(), value) != true_value.end())
        return TRUE;
    else if(find(false_value.begin(), false_value.end(), value) != false_value.end())
        return FALSE;
    else
        return INVALID;
}
void sig_exit_handler(int sig_num)
{
    cout << "Sip Abort SIG Received!!!" << endl;
    CleanupFileMsgDrv();
    SysDrvExit();
    exit(0);
}

int init(map<string, string> &cfg)
{
    // signal init
    signal(SIGPIPE, SIG_IGN);
    signal(SIGINT, sig_exit_handler);

    // read config file /mnt/nand/lte.conf
    parse_config("/mnt/nand/lte.conf", cfg);
}

int main(int argc, char* argv[])
{
    // key value for log config
    map<string, string> cfg; 
    pthread_t p_wireless = 0;

    // init 
    init(cfg);

    // start new thread to start wireless and display info.
    if(cfg.find("use_wireless") != cfg.end())
    {
        if(bool_value(cfg["use_wireless"]) == TRUE)
            p_wireless = start_wireless();
    }
    
    int msg_id;
    long msg_len = 0;
    struct msg_st msg_recv;

    msg_id = msgget((key_t)0x004C5445, 0666 | IPC_CREAT);
    if (msg_id == -1)
    {  
        fprintf(stderr, "msgget failed with error: %d\n", errno);  
        exit(-1);  
    }

    while(true)
    {
        if (msgrcv(msg_id, (void *)&msg_recv, sizeof(msg_recv) - sizeof(long),  
                   msg_len, 0) == -1)
        { 
            fprintf(stderr, "msgrcv failed with error: %d\n", errno);  
            exit(-1);  
        }  

        switch(msg_recv.cmd)
        {
            case CMD_START_WIRELESS:

                // write config file if use_wireless=false or none previous.
                if(bool_value(cfg["use_wireless"]) != TRUE)
                {
                    cfg["use_wireless"] = "True";
                    write_config(CONFIG_FILE, cfg);
                }

                if(p_wireless == 0)
                    p_wireless = start_wireless();
                break;
            case CMD_STOP_WIRELESS:
                system("killall pppd");
                pthread_cancel(p_wireless);
                p_wireless = 0;
                break;
            case CMD_START_VPN:
                break;
            case CMD_STOP_VPN:
                break;
            case CMD_CHANGE_LOG_LEVEL:
                break;
            default:
                break;
        }
        fprintf(stdout, "%s\n", msg_recv.data);
    }  

    // Remove the message queue from the system and any data still on the queue.
    if (msgctl(msg_id, IPC_RMID, 0) == -1)
    {  
        fprintf(stderr, "msgctl(IPC_RMID) failed\n");  
        exit(-1);  
    }  
#if 0
    while(1)
    {
        sleep(100);
    }
#endif
    return 0;
}


// CONFIG FILE
// # LTE Log type
// CSQ=ToVideo
// PSRAT=ToVideo
// COPS=ToVideo
// NETRATE=ToVideo
// GPS=ToVideo
// 
// # VPN
// use_wireless=yes 
// use_vpn=yes
// vpn_server_ip=192.168.1.164
// vpn_subnet_ip=192.168.8.171
// vpn_subnet_mask=255.255.255.0
// vpn_username=durd
// vpn_password=durd
// vpn_protocal=pptp
// vpn_require_mppe=true
// vpn_add_default_route=true

