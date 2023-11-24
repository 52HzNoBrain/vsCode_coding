// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { provideInlineCompletionItems } = require('./AiaCodeCompletionProvider')

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

let timer;

/**
 * @param {vscode.ExtensionContext} context
 */
const activate =  (context) => {
	provideInlineCompletionItems(context)

	context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(event => {
		const delayTime = vscode.workspace.getConfiguration("aia").get("AutoCompletionDelay");
		clearTimeout(timer)
		console.log('==='+event.contentChanges[0].text+'===');
		if(/[\t \n]/.test(event.contentChanges[0].text)){
			timer = setTimeout(() => {
				console.log('触发快捷键');
				console.log('执行指令');
				fn()
			},delayTime * 1000)
		}
	}));

	let t;
	context.subscriptions.push(vscode.commands.registerCommand('plugin.login',  () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		console.log('test');
		vscode.window.showInformationMessage('login');
		clearTimeout(t)
		t = setTimeout(() => {
			vscode.commands.executeCommand('aia.getInfo')
		},1000)
		// vscode.commands.executeCommand('aia.getInfo')
	}));

	context.subscriptions.push(vscode.commands.registerCommand('plugin.loginOut', () => {
		vscode.window.showInformationMessage('login out');
	}));

}

const fn = () => {
	console.log('22');
	// vscode.commands.executeCommand('aia.getInfo')
}

module.exports = {
	activate,
}