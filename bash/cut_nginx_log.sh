#!/bin/bash

## nginx日志分割

logpath='/usr/local/nginx/logs'

tmpdir=${logpath}/`date -d yesterday +%Y`/`date -d yesterday +%m`

mkdir -p $tmpdir

mv ${logpath}/access.log ${tmpdir}/`date -d yesterday +%Y%m%d`.log

kill -USR1 `cat ${logpath}/nginx.pid`