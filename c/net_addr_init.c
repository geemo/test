#include <stdio.h>
#include <string.h>
#include <arpa/inet.h>

int main(int argc, char* argv[]){
  uint16_t port = 0x1234;
  const char* host = "127.0.0.1";
  
  struct sockaddr_in sa;
  memset(&sa, 0, sizeof(struct sockaddr_in));

  sa.sin_family = AF_INET;
  sa.sin_port = htons(port);  //将主机字节序端口转化为网络字节序
  inet_aton(host, &(sa.sin_addr));  //将ascii字符主机地址转化为32位网络地址

  printf("port: %#x\n", sa.sin_port);
  printf("host: %#x\n", sa.sin_addr.s_addr);
  
  return 0;
}
