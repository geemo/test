#include <stdio.h>

union{
  short val;
  char seq_arr[sizeof(short)];
} byte_seq;

int main(void){
  byte_seq.val = 0x1234;
  if(byte_seq.seq_arr[0] == 0x12 && byte_seq.seq_arr[1] == 0x34)
    printf("网络字节序\r\n");
  else if(byte_seq.seq_arr[0] == 0x34 && byte_seq.seq_arr[1] == 0x12)
    printf("主机字节序\r\n");
  else
    printf("未知字节序\r\n");

  return 0;
}
