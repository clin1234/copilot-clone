import ExtractorAbstract, { SnippetResult } from "./ExtractorAbstract";

import { parseHTML } from "linkedom";
import { FetchPageResult } from "../fetchPageContent";
import { DOMTokenList } from "linkedom/types/dom/token-list";

export default class ExtractorGithubGist extends ExtractorAbstract {

    name = "Github Gist"
    URL = "gist.github.com"

    extractSnippets = (options: FetchPageResult): SnippetResult[] => {
        const target = parseHTML(options.textContent);
        const doc = target.window.document;

        const snippet = doc.querySelector("table.highlight")?.textContent;

        if (!snippet) return [];
        //const classList: string[] = [...doc.querySelector('div[class^="type-"]').classList];
        //console.log(doc.querySelector('div[class^="type-"]'))

        const item: SnippetResult = {
            votes: parseInt(doc.querySelector(".social-count")?.textContent),
            code: cleanContent(snippet),
            sourceURL: options.url,
            hasCheckMark: false,
            language: 'test'//classList.find(e => e.includes('type-'))!.split('-')[1]
        };

        return [item];
    }
}

/**
 * Github Gist use table to display code, which produces a bunch of unnecessary characters.
 * This feature is used to them clean up
 * @param input 
 * @returns 
 */
function cleanContent(input: string) {
    return input.replace(/\n {6}\n {8}\n {8}/g, "");
}