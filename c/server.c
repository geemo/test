#include <stdio.h>
#include <stdlib.h> //exit
#include <string.h>  //memset
#include <time.h>  //time,ctime
#include <arpa/inet.h> //声明了inet_ntoa,inet_aton 包含了netinet/in.h 声明了sockaddr_in, htons,ntohs  etc...
#include <sys/socket.h> //socket,bind,listen,accept,recv,send
#include <unistd.h>  //close

#define MAXSIZE 100
#define LISTENQ 10
typedef struct sockaddr SA;

int main(int argc, char *argv[]){
  int listenfd, connfd;
  struct sockaddr_in svr_addr, clnt_addr;
  socklen_t clnt_addr_len;
  char buff[MAXSIZE];
  time_t tm;
  uint16_t port = 0x1234;
  char *host = "127.0.0.1";

  //创建监听套接字
  if( (listenfd = socket(AF_INET, SOCK_STREAM, 0)) < 0 ){
    perror("socket error\n");
    exit(1);
  }

  //初始化套接字地址
  memset(&svr_addr, 0, sizeof(svr_addr));
  svr_addr.sin_family = AF_INET;
  svr_addr.sin_port = htons(port);  
  inet_aton(host, &(svr_addr.sin_addr));

  //将套接字绑定套接字地址
  if( bind(listenfd, (SA *)&svr_addr, sizeof(svr_addr)) < 0 ){
    perror("bind error\n");
    exit(1);
  }

  //监听套接字
  if( listen(listenfd, LISTENQ) < 0 ){
    perror("listen error\n");
    exit(1);
  }

  //接受连接
  while(1){
    memset(&clnt_addr, 0, sizeof(clnt_addr));
    if( (connfd = accept(listenfd, (SA *)&clnt_addr, &clnt_addr_len)) < 0 ){
      perror("accept error\n");
      exit(1);
    }
    printf("connect from %s:%d\n", inet_ntoa(clnt_addr.sin_addr), ntohs(clnt_addr.sin_port));
 
    tm = time(NULL);
    snprintf(buff, sizeof(buff), "%.24s\r\n", ctime(&tm));
    send(connfd, buff, strlen(buff), 0);

    close(connfd);
  }
  
  close(listenfd);
  return 0;
}
