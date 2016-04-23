#include <stdio.h>
#include <stdlib.h>  //exit
#include <string.h>  //memset
#include <arpa/inet.h>  //定义了inet_aton,inet_ntoa, 包含了netinet/in.h,内部定义了sockaddr_in以及htons,ntohs函数
#include <sys/socket.h>  //listen

int main(int argc, char* argv[]){
  /* int listen(int __fd, int __n)
   * @param __fd socket文件描述符
   * @param __n  内核监听队列的最大长度
   * @return 执行成功返回0, 失败返回-1
   */

  uint16_t port = 0x1234;
  const char* host = "127.0.0.1";
  int sock;

  sock = socket(PF_INET, SOCK_STREAM, 0);  //创建套接字, 指定协议类型为ipv4服务类型为tcp流服务
  if(sock == -1){
    perror("socket create failed!\n");
    exit(1);
  }
  printf("socket is: %d\n", sock);

  struct sockaddr_in sa;  //声明套接字地址
  memset(&sa, 0, sizeof(sa));
  sa.sin_family = PF_INET;
  sa.sin_port = htons(port);
  inet_aton(host, &(sa.sin_addr)); 
  
  if(bind(sock, (struct sockaddr *)&sa, sizeof(sa)) == -1){  //将套接字绑定套接字地址
    perror("bind failed!\n");
    exit(1);
  }
  printf("bind success!\n");

  if(listen(sock, 10) == -1){  //监听套接字, 允许监听队列最大待处理客户连接为10
    perror("listen failed!\n");
    exit(1);
  }
  printf("listen success!\n");

  return 0;
}
