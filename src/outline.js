const {
  State,
  MarkdownParser
} = require('markup-it')

class Outline {
  constructor (document) {
    this.doc = document
  }

  static fromText (text) {
    const state = State.create(MarkdownParser)
    const document = state.deserializeToDocument(text)
    return new Outline(document)
  }

  setEmitter (emitter) {
    this.emitter = emitter
  }

  refresh (newOutline) {
    this.doc = newOutline.doc
    this.emitter && this.emitter.fire()
  }

  getChildren () {
    if (!this.doc.nodes || this.doc.type === 'link') {
      return Promise.resolve([])
    }

    if (this.doc.nodes.size > 1 && this.doc.nodes.get(1).type === 'unordered_list') {
      return Promise.resolve(this.doc.nodes.get(1).nodes
        .map((el) => new Outline(el))
        .toArray())
    }

    return Promise.resolve(this.doc.nodes.filter(el => el.type !== 'unstyled')
      .map((el) => new Outline(el))
      .toArray())
  }

  getText () {
    return this.doc.getTexts().get(0).text
  }

  hasChildren () {
    return this.doc.getInlinesByType('link').size > 1
  }

  hasLink () {
    return this.doc.getInlinesByType('link').size > 0
  }

  getLink () {
    return this.doc.getInlinesByType('link').get(0).data.get('href')
  }
}

module.exports = Outline
