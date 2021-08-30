"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const search_1 = require("./utils/search");
const matchSearchPhrase_1 = require("./utils/matchSearchPhrase");
function activate(_) {
    const provider = {
        provideInlineCompletionItems: async (document, position, _context, _token) => {
            const textBeforeCursor = document.getText(new vscode.Range(position.with(undefined, 0), position));
            const match = (0, matchSearchPhrase_1.matchSearchPhrase)(textBeforeCursor);
            if (match) {
                let rs;
                try {
                    rs = await (0, search_1.search)(match.searchPhrase);
                }
                catch (err) {
                    if (err instanceof Error) {
                        vscode.window.showErrorMessage(err.toString());
                        return { items: [] };
                    }
                }
                if (rs == null) {
                    return { items: [] };
                }
                const items = rs.results.map(item => {
                    const output = `
${match.commentSyntax} Source: ${item.sourceURL} ${match.commentSyntaxEnd}
${match.commentSyntax} Language: ${item.language} ${match.commentSyntaxEnd}
${item.code}`;
                    return {
                        text: output,
                        range: new vscode.Range(position.translate(0, output.length), position)
                    };
                });
                return { items };
            }
            return { items: [] };
        },
    };
    vscode.languages.registerInlineCompletionItemProvider({ pattern: "**" }, provider);
}
exports.activate = activate;
