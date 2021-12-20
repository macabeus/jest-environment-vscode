import { window, commands, CodeAction, workspace, Uri, Range, Hover, Position, SymbolInformation, Location, LocationLink } from 'vscode'

const codeActions = async (uri: Uri, range: Range) => {
  const doc = await workspace.openTextDocument(uri)
  await window.showTextDocument(doc)

  const rawCodeActions = await commands.executeCommand('vscode.executeCodeActionProvider', uri, range) as CodeAction[]

  const codeActions = rawCodeActions.reduce((acc, codeAction) => {
    const { command: codeActionCommand } = codeAction

    if (codeActionCommand) {
      const args = codeActionCommand.arguments ?? []
      acc[codeAction.title] = () => commands.executeCommand(codeActionCommand.command, ...args)  
    }

    return acc
  }, {} as { [codeActionTitle: string]: () => Thenable<void> })

  return codeActions
}

const definitions = async (uri: Uri, position: Position) => {
  const doc = await workspace.openTextDocument(uri)
  await window.showTextDocument(doc)

  const definitions = await commands.executeCommand('vscode.executeDefinitionProvider', uri, position) as Array<Location | LocationLink>

  return definitions
}

const hovers = async (uri: Uri, position: Position) => {
  const doc = await workspace.openTextDocument(uri)
  await window.showTextDocument(doc)

  const hovers = await commands.executeCommand('vscode.executeHoverProvider', uri, position) as Hover[]

  const hoversContent = hovers.flatMap((hover) => hover.contents.map(content => (content as { value: string }).value))

  return hoversContent
}

const documentSymbols = async (uri: Uri) => {
  const doc = await workspace.openTextDocument(uri)
  await window.showTextDocument(doc)

  const documentSymbols = await commands.executeCommand('vscode.executeDocumentSymbolProvider', uri) as SymbolInformation[]

  return documentSymbols
}

const documentText = async (uri: Uri) => {
  const doc = await workspace.openTextDocument(uri)
  const textDocument = await window.showTextDocument(doc)
  const text = textDocument.document.getText()

  return text
}

export default {
  codeActions,
  definitions,
  hovers,
  documentSymbols,
  documentText,
}
