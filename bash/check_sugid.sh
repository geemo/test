#!/bin/bash

find / -perm -2000 -perm -4000 > /var/log/check_sugid.log

for i in $(cat /var/log/chk_sugid.log)
do
	grep $i /var/log/pass_sugid.log > /dev/null
	if [ $? != 0 ]; then
		echo "unknow file $i" >> /var/log/unknow_file_`date +%y%m%d`.log
	fi
done

rm -f /var/log/check_sugid.log