## ssh相关
```bash
# 从远程服务器拷贝文件到本地
scp soft@192.168.125.146:/home/soft/minio.tar E:\
```



## 网络相关
```bash
# 均需要管理员身份
# 1. 转发端口 (listen是转发后的，connect是转发前的）
netsh interface portproxy add v4tov4 \
  listenaddress=192.168.125.142 listenport=81 \
  connectaddress=127.0.0.1 connectport=81

# 2. 查看转发规则
netsh interface portproxy show all

# 3. 删除指定 IP 和端口
netsh interface portproxy delete v4tov4 listenport=80 listenaddress=192.168.125.142

# 4. 删除所有 IP 的监听端口
netsh interface portproxy delete v4tov4 listenport=10022 listenaddress=*

# 5. 删除默认地址（0.0.0.0）的端口
netsh interface portproxy delete v4tov4 listenport=3340

# 6. 删除所有规则
netsh interface portproxy reset
```


