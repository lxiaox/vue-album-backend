# 1用户

## 1注册用户  username passwd（可做加密）
1. 比较inUse
2. 在./db/users文件中记录username, password
3. 新建./db/albums/${userName}文件夹
4. 新建./db/albums/${userName}/allAlbum, 写入[]

## 2登录用户 username passwd
1. 比较found

## 3编辑用户 username passwd gener age ...

# 2相册

## 1新建/编辑相册 username albumName （cover可传可不传）
1. 比较相册名字 ./db/albums/${username} 下所有相册
2. 新建 ./db/albums/${userName}/${albumName}文件夹
3. albumName写入 ./db/albums/${userName}/allAlbum 文件
4. 写入./db/albums/${userName}/${albumName}/cover.png

## 2删除相册  username albumName

# 3图片

## 1上传图片 username albumName img-base64
1. 写入./db/albums/${userName}/${albumName}/2019.x.x.x.x.x.img

## 2删除图片 username albumName img-name
1. 删除./db/albums/${userName}/${albumName}/2019.x.x.x.x.x.img

# db
```
db
--users:[{useerName:'xx',password:'xxxxx'},{},{}]
--albums
  --userName1
    --allAlbum:[{albumName: 'album1',createTime: '',descriptioon: ''},albumName2,...] 目前只写albumname
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
```

# pages
1. album
2. allImg
3. layout-show
4. album add/edit
5. 参考qq相册：上传，编辑，拼图
