## 注册用户
1. 比较inUse
2. 在./db/users文件中记录username, password
3. 新建./db/albums/${userName}文件夹

## 登录用户
1. 比较gound

## 新建相册
1. 比较相册名字 ./db/albums/${username} 下所有相册
2. 新建 ./db/albums/${userName}/${albumName}文件夹
3. albumName写入 ./db/albums/${userName}/allAlbum 文件

# db
db
--users:[{useerName:'xx',password:'xxxxx'},{},{}]
--albums
    --userName1
        --allAlbum:[albumName1,albumName2,albumName3]
        --albumName1
            --cover.jpg/png
            --images
                --2019/5/4/*
                --2019/5/4/*
                --2019/5/4/*
        --albumName2
        --albumName3
        --albumName4
    --userName2
    --userName3
    --userName4

## pages
1. album
2. allImg
3. layout-show
4. album add/edit
5. 参考qq相册：上传，编辑，拼图
