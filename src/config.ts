import * as vscode from "vscode";

export const CSConfig = {
  SEARCH_PATTERN:
    /(\/\/|#|--|\/\*|<!--)\s?(find|generate|gen)\s?(.+)\s?(\.|-->|\*\/)/,
};

export function getSearchURL(site: string, keyword: string) {
  return `https://www.google.com/search?q=site%3A${site}+${keyword.replace(
    /\s/g,
    "+"
  )}`;
}

interface IConfig {
  settings: {
    sites: Record<string, boolean>;
    maxResults: number;
    OpenAI?: { apiKey: string; model: string; systemPrompt?: string };
    OpenRouter?: { apiKey: string; model: string };
    ai?: {
      temperature?: number;
      systemPrompt?: string;
    };
  };
}

export function getConfig() {
  const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("captainStack.settings");

  const sites: Record<string,boolean> = {
    "stackoverflow.com": config.get("sites.stackoverflow")!,
    "gist.github.com": config.get("sites.githubGist")!,
    "openai.com": config.get("sites.OpenAI")!,
    "openrouter.ai": config.get("sites.OpenRouter")!,
  };

  return {
    settings: {
      sites,
      maxResults: config.get("maxResults"),
      OpenAI: config.get("OpenAI"),
      OpenRouter: config.get("OpenRouter"),
      ai: config.get("ai"),
    },
  } as IConfig;
}

export default CSConfig;
