import * as vscode from 'vscode';

export function getApiKey(): string | null{
    const config = vscode.workspace.getConfiguration("codeassist");
    const key = config.get<string>("geminiAPIKey");

    if (!key){
        vscode.window.showErrorMessage("Gemini API key not set");
        return null;
    }

    return key;
}

export function getSelectedText(): string | null{
    const editor = vscode.window.activeTextEditor;
    if (!editor){
        vscode.window.showErrorMessage("No active editor window!");
        return null;
    }

    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);

    if (!selectedText.trim()){
        vscode.window.showInformationMessage("No text detected");
        return null;
    }
    return selectedText;
}
