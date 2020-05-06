#!/usr/bin/env bash

echo -e "\033[32m"
echo "##############################################"
echo "#            ct-admin Auto-Launch            #"
echo "##############################################"
echo "#请注意查看屏幕回显，确保上线完成            #"
echo "#dist方式：本地build，上传dist文件夹到服务器 #"
echo "##############################################"
echo -e "\033[0m"

if [ $# = 1 ];then
    if [ $1 = "test" ];then
        echo "当前上线服务器：test-server"
        addr="ubuntu@139.198.5.160"
        path="/var/www"
        npm run build
        tar -cf admin_dist.tar dist
        read -s -n1 -p "输入服务器密码，上传dist文件夹，按任意键继续..."
        echo ""
        scp -r admin_dist.tar $addr:$path
        read -s -n1 -p "再次输入服务器密码，确认覆盖ctadmin，按任意键继续..."
        echo ""
        ssh -tt "$addr" "cd $path && rm -rf ctadmin && tar -xvf admin_dist.tar && mv dist ctadmin"
    else
        echo "Usage: $0 [test|prod]"
        echo "You provided $1 as parameter 1."
        exit
    fi
else
    echo "Usage: $0 [test|prod]"
    echo "You provided $# parameters,but 1 is required."
    exit
fi