const jp = require('fs-jetpack')
const yaml = require('js-yaml')
const _ = require('lodash')


class Content {
  constructor(contentDir) {
    this._contentDir = contentDir
    this._content = {}
  }

  _loadType(type) {
    const path = `${this._contentDir}/${type}/`

    if (!jp.exists(path)) {
      const message = `Content path ${path} not found!`
      throw new Error(message)
    }

    const fileNames = jp.list(path)
    const yamls = fileNames.map(fileName => {
      return jp.read(path + fileName)
    })
    const objects = yamls.map(yamlStr => {
      return yaml.safeLoad(yamlStr)
    })
    return objects
  }

  _loadSplash() {
    const path = `${this._contentDir}/splash`
    return jp.read(path)
  }

  load() {
    this._content = {
      rooms: this._loadType('rooms'),
      npcs: this._loadType('npcs'),
      items: this._loadType('items'),
      splash: this._loadSplash()
    }
  }

  get(type) {
    if (type) {
      return [...this._content[type]]
    } else {
      return { ...this._content
      }
    }
  }

  getById(id) {
    let output
    _.forEach(this.get(), type => {
      _.forEach(type, thing => {
        if (String(thing.id) === String(id)) {
          output = _.assign(thing)
        }
      })
    })
    return output
  }
}

module.exports = Content