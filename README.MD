# Zotero标签管理插件

------
 
本项目是由[generator-zotero-plugin](https://www.npmjs.com/package/generator-zotero-plugin)脚手架搭建的。这是一个[Yeoman](http://yeoman.io/)生成器，用于创建基于typescript的插件脚手架。包括构建脚本和工作流程，以在github版本中发布可更新的xpi。
 
## Installation
 
generator-zotero-plugin使用说明
 
### 1. 首先，使用npm安装Yeoman和generator-zotero-plugin。
 
```npm
npm install -g yo
npm install -g generator-zotero-plugin
```
 
### 2. 然后生成您的新项目
 
```npm
mkdir zotero-my-fantastic-plugin
cd zotero-my-fantastic-plugin
yo zotero-plugin
```
## build xpi文件
 
```npm
npm run build
```
---
 
## 标签管理插件功能

- [x] 检索所有者、发表情况、文章类型是否存在；若否，则添加missing
- [ ] 文章CCF类型判断

## ZoteroTags使用说明
将.xpi文件添加到Zotero文献管理软件中。