#include <stdlib.h>  
#include <stdio.h>  
#include <string.h>  
#include <errno.h>  
#include <unistd.h>  
  
#include <sys/msg.h>  
  
#define MAX_TEXT 256
struct msg_st {  
    long mtype;  
    long cmd;
    char data[MAX_TEXT];  
};  

int main()  
{  
    int running = 1;  
    struct msg_st some_data;  
    int msgid;  
    char buffer[MAX_TEXT];  
  
    msgid = msgget((key_t)0x004C5445, 0666 | IPC_CREAT);  
  
    if (msgid == -1) {  
        fprintf(stderr, "msgget failed with error: %d\n", errno);  
        exit(EXIT_FAILURE);  
    }  
  
    while(running) {  
        //some_data.mtype = 1;  
        if (msgrcv(msgid, (void *)&some_data, sizeof(some_data) - sizeof(long),1, 0) == -1) {  
            fprintf(stderr, "msgsnd failed\n");  
            exit(EXIT_FAILURE);  
        }
        printf("%s", some_data.data);
    }  
  
    exit(EXIT_SUCCESS);  
} 
