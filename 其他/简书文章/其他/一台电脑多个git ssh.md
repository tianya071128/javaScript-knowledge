配置文件 config 信息

```

# github
Host github.com
    HostName github.com
    PreferredAuthentications publickey
    IdentityFile ~/.ssh/id_rsa
    User 1033051985@qq.com
 
# gitlab
Host 119.23.40.209
    Port 8085
    HostName 119.23.40.209
    PreferredAuthentications publickey
    IdentityFile ~/.ssh/github_rsa
    User wenzubiao@126.com

# 配置文件参数
# Host : Host可以看作是一个你要识别的模式，对识别的模式，进行配置对应的的主机名和ssh文件（可以直接填写ip地址）
# HostName : 要登录主机的主机名（建议与Host一致）
# User : 登录名（如gitlab的username）
# IdentityFile : 指明上面User对应的identityFile路径
# Port: 端口号（如果不是默认22号端口则需要指定）
```

