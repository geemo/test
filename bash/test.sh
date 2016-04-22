#!/bin/bash
#echo 'input num one'
#read num1
#echo 'input operator'
#read op
#echo 'input num two'
#read num2
#
#case $op in
#  +) echo "$num1 $op $num2 = $[$num1${op}$num2]";;
#  -) echo "$num1 $op $num2 = $[$num1${op}$num2]";;
# \*) echo "$num1 $op $num2 = $[$num1${op}$num2]";;
#  /) echo "$num1 $op $num2 = $[$num1${op}$num2]";;
#  *) echo "operator is error";;
#esac

#arr=(1 2 3 4 5 6 7 8 9 10)
#for val in ${arr[*]}
#do
#  echo $val
#done

#echo "type <CTRL-D> to terminate"
#echo -n "enter your most liked film: "
#while read FILM
#do
#  echo "yeah! great film the $FILM"
#done

#num=10
#until [ $num -lt 1 ]
#do
#  echo $num
#  num=$[$num-1]
#done

#while :
#do
#  echo -n "Input a number between 1 to 5: "
#  read num
#  case $num in
#    1|2|3|4|5) echo "Your number is $num";;
#    *) echo "You do not select a number between 1 to 5, game is over!"
#    break;;
#  esac
#done

#for val1 in 1 2 3 4
#do
#  for val2 in 0 5
#  do
#    if [ $val1 -eq 3 -a $val2 -eq 0 ]
#    then
#      break 2
#    else
#      echo "$val1 $val2"
#    fi
#  done
#done

#while :
#do
#  echo "select a num"
#  read num
#  case $num in
#    1|2|3|4|5) echo "you select num: $num";;
#    *) echo "select error, game over!"
#       continue
#       echo "game over!"
#    ;;
#  esac
#done

#Hello(){
#  echo "arg1 + arg2 = $(($1+$2))"
#}
#echo "input arg1"
#read arg1
#echo "input arg2"
#read arg2
#Hello $arg1 $arg2
#

#testReturn(){
#  echo "input first num"
#  read num1
#  echo "input secondly num"
#  read num2
#  return $(($num1+$num2))
#}
#testReturn
#echo $?

idx=1
read arr
funWithParam(){
#  while :
#  do
#    if [ $i -le $# ] 
#    then
#      echo "param $i value is: ${$i}" 
#      i=$[$i+1]
#      break
#    fi
#  done     
  for item in $*
  do
    echo "param $idx value is: $item"
  done 
}
funWithParam ${arr[*]}
