#include <stdio.h>
#include <stdlib.h>   //exit
#include <string.h>   //memset
#include <arpa/inet.h>  //定义了inet_aton,inet_ntoa,包含了netinet/in.h, 里面定义了sockaddr_in, 以及htons,ntohs等函数
#include <sys/socket.h> //socket, bind

int main(int argc, char* argv[]){
  /* int bind(int __fd, __CONST_SOCKADR_ARG __addr, socklen_t __len)
   * @param __fd socket文件描述符, 由socket()函数创建返回
   * @param __addr 类型const struct sockaddr *, 通用socket地址
   * @param __len  类型__U32_TYPE, socket地址长度
   * @return 执行成功返回0, 失败返回-1
   */

  uint16_t port = 0x1234;
  const char* host = "127.0.0.1";
  int sock;

  sock = socket(PF_INET, SOCK_STREAM, 0); //创建套接字, 指定套接字的协议类型和服务类型
  if(sock == -1){
    perror("socket create failed!\n");
    exit(1);
  }
  printf("socket is %d\n", sock);

  struct sockaddr_in sa;  //套接字地址
  memset(&sa, 0, sizeof(sa));
  sa.sin_family = PF_INET;
  sa.sin_port = htons(port);
  inet_aton(host, &(sa.sin_addr)); //将电分十进制地址转化为32为网络地址

  if(bind(sock, (struct sockaddr *)&sa, sizeof(sa)) == -1){
    perror("bind failed!\n");
    exit(1);
  }
  printf("bind success!\n");

  return 0;
}
