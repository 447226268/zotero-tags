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

  public async  checkitemsTags() {
    if (this.initialized) {
      const str_tags : string[] = ['所有者：', '发表情况：', '文章类型：', '研究对象：', '来源：']

      const zoteroPane = Zotero.getActiveZoteroPane()
      const collection = zoteroPane.getSelectedCollection()
      const items = collection.getChildItems()
      for (const item of items){
        for (const str_tag of str_tags){
          this.updata(item, str_tag)
        }
      }
  }
}

  public async updata(item: any,  checkTag: string){
    const oldTags = item.getTags()
    const newTags = oldTags
    let n = 0
    for (const tag of oldTags) {
        if (tag.tag.search(RegExp(checkTag)) !== -1) {
            n = n + 1
        }
    }
    if (n === 0) {
        newTags.push(checkTag +  'Missing')
        item.setTags(newTags)
        await item.save()
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
