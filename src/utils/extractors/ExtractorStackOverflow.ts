import ExtractorAbstract, { SnippetResult } from "./ExtractorAbstract";

import { NodeList, parseHTML } from "linkedom";
import { isCodeValid } from "./utils";
import { FetchPageResult } from "../fetchPageContent";
import { Element } from "linkedom/types/interface/element";

export default class ExtractorStackOverflow extends ExtractorAbstract {

    name = "Stackoverflow"
    URL = "stackoverflow.com";

    extractSnippets = (options: FetchPageResult): SnippetResult[] => {
        const target = parseHTML(options.textContent);
        const doc = target.window.document;
        const answerQueries: NodeList = doc.querySelectorAll(".answer");
        
        const answersWithCodeBlock: Element[] = [...answerQueries]
            .filter((item: Element) => item.querySelector("code") != null);

        //const classList: string[] = [...doc.querySelector('code[class^="language-"]').classList];

        const results = answersWithCodeBlock
            .map((item: any) => ({
                textContent: item.textContent,
                votes: parseInt(item.querySelector(".js-vote-count").textContent),

                // TODO: Handle answers with more than one code block
                // p/s: they often about explaining the something
                code: item.querySelector("code").textContent,
                sourceURL: `https://${this.URL}${item.querySelector(".js-share-link").href}`,
                hasCheckMark: item.querySelector("iconCheckmarkLg") != null,
                language: 'test'//classList.find(e => e.includes('language-'))!.split('-')[1]
            }) as SnippetResult)
            .filter(item => isCodeValid(item.code));


        results.sort(sortSnippetResultFn);

        return results;
    }
}

function sortSnippetResultFn(a: SnippetResult, b: SnippetResult) {

    if (a.hasCheckMark != b.hasCheckMark) {
        return a.hasCheckMark ? 1 : -1;
    }

    const result = b.votes - a.votes;
    return result === 0 ? b.code.length - a.code.length : result;
}
