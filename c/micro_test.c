#include <stdio.h>

#define SQR(x) printf("The square of "#x" is %d\r\n", ((x)*(x)));
#define P(x) printf("%s: %d\r\n", #x, x);
#define prefix(x) x##family
int main(){
  int a = 5, b = 6;
  int prefix(sa_) = 5;
  SQR(a+b);
  P(a);
  P(b);
  P(a+b);
  printf("prefix: %d\r\n", sa_family);
  return 0;
}
