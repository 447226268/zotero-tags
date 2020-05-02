declare const Zotero: any
declare const Components: any

const marker = 'AddtagsMonkeyPatched'

function patch(object, method, patcher) {
    if (object[method][marker]) return
    object[method] = patcher(object[method])
    object[method][marker] = true
}

const Addtags = Zotero.Addtags || new class { // tslint:disable-line:variable-name
    private initialized: boolean = false

    constructor() {
        window.addEventListener('load', event => {
            this.init().catch(err => Zotero.logError(err))
        }, false)
    }

    public async checkitemsTags() {
        if (this.initialized) {
            const str_tags: string[] = ['所有者：', '发表情况：', '文章类型：', '研究对象：', '来源：']
            const zoteroPane = Zotero.getActiveZoteroPane()
            const collection = zoteroPane.getSelectedCollection()
            const items = collection.getChildItems()
            for (const item of items) {
                try {
                    this.updata(item, str_tags)
                    await item.saveTx()
                } catch (error) {
                    alert(`item.id：${item.id}，文件名：${item.getField('title')}，错误信息：${error}！`)
                }
            }
        }
    }

    private updataWhatisMissing(whatisMissing: string, isMissing: string): string {
        if (whatisMissing === '信息缺失：') {
            whatisMissing = `${whatisMissing}${isMissing}`
        } else {
            whatisMissing = `${whatisMissing}、${isMissing}`
        }
        return whatisMissing
    }

    private checkMetadate(item: any): boolean{
        const itemTypes = Zotero.ItemTypes
        const itemType = ['conferencePaper', 'journalArticle', 'thesis']
        const metaDate = [['title', 'firstCreator', 'pages', 'date', 'place', 'proceedingsTitle'],
        ['title', 'firstCreator', 'pages', 'date', 'publicationTitle'],
        ['title', 'firstCreator', 'university', 'date', 'place']]
        for (const i in itemType){
            if (itemTypes.getName(item.getField('itemTypeID')) === itemType[i]){
                for (const metadate of metaDate[i]){
                    if (item.getField(metadate) === ''){
                        return true
                    }
                }
            }
        }
        return false
    }

    private updata(item: any, checkTags: string[]): any {
        const oldTags = item.getTags()
        let new_whatisMissing = '信息缺失：'

        // 添加所有者,发表情况,文章类型,研究对象,来源Missing
        for (const checkTag of checkTags) {
            if ((JSON.stringify(oldTags)).search(RegExp(checkTag)) === -1) {
                item.addTag(checkTag + 'Missing')
            }
        }

        // 检测哪些标签缺失
        if (this.checkMetadate(item)){
            new_whatisMissing = this.updataWhatisMissing(new_whatisMissing, 'Metadate')
        }
        for (const checkTag of checkTags) {
            if (item.hasTag(checkTag + 'Missing')) {
                new_whatisMissing = this.updataWhatisMissing(new_whatisMissing, 'Tags')
                break
            }
        }
        if (item.numNotes() === 0) {
            new_whatisMissing = this.updataWhatisMissing(new_whatisMissing, 'Note')
        }

        // 添加和修改信息缺失
        let old_whatisMissing = ''
        for (const tag of oldTags) {
            if (tag.tag.search(RegExp('信息缺失：')) !== -1) {
                old_whatisMissing = tag.tag
                break
            }
        }
        if (old_whatisMissing === '') {
            if (new_whatisMissing !== '信息缺失：') {
                item.addTag(new_whatisMissing)
            }
        } else {
            if (new_whatisMissing !== '信息缺失：') {
                item.replaceTag(old_whatisMissing, new_whatisMissing)
            } else {
                item.removeTag(old_whatisMissing)
            }
        }
    }

    private async init() {
        if (this.initialized) return
        this.initialized = true
    }
}


export = Addtags

// otherwise this entry point won't be reloaded: https://github.com/webpack/webpack/issues/156
delete require.cache[module.id]
