#! /bin/sh

# 前端不需要java进程，但大多使用java的docker镜像
# 在启动镜像时关闭java
sudo killall java
