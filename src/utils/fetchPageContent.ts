import fetch from "node-fetch";

export interface FetchPageResult {
    textContent: string,
    url: string
}

export function fetchPageTextContent(url: string): Promise<FetchPageResult> {
    return new Promise((resolve, reject) => {
        void (async () => {
            return fetch(url)
                .then(rs => rs.text())
                .then(textContent => { resolve({ textContent, url }); })
                // eslint-disable-next-line @typescript-eslint/use-unknown-in-catch-callback-variable
                .catch(reject);
        })();
    });
}