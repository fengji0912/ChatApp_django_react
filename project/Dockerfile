# 建立 python 3.11环境
FROM python:3.11

# 安装netcat
RUN apt-get update && apt-get install -y netcat-traditional

# 镜像作者
MAINTAINER HL

# 设置 python 环境变量
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 容器内创建 project 文件夹
ENV APP_HOME=/var/www/html/project
RUN mkdir -p $APP_HOME
WORKDIR $APP_HOME

# 将当前目录加入到工作目录中（. 表示当前目录）
ADD . $APP_HOME

# 更新pip版本
RUN /usr/local/bin/python -m pip install --upgrade pip

# 安装项目依赖
RUN pip install -r requirements.txt

# 移除\r in windows
RUN sed -i 's/\r//' ./start.sh

# 给start.sh可执行权限
RUN chmod +x ./start.sh

# 数据迁移
ENTRYPOINT /bin/bash ./start.sh

