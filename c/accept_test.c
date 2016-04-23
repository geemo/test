#include <stdio.h>
#include <stdlib.h>  //exit
#include <string.h>  //memset
#include <arpa/inet.h>  //inet_aton, inet_ntoa, 包含netinet/in.h,定义了sockaddr_in,htons,ntohs  etc...
#include <sys/socket.h>  //socket, bind, listen, accept

int main(int argc, char* argv[]){
  uint16_t port = 0x1234;
  const char* host = "127.0.0.1";
  int svr_sock;
  
  svr_sock = socket(PF_INET, SOCK_STREAM, 0);  //创建套接字, 指定协议类型为ipv4,服务类型为tcp流
  if(svr_sock == -1){
    perror("create socket failed!\n");
    exit(1);
  }
  printf("socket is: %d\n", svr_sock);

  struct sockaddr_in svr_sa;  //套接字地址
  memset(&svr_sa, 0, sizeof(svr_sa));
  svr_sa.sin_family = PF_INET;
  svr_sa.sin_port = htons(port);  //端口转成网络字节序
  inet_aton(host, &(svr_sa.sin_addr));  //主机地址由点分十进制字符串转成32位网络地址

  if(bind(svr_sock, (struct sockaddr *)&svr_sa, sizeof(svr_sa)) == -1){  //套接字绑定套接字地址
    perror("bind failed!\n");
    exit(1);
  }
  printf("bind success!\n");

  if(listen(svr_sock, 10) == -1){  //监听套接字, 设置监听队列最大客户连接数为10
    perror("listen failed!\n");
    exit(1);
  }
  printf("listen success!\n");

  /* int accept(int __fd, __SOCKADDR_ARG __addr, socklen_t * __restrict __addr_len)
   * @param __fd listen的套接字文件描述符
   * @param __addr 类型struct sockaddr *__restrict, 请求连接方(客户端)地址
   * @param __addr_len 类型__U32_TYPE * __restrict, 客户端地址长度
   * @return 执行成功返回一个新的连接socket, 失败返回-1
   */
  struct sockaddr_in clnt_sa;
  socklen_t clnt_sa_len = sizeof(clnt_sa);
  
  printf("等待连接中...\n");
  int connfd = accept(svr_sock, (struct sockaddr *)&clnt_sa, &clnt_sa_len);
  if(connfd == -1){
    perror("accept failed!\n");
    exit(1);
  }
  printf("accept success!\n");

  /* int close(int __fd) 声明于unistd.h
   * @param __fd 需要关闭的套接字文件描述符
   * @return 执行成功返回0, 失败-1
   */
  close(connfd);
  close(svr_sock);
  
  return 0;
}
