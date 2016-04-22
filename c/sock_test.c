#include <stdio.h>
#include <sys/socket.h>

int main(int argc, char* argv[]){
  int sock;

  /* int socket(int __domain, int __type, int __protocol)
   * @param __domain 地址协议簇, PF_INET(IPv4), PF_INET6(IPv6)
   * @param __type 指定服务类型, SOCK_STREAM(tcp), SOCK_DGRAM(udp)
   * @param __protocol 由于指定了__type, 设置为0即可
   * @return 执行成功返回socket文件描述符, 失败返回-1
   */

  sock = socket(PF_INET, SOCK_STREAM, 0);
  if(sock == -1) perror("socket create failed!");
  else printf("socket is %d\n", sock);

  return 0;
}
