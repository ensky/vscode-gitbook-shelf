const vscode = require('vscode')

class TreeDataProvider {
  constructor (outline) {
    this.outline = outline

    const emitter = new vscode.EventEmitter()
    this.outline.setEmitter(emitter)
    this.onDidChangeTreeData = emitter.event
  }

  getTreeItem (outline) {
    const item = new vscode.TreeItem(outline.getText(), outline.hasChildren() ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None)

    if (outline.hasLink()) {
      item.tooltip = outline.getLink()
      item.command = {
        title: 'Edit',
        command: 'gitbook.openDoc',
        arguments: [outline]
      }
    }

    return item
  }

  getChildren (outline) {
    if (!outline) {
      outline = this.outline
    }

    return outline.getChildren()
  }
}

module.exports = TreeDataProvider
