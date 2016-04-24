#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <arpa/inet.h>
#include <sys/socket.h>

#define MAXSIZE 100
typedef struct sockaddr_in SA;

int main(int argc, char *argv[]){
  uint16_t port = 0x1234;
  const char *host = "127.0.0.1";
  int sock;

  if( (sock = socket(AF_INET, SOCK_STREAM, 0)) < 0 ){
    perror("socket error\n");
    exit(1);
  }

  SA addr;
  memset(&addr, 0, sizeof(addr));
  addr.sin_family = AF_INET;
  addr.sin_port = htons(port);
  inet_aton(host, &(addr.sin_addr));
  
  if( connect(sock, (struct sockaddr *)&addr, sizeof(addr)) < 0 ){
    perror("connect error\n");
    exit(1);
  }

  char buff[MAXSIZE + 1];
  int len;
  while( (len = recv(sock, buff, MAXSIZE, 0)) > 0 ){
    buff[len] = 0;
    fputs(buff, stdout);
  }

  return 0;
}
