import * as vscode from 'vscode';
import { getSelectedText } from './utils/editor';
import { getApiKey } from './utils/editor';
import {explainWithGemini} from './services/geminiClient';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "codeassist" is now active!');

	const explainCommand = vscode.commands.registerCommand("codeassist.explainCode", async () => {
		const selectedCode = getSelectedText();
		if (!selectedCode){ 
			return;
		}
		
		const apiKey = getApiKey();
		if (!apiKey){
			return;
		}

		try{
			const explanation = await explainWithGemini(selectedCode, apiKey);
			vscode.window.showInformationMessage(explanation);
		} catch (err) {
			console.error('Explain command failed:', err);
            vscode.window.showErrorMessage('Failed to explain code');
        }
	});

	context.subscriptions.push(explainCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}
