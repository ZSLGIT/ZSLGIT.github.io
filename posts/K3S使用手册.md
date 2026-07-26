```bash
# 查看所有Pod
kubectl get Pods -A

# 查看端口映射等信息
kubectl get svc -A -o wide

# 编辑 Traefik Service
sudo kubectl edit svc traefik -n kube-system
```
