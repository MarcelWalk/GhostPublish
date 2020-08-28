// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const showdown = require('showdown');
const GhostAdminAPI = require('@tryghost/admin-api');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ghostpublish" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('ghostpublish.ghostPublish', function () {
		// The code you place here will be executed every time your command is executed

		let api_url = vscode.workspace.getConfiguration('ghostpublish').get("apiUrl");
		let admin_key = vscode.workspace.getConfiguration('ghostpublish').get("adminKey");
		let filepath = vscode.window.activeTextEditor.document.fileName.replace(/^.*[\\\/]/, '');

		// Your API config
		const api = new GhostAdminAPI({
			url: api_url,
			version: "v3",
			key: admin_key
		});

		// Get the active text editor
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;

			// Get the text of the file
			const word = document.getText();

			// Convert to HTML because ghost doesnt support MD
			let converter = new showdown.Converter();
			let html = converter.makeHtml(word);

			if (filepath.substring(filepath.lastIndexOf(".")+1, filepath.length) == "md") {
				//Create post
				api.posts.add({
						title: filepath.substring(0, filepath.lastIndexOf(".")),
						html
					}, {
						source: "html"
					}).then(() => {
						// Display a sucess message
						vscode.window.showInformationMessage("Post created on " + api_url);
					})
					.catch(err => {
						// Display a error message
						vscode.window.showInformationMessage("Post creation failed\n" + err);
					});
			}else{
				vscode.window.showInformationMessage("Please use a markdown file");
			}




		}


	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}