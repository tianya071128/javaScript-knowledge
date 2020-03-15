## 场景

一台电脑配置多个 git ssh, 例如在公司中, 需要配置公司中的 gitLab , 还可能需要配置自己的 github.

## 1. 生成 ssh

* gitLab

  ```bash
  $ ssh-keygen -t rsa -C "1email@company.com” -f ~/.ssh/id_rsa
  ```

* github

  ```bash
  $ ssh-keygen -t rsa -C "2email@github.com” -f ~/.ssh/github_rsa
  ```

此时 .ssh目录下会生成四个 ssh 文件

 ![img](https://img-blog.csdn.net/2018061308490842?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2hhbzQ5NTQzMDc1OQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70) 



## 2. 配置 ssh 到 github 和 gitlab

百度一下.



## 3. 配置文件 config 

最重要的一步:

* 在 .ssh 目录下添加 config 文件(不需要后缀名)
* 在 config 文件添加以下内容

```bash

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



### 4. 测试

```bash
$ ssh -T git@github.com # @ 后面的 config 配置的 Host
```

输出

`Hi XXX! You've successfully authenticated, but GitHub does not provide shell access.`

或者直接 `git操作`



## 5. 参考资料

[CSDN-Git配置多个SSH key](https://blog.csdn.net/hao495430759/article/details/80673568)