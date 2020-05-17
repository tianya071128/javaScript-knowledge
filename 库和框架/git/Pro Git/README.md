# git

## 1. 配置 git config

Git 自带一个 git config 的工具来帮助设置控制 Git 外观和行为的配置变量。 这些变量存储在三个不同的位置：
1. /etc/gitconfig 文件: 包含系统上每一个用户及他们仓库的通用配置。 如果在执行 git config 时带上 --system 选项，那么它就会读写该文件中的配置变量。 （由于它是系统配置文件，因此你需要管理员或
超级用户权限来修改它。）
2. ~/.gitconfig 或 ~/.config/git/config 文件：只针对当前用户。 你可以传递 --global 选项让 Git读写此文件，这会对你系统上 所有 的仓库生效。
3. 当前使用仓库的 Git 目录中的 config 文件（即 .git/config）：针对该仓库。 你可以传递 --local 选项让 Git 强制读写此文件，虽然默认情况下用的就是它。。 （当然，你需要进入某个 Git 仓库中才能让该选项生效。）每一个级别会覆盖上一级别的配置，所以 .git/config 的配置变量会覆盖 /etc/gitconfig 中的配置变量。

```bash
# 查看所有的配置以及它们所在的文
$ git config --list --show-origin

# 列出所有 Git 当时能找到的配置
$ git config --list

# 检查 Git 的某一项配置
$ git config user.name

# 设置配置
$ git config --global user.name "John Doe"
$ git config --global user.email johndoe@example.com


```



## 2. 新建仓库

通常有两种获取 Git 项目仓库的方式：
1. 将尚未进行版本控制的本地目录转换为 Git 仓库；
2. 从其它服务器 克隆 一个已存在的 Git 仓库。

```bash
# 在当前目录新建一个Git代码库
$ git init

# 新建一个目录，将其初始化为Git代码库
$ git init [project-name]

# 下载一个项目和它的整个代码历史
$ git clone [url]
# 自定义本地仓库的名字
$ git clone [url] [name]
```



## 3. 查看状态 git status

**这是个多功能命令：可以用它开始跟踪新文件，或者把已跟踪的文件放到暂存区，还能用于合并时把有冲突的文件标记为已解决状态等。**

```bash
# 查看哪些文件处于什么状态
$ git status

# 缩短状态命令的输出，这样可以以简洁的方式查看更改
$ git status -s # git status --short
# ?? 标记：未跟踪文件
# A 标记：新添加到暂存区中的文件
# M 标记：修改过的文件
```



## 4. 查看修改 git diff

请注意，git diff 本身只显示尚未暂存的改动，而不是自上次提交以来所做的所有改动。 所以有时候你一下子暂存了所有更新过的文件，运行 git diff 后却什么也没有，就是这个原因。

```bash
# 查看尚未暂存的文件更新了哪些部分，不加参数直接输入 git diff
$ git diff

# 查看已暂存的将要添加到下次提交里的内容，可以用 git diff --staged 命令。
$ git diff --staged # git diff --cached, --staged 和 --cached 是同义词
```



## 5. 提交至本地仓库 git commit

* 启动的编辑器是通过 Shell 的环境变量 EDITOR 指定的，一般为 vim 或 emacs。 当然也可以使用 git config --global core.editor 命令设置你喜欢的编辑器。

```bash
# 启动你选择的文本编辑器来输入提交说明, 退出编辑器时，Git 会丢弃注释行，用你输入的提交说明生成一次提交。
$ git commit

# 将提交信息与命令放在同一行
$ git commit -m [message]

# 提交时显示所有diff信息
$ git commit -v
```



## 6. 增加/删除文件 git add git rm

我们想把文件从 Git 仓库中删除（亦即从暂存区域移除），但仍然希望保留在当前工作目录
中。 换句话说，你想让文件保留在磁盘，但是并不想让 Git 继续跟踪。 当你忘记添加 .gitignore 文件，不小心把一个很大的日志文件或一堆 .a 这样的编译生成文件添加到暂存区时，这一做法尤其有用。 为达到这一目的，使用 --cached 选项：

```bash
# 添加指定文件到暂存区
$ git add [file1] [file2] ...

# 添加指定目录到暂存区，包括子目录
$ git add [dir]

# 添加当前目录的所有文件到暂存区
$ git add .

# 删除工作区文件，并且将这次删除放入暂存区
$ git rm [file1] [file2] ...

# 停止追踪指定文件，但该文件会保留在工作区
$ git rm --cached [file]

# 改名文件，并且将这个改名放入暂存区
$ git mv [file-original] [file-renamed]
```



## 7. 查看提交历史 git log

```bash
# 显示当前分支的版本历史,按时间先后顺序列出所有的提交，最近的更新排在最上面。
# 会列出每个提交的 SHA-1 校验和、作者的名字和电子邮件地址、提交时间以及提交说明
$ git log

# 显示每次提交所引入的差异（按 补丁 的格式输出）
# 也可以限制显示的日志条目数量，例如使用 -2 选项来只显示最近的两次提交
$ git log -p -2

# 每次提交的简略统计信息，可以使用 --stat 选项
$ git log --stat

# 可以使用不同于默认格式的方式展示提交历史
# 这个选项有一些内建的子选项供你使用。 比如 oneline 会将每个提交放在一行显示，在浏览大量的提交时非常有用。
$ git log --pretty=oneline
```



## 8. 撤销操作

```bash
# 恢复暂存区的指定文件到工作区
$ git checkout [file]

# 恢复某个commit的指定文件到工作区
$ git checkout [commit] [file]

# 恢复上一个commit的所有文件到工作区
$ git checkout .

# 重置暂存区的指定文件，与上一次commit保持一致，但工作区不变
$ git reset [file]

# 重置暂存区与工作区，与上一次commit保持一致
$ git reset --hard

# 重置当前分支的指针为指定commit，同时重置暂存区，但工作区不变
$ git reset [commit]

# 重置当前分支的HEAD为指定commit，同时重置暂存区和工作区，与指定commit一致
$ git reset --hard [commit]

# 重置当前HEAD为指定commit，但保持暂存区和工作区不变
$ git reset --keep [commit]

# 新建一个commit，用来撤销指定commit
# 后者的所有变化都将被前者抵消，并且应用到当前分支
$ git revert [commit]
```



## 9. 远程仓库 remote

```bash
# 列出你指定的每一个远程服务器的简写
$ git remote -v
# 显示需要读写远程仓库使用的 Git 保存的简写与其对应的 URL
$ git remote -v

# 增加一个新的远程仓库，并命名为 shortname
$ git remote add <shortname> <url>

# 下载远程仓库的所有变动
$ git fetch [remote]

# 取回远程仓库的变化，并与本地分支合并
$ git pull [remote] [branch]

# 上传本地指定分支到远程仓库
$ git push [remote] [branch]

# 强行推送当前分支到远程仓库，即使有冲突
$ git push [remote] --force

# 推送所有分支到远程仓库
$ git push [remote] --all

# 显示某个远程仓库的信息
$ git remote show [remote]

# 远程仓库的重命名
$ git remote rename [当前名称] [修改名称]

# 删除远程仓库，所有和这个远程仓库相关的远程跟踪分支以及配置信息也会一起被删除。
$ git remote remove [remote] # 或 git remote rm [remote]
```



## 10. 打标签

Git 支持两种标签：轻量标签（lightweight）与附注标签（annotated）。

* 轻量标签很像一个不会改变的分支——它只是某个特定提交的引用。
* 而附注标签是存储在 Git 数据库中的一个完整对象， 它们是可以被校验的，其中包含打标签者的名字、电子邮件地址、日期时间， 此外还有一个标签信息，并且可以使用 GNU Privacy Guard （GPG）签名并验证。

> git push 推送两种标签使用 git push \<remote> --tags 推送标签并不会区分轻量标签和附注标签， 没有简单的选项能够让你只选择推送一种标签。

```bash
# 列出所有tag
$ git tag
# 按照特定的模式查找标签。
$ git tag -l "v1.8.5*" # -l 和 --list 都是一样意思

# 创建附注标签：-m 选项指定了一条将会存储在标签中的信息。 如果没有为附注标签指定一条信息，Git 会启动编辑器要求你输入信息。
$ git tag -a [tag] -m [message]
# 创建轻量标签：在当前 commit 下创建
$ git tag [tag]
# 新建一个 tag 在指定 commit
$ git tag [tag] [commit]

# 查看 tag 详细信息
$ git show [tag]

# 提交指定tag
$ git push [remote] [tag]
# 提交所有tag
$ git push [remote] --tags

# 删除本地标签：并不会从任何远程仓库中移除这个标签
$ git tag -d <tagname>
# 删除远程标签
$ git push <remote> :refs/tags/<tagname> # 更新远程标签
$ git push <remote> --delete <tagname> 

# 新建一个分支，指向某个tag -- 
$ git checkout -b [branch] [tag]
```





























## 4. 忽略文件 .gitignore

文件 .gitignore 的格式规范如下：

* 所有空行或者以 # 开头的行都会被 Git 忽略。

* 可以使用标准的 glob 模式匹配，它会递归地应用在整个工作区中。

  > 所谓的 glob 模式是指 shell 所使用的简化了的正则表达式。 星号（*）匹配零个或多个任意字符；[abc] 匹配任何一个列在方括号中的字符 （这个例子要么匹配一个 a，要么匹配一个 b，要么匹配一个 c）； 问号（?）只匹配一个任意字符；如果在方括号中使用短划线分隔两个字符， 表示所有在这两个字符范围内的都可以匹配（比如 [0-9] 表示匹配所有 0 到 9 的数字）。 使用两个星号（**）表示匹配任意中间目录，比如 a/**/z 可以匹配 a/z 、 a/b/z 或 a/b/c/z 等。

* 匹配模式可以以（/）开头防止递归。

* 匹配模式可以以（/）结尾指定目录。

* 要忽略指定模式以外的文件或目录，可以在模式前加上叹号（!）取反。

```bash
# 忽略所有的 .a 文件
*.a
# 但跟踪所有的 lib.a，即便你在前面忽略了 .a 文件
!lib.a
# 只忽略当前目录下的 TODO 文件，而不忽略 subdir/TODO
/TODO
# 忽略任何目录下名为 build 的文件夹
build/
# 忽略 doc/notes.txt，但不忽略 doc/server/arch.txt
doc/*.txt
# 忽略 doc/ 目录及其所有子目录下的 .pdf 文件
doc/**/*.pdf
```

> 在最简单的情况下，一个仓库可能只根目录下有一个 .gitignore 文件，它递归地应用到整个仓库中。 然而，子目录下也可以有额外的 .gitignore 文件。子目录中的 .gitignore
> 文件中的规则只作用于它所在的目录中。 （Linux 内核的源码库拥有 206 个 .gitignore 文件。）