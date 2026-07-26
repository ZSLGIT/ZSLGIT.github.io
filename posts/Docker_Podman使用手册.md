## 基本
```bash
# 启动容器
sudo docker run -d --name difyappweb -p 80:3000 localhost/webapp-conversation

# 挂载文件
sudo docker run -d --name gldifyapi \
  -v ./dockerlogs:/app/logs \
  -v./appsettings.json:/app/appsettings.json \
  -p 81:3001 localhost/gldifyapi

# 停止容器
sudo docker stop gldifyapi

# 启动容器
sudo docker start gldifyapi

# 查看容器（运行中）
sudo docker ps
# 查看容器（所有）
sudo docker ps -a

# 删除容器
# 增加-f 参数可强制删除
sudo docker rm difyappweb


# docker 查看所有容器时因port太长导致的特别长的换行
docker ps -a --format "table {{.ID}}\t{{.Image}}\t{{.Status}}\t{{.Names}}"


# 删除空引用镜像
podman image prune -f
docker rmi $(docker images -f dangling=true -q)
```

## 镜像
```bash
# 查看镜像
sudo docker images

# 删除镜像
sudo docker rmi [image] [image1]

# 拉取容器
sudo docker pull swr.cn-north-4.myhuaweicloud.com/ddn-k8s/quay.io/minio/minio:RELEASE.2025-07-23T15-54-02Z

# 重命名容器
sudo docker tag  swr.cn-north-4.myhuaweicloud.com/ddn-k8s/quay.io/minio/minio:RELEASE.2025-07-23T15-54-02Z  quay.io/minio/minio:20250723
```



```bash
# ~/.config/containers/registries.conf（用户级）
# /etc/containers/registries.conf（系统级 sudo）
[[registry]]
prefix = "quay.io"
location = "quay.io"
[[registry.mirror]]
location = "quay.m.daocloud.io"
[[registry]]
prefix = "docker.io"
location = "docker.io"
[[registry.mirror]]
location = "docker.m.daocloud.io"
```



## 日志
```bash
# 查看日志 -f 实时刷新日志
sudo docker logs -f gldifyapi

```

## 导入导出
```bash
docker load -i XX.tar
```

```bash
docker save -o xx.tar localhost/xx:latest
```



## 常用容器启动命令
```bash
sudo docker run -d --name difyminio \
  -p 82:9000 \
  -p 83:9001 \
  -e MINIO_ROOT_USER=admin \
  -e MINIO_ROOT_PASSWORD=gltech@2025 \
  -v ./miniodir:/data \
  minio/minio:RELEASE.2025-09-07T16-13-09Z-cpuv1 \
  server /data --console-address ":9001"
```

```bash
sudo docker run --name pgsql \
  -p 84:5432 \
  -e POSTGRES_PASSWORD=Glabc123@1994tech \
  -v ~/pgsql/:/var/lib/postgresql/data \
  -d postgres:15-alpine
```

```bash
sudo docker run -d --name nginx -p 3030:3030 \
  -v ~/nginx/conf:/etc/nginx/conf.d/ \
  -v ~/nginx/logs:/var/log/nginx \
  -v ~/nginx/html:/usr/share/nginx/html \
  nginx:latest
```

```bash
server {
        listen       3030;       # 监听本机的8001端口
        server_name  localhost;   # 服务器名，可以是域名、IP或localhost
		location /ftp/ {
            # 将请求转发到目标服务器
            proxy_pass http://192.168.16.21:82/;
            # 核心：支持WebSocket的关键配置
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $http_host; # 对于MinIO很重要

            # 其他必要的头部设置
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # 提升性能与大文件支持
            proxy_buffering off;
            client_max_body_size 100m;

            # WebSocket长连接超时设置（可选但推荐）
            proxy_read_timeout 3600s; # 根据需要调整，例如1小时
        }


        location /gapi/ {
            # 将请求转发到目标服务器
            proxy_pass http://192.168.16.21:81/;
			# —— SSE 必须配置 ——
			proxy_buffering off;          # 关闭缓冲（关键）
			proxy_cache off;              # 关闭缓存
			proxy_read_timeout 3600s;     # SSE 长连接超时
			proxy_send_timeout 3600s;

            # 以下设置确保正确传递客户端信息[1,5](@ref)
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
			proxy_set_header X-Forwarded-Host $host;
			proxy_set_header X-Forwarded-Port $server_port;
            client_max_body_size 100M;
        }
        location / {
            # 将请求转发到目标服务器
            proxy_pass http://192.168.16.21:80/;
			# —— SSE 必须配置 ——
			proxy_buffering off;          # 关闭缓冲（关键）
			proxy_cache off;              # 关闭缓存
			proxy_read_timeout 3600s;     # SSE 长连接超时
			proxy_send_timeout 3600s;

            # 以下设置确保正确传递客户端信息[1,5](@ref)
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
			proxy_set_header X-Forwarded-Host $host;
			proxy_set_header X-Forwarded-Port $server_port;
            client_max_body_size 100M;
        }
    }
```

```csharp
sudo podman run -d -it \
  -p 2935:1935 -p 2985:1985 -p 2080:8080 \
  --name srs ossrs/srs:5 
```
