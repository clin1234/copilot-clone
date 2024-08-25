import * as vscode from "vscode";

import { search } from "./utils/search";
import { matchSearchPhrase } from "./utils/matchSearchPhrase";

export function activate(_: vscode.ExtensionContext) {
  const provider: vscode.CompletionItemProvider = {
    // @ts-expect-error
    provideInlineCompletionItems: async (document: vscode.TextDocument, position: vscode.Position, context, token) => {
    // provideCompletionItems: async (document, position, context, token) => {
      const textBeforeCursor: string = document.getText(
        new vscode.Range(position.with(undefined, 0), position)
      );

      const match = matchSearchPhrase(textBeforeCursor);
      let items: any[] = [];

      if (match) {
        let rs;
        try {
          rs = await search(match.searchPhrase);
          if (rs) {
            items = rs.results.map((item) => {
              const output = `\n${match.commentSyntax} Source: ${item.sourceURL} ${match.searchPhrase}\n${item.code}`;
              return {
                text: output,
                insertText: output,
                range: new vscode.Range(
                  position.translate(0, output.length),
                  position
                ),
              };
            });
          }
        } catch (err) {
          if (err instanceof Error)
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            vscode.window.showErrorMessage(err.toString());
        }
      }
      return { items };
    },
  };

  // @ts-expect-error
  vscode.languages.registerInlineCompletionItemProvider({ pattern: "**" }, provider);
}

const startChars = ["<!--", "#", "//", "/*"];
const keywords = ["find", "generate"];
const triggerKeywords = startChars.map(s => keywords.map(k => [`${s} ${k}`, `${s}${k}`])).flat(2);