const path = require('path')
const fsPromises = require('fs').promises
const vscode = require('vscode')
const Outline = require('./outline')
const TreeDataProvider = require('./tree-data-provider')

class Gitbook {
  constructor () {
    this.fileName = path.join(vscode.workspace.rootPath, 'SUMMARY.md')

    vscode.workspace.onDidChangeTextDocument(event => {
      const {
        document
      } = event
      if (document.fileName === this.fileName) {
        this.refreshOutline(document.getText())
      }
    })

    vscode.commands.registerCommand('gitbook.openDoc', outline => {
      if (!outline || !outline.hasLink()) {
        return
      }

      const fileName = path.join(vscode.workspace.rootPath, outline.getLink())
      fsPromises.access(fileName)
        .then(() => {
          this.showDoc(fileName)
        }).catch(async () => {
          await fsPromises.mkdir(path.dirname(fileName), { recursive: true })
          await fsPromises.writeFile(fileName, '')
        }).then(() => {
          this.showDoc(fileName)
        }).catch(() => {
          vscode.window.showWarningMessage('cannot open file')
        })
    })
  }

  activate (context) {
    fsPromises.access(this.fileName)
      .then(() => this.readOutlineFromFile(this.fileName))
      .then(outline => this.setOutline(outline))
      .catch((error) => console.error(error))
  }

  deactivate () { }

  setOutline (outline) {
    this.outline = outline
    vscode.window.registerTreeDataProvider('bookstruct', new TreeDataProvider(outline))
    vscode.commands.executeCommand('setContext', 'showOutline', true)
  }

  readOutlineFromFile (uri) {
    return fsPromises.readFile(uri, { encoding: 'utf8' })
      .then((fileContent) => Outline.fromText(fileContent))
  }

  refreshOutline (fileContent) {
    this.outline.refresh(Outline.fromText(fileContent))
  }

  showDoc (fileName) {
    vscode.window.showTextDocument(vscode.Uri.file(fileName), {
      viewColumn: vscode.ViewColumn.One
    }).catch((e) => {
      console.log('fail to open', e)
    })
  }
}

module.exports = Gitbook
