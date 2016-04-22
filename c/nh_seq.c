#include <stdio.h>
#include <netinet/in.h>

int main(void){
  unsigned short host_port = 0x1234;
  unsigned long host_address = 0x12345678;

  unsigned short net_port = htons(host_port);
  unsigned long net_address = htonl(host_address);

  printf("port主机字节序(short): %#x \r\n", host_port);
  printf("port网络字节序(short): %#x \r\n", net_port);

  printf("address主机字节序(long): %#lx \r\n", host_address);
  printf("address网络字节序(long): %#lx \r\n", net_address);

  return 0;
}
