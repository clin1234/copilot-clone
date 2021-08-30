import { FetchPageResult } from "../fetchPageContent";
import ExtractorAbstract, { SnippetResult } from "./ExtractorAbstract";
import { request } from "https";
import { parseHTML } from "linkedom";


export default class ExtractorIdeone extends ExtractorAbstract {
    URL = 'ideone.com'
    name = 'Ideone'

    extractSnippets = (options: FetchPageResult): SnippetResult[] => {
        const target = parseHTML(options.textContent);
        const doc = target.window.document;

        console.log(convertUrl(options.url));
        const result: SnippetResult = {
            /* TODO: Ideone has no equivalent of "votes", so results will only
            display when only ideone.com is chosen. */
            votes: 0,
            code: getPlainfile(options.url),
            sourceURL: options.url,
            hasCheckMark: false,
            language: 'test'//doc.querySelector('a.lang-dropdown-menu-button span').textContent
        };
        return [result];
    };
}

function getPlainfile(url: string): string {
    const req = request(convertUrl(url), res => {
        res.on('data', (d) => {console.log(d);});
    });
    req.on('error', (e: Error) => 
        console.error(`problem with request to ${convertUrl(url)}: ${e.message}`)
    );
    req.on('uncaughtException', e => console.log(e));
    const file = '';
    req.write(file);
    req.end();
    return file;
}

/**
 * Convert a Ideone URL into an URL linking to a fetchable version
 * of code.
 * @param s source Ideone URL
 * @returns converted URL
 */
function convertUrl(s: string) {
    /* NOTE: assumes URLs found through Google are in two forms:
    ideone.com/fork/<snippit id> or ideone.com/<snippid id>
    */
    if (s.includes('fork')) return s.replace('fork', 'plain');
    else {
        const last_slash = s.lastIndexOf('/');
        return s.slice(0, last_slash) + '/plain' + s.slice(last_slash);
    }
}