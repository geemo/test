#include <stdio.h>
#include <arpa/inet.h>

int main(){
  const char* ip_str1 = "192.168.130.60";
  const char* ip_str2 = "192.168.130.256";

  in_addr_t net_addr1 = inet_addr(ip_str1);
  if(net_addr1 == INADDR_NONE){
    printf("Error\n");
  }else{
    printf("网络字节序: %#x\n", net_addr1);
  }

  in_addr_t net_addr2 = inet_addr(ip_str2);
  if(net_addr2 == INADDR_NONE){
    printf("Error\n");
  }else{
    printf("网络字节序: %#x\n", net_addr2);
  }
  return 0;
}
