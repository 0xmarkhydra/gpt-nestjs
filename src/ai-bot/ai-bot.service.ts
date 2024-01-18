import { Injectable } from '@nestjs/common';
import { CreateAiBotDto } from './dto/create-ai-bot.dto';
import OpenAI from 'openai';
import { AgentExecutor } from 'langchain/agents';
import { StructuredTool } from 'langchain/tools';
import { OpenAIAssistantRunnable } from 'langchain/experimental/openai_assistant';
import { GithubRepoLoader } from "langchain/document_loaders/web/github";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { PuppeteerWebBaseLoader } from "langchain/document_loaders/web/puppeteer";
import { RecursiveUrlLoader } from "langchain/document_loaders/web/recursive_url";
import { compile, convert } from "html-to-text";
import { WebBrowser } from "langchain/tools/webbrowser";
import { SerpAPI } from "@langchain/community/tools/serpapi";
import { OpenAI as ChatOpenAI } from "@langchain/openai";
import { loadSummarizationChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import * as z from 'zod';
import cheerio from 'cheerio';
import axios from 'axios';
import puppeteer from 'puppeteer';

const KEY = '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';

let data = {}

class GetPortfolioTool extends StructuredTool {
  schema = z.object({
    telegram_id: z.string().describe('The telegram id of user'),
  });

  name = 'get_portfolio';

  description = 'Get portfolio with telegram id';

  async _call(input: any) {
    const { telegram_id } = input;
    console.log(telegram_id);
    const result = {
      eth: 0.1,
      btc: 2,
      whales: 3000,
    };
    return JSON.stringify(data);
  }
}

class SwapTokenTool extends StructuredTool {
  schema = z.object({
    telegram_id: z.string().describe('The telegram id of user'),
    input_token_symbol: z.string().describe('The input token symbol'),
    output_token_symbol: z.string().describe('The output token symbol'),
    input_amount: z
      .string()
      .describe('The amount of input token that user want to swap')
      .optional(),
    output_amount: z
      .string()
      .describe('The amount of output token that user want to swap')
      .optional(),
  });

  name = 'swap_token';

  description =
    'Swap action with input token symbol, output token symbol and amount of input token symbol';

  async _call(input: any) {
    if (input.input_amount) {
      return JSON.stringify({
        ...input,
        output_amount: 0.03,
        input_token_address: '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852',
        output_token_address: '0x73f35aec10e0731826ad93f3594424016cda0f3f',
      });
    }

    if (input.output_amount) {
      return JSON.stringify({
        ...input,
        input_amount: 3,
        input_token_address: '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852',
        output_token_address: '0x73f35aec10e0731826ad93f3594424016cda0f3f',
      });
    }

    return JSON.stringify({});
  }
}

class CrawlWebTool extends StructuredTool {
  schema = z.object({
    url: z.string().describe('The URL to crawl'),
  });

  name = 'crawl_web';

  description = 'Crawl a web page and return its content';

  async _call(input: any) {
    const { url } = input;
    // const loader = new PuppeteerWebBaseLoader(url, {
    //   launchOptions: {
    //     headless: true,
    //   },
    //   gotoOptions: {
    //     waitUntil: "domcontentloaded",
    //   },
    // });
    // const docs = await loader.load();
    return JSON.stringify(data);
  }
}

@Injectable()
export class AiBotService {
  private openai: OpenAI;
  private chatOpenAI: ChatOpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: KEY,
    });

    this.chatOpenAI = new ChatOpenAI({
      configuration: {
        apiKey: KEY,
      },
      openAIApiKey: KEY
    });
  }

  async chat(createAiBotDto: CreateAiBotDto) {
    // const tools = [new GetPortfolioTool(), new SwapTokenTool()];
    const tools = [new CrawlWebTool()];

    // asst_UBfwU4ldF0s3h12yDeaWm5JX
    const agent = await OpenAIAssistantRunnable.createAssistant({
      clientOptions: {
        apiKey: KEY,
      },
      model: 'gpt-4-1106-preview',
      instructions:
        'You are Eve AI\n' +
        '    Set greeting response is I am Eve AI, Can I help you?\n' +
        "    Don't show telegram id in the response\n" +
        '    You can get the balance/portfolio and swap from token A to token B with amount. ' +
        '    When the user actions swap token, you must confirm with user about input token (address), output token (address), input amount, output amount ' +
        "    When the user wants to know about balance of a token, If you don't know balance, you return 0",
      name: 'Test Weather Assistant',
      tools,
      asAgent: true,
      fileIds: [],
    });

    const agentExecutor = AgentExecutor.fromAgentAndTools({
      agent,
      tools,
    });

    const assistantResponse = await agentExecutor.invoke({
      content: createAiBotDto.question + ' (telegram id: 7382789832)',
    });

    return assistantResponse.output;
  }

  async chatByKeyAssistant(createAiBotDto: CreateAiBotDto) {
    const tools = [new GetPortfolioTool(), new SwapTokenTool()];

    const assistant = new OpenAIAssistantRunnable({
      assistantId: 'asst_39pOByzbsVVrgBUOs4hdlInS',
      clientOptions: {
        apiKey: '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',
      },
      asAgent: true,
    });

    // const assistantResponse = await assistant.getAssistant();

    const assistantResponse = await assistant.invoke({
      content: createAiBotDto.question,
      thread_id: 'thread_nO9WVqj4kWVwGknlj86VFZ3V', // Use the stored threadId
    });

    console.log('assistantResponse: ', assistantResponse);
    // assistantResponse:  [
    //   {
    //     id: 'msg_SgxooaqVvFcME9H45mObNCye',
    //     object: 'thread.message',
    //     created_at: 1705481540,
    //     thread_id: 'thread_nO9WVqj4kWVwGknlj86VFZ3V',
    //     role: 'assistant',
    //     content: [ [Object] ],
    //     file_ids: [],
    //     assistant_id: 'asst_39pOByzbsVVrgBUOs4hdlInS',
    //     run_id: 'run_xDuVB6KBkhf0xMI5BSAZRvLr',
    //     metadata: {}
    //   }
    // ]
    // return assistantResponse.output;
    return assistantResponse;
  }

  async createNewThread() {
    const thread = await this.openai.beta.threads.create();
    return thread;
  }

  async chatByKeyAssistantV2(createAiBotDto: CreateAiBotDto) {
    const { thread_id, question } = createAiBotDto;
    // const tools = [new GetPortfolioTool(), new SwapTokenTool()];
    const tools = [new CrawlWebTool()];

    const agent = new OpenAIAssistantRunnable({
      assistantId: 'asst_39pOByzbsVVrgBUOs4hdlInS',
      clientOptions: {
        apiKey: KEY,
      },
      asAgent: true,
    });


    const agentExecutor = AgentExecutor.fromAgentAndTools({
      agent,
      tools,
    });

    let threadId = thread_id;
    if (!threadId) {
      const { id } = await this.createNewThread();
      threadId = id
    }

    const assistantResponse = await agentExecutor.invoke({
      content: question,
      threadId: threadId,
      model: 'gpt-4-1106-preview',
      instructions: "Thư ký tài chính của các nhà đầu tư",
      name: 'Test Weather Assistant',
    });

    return assistantResponse;
  }

  async crawlWeb(url = 'https://langchain.com') {
    const loader = new CheerioWebBaseLoader(url);

    const docs = await loader.load();
    // const docsHTML = await loader.load();
    // const docs = docsHTML.map((item) => ({...item, pageContent: convert(item.pageContent)}))
    console.log(docs);
    data = docs;
    return docs;
  }
  async crawlWebText(url = 'https://langchain.com') {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const textContent = $('body').text();
    console.log(textContent);
    return textContent;
  }

  async crawlWebPuppeteer(url = 'https://langchain.com') {
    const loaderWithOptions = new PuppeteerWebBaseLoader(
      url,
      {
        launchOptions: {
          headless: "new", // Use the new headless mode
        },
        gotoOptions: {
          waitUntil: "domcontentloaded",
        },
        async evaluate(page, browser) {
          try {
            const page = await browser.newPage();
            await page.goto(url, { waitUntil: 'networkidle0' });
      
            // Wait for the page to fully render
            await page.waitForTimeout(1000);
      
            const htmlContent = await page.content();
            const pageContent = await page.evaluate(() => {
              return document.body.innerText;
            });
    
            return pageContent;
          } catch (error) {
            console.error('[ERROR crawlWebApp]:', error);
          } finally {
            await browser.close();
          }
        },
      }
    );
    const docsFromLoaderWithOptions = await loaderWithOptions.load();

    data = docsFromLoaderWithOptions;

    return docsFromLoaderWithOptions;
  }

  async crawlWebApp(
    url: string,
    type: 'html' | 'txt' = 'txt',
  ): Promise<string> {
    const browser = await puppeteer.launch({
      headless: 'new', // Use the headless mode
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    try {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle0' });

      // Wait for the page to fully render
      await page.waitForTimeout(1000);

      const htmlContent = await page.content();
      if (type === 'txt') {
        // await page.waitForSelector('.example-class');
        const pageContent = await page.evaluate(() => {
          return document.body.innerText;
        });

        return pageContent;
      }
      return htmlContent;
    } catch (error) {
      console.error('[ERROR crawlWebApp]:', error);
    } finally {
      await browser.close();
    }
  }

  async crawGitbook(url: string) {
    const loader = new GithubRepoLoader(
      url,
      {
        branch: "main",
        recursive: false,
        unknown: "warn",
        maxConcurrency: 5, // Defaults to 2
      }
    );
    const docs = await loader.load();
    return docs
  };

  async crawRecursiveUrlLoader(url: string) {
    const loader = new GithubRepoLoader(
      url,
      {
        branch: "main",
        recursive: false,
        unknown: "warn",
        maxConcurrency: 5, // Defaults to 2
      }
    );
    const docs = await loader.load();
    return docs
  };


  async summarize(url = "https://whales.market/") {
    // const text = fs.readFileSync(url, "utf8");
    const data: any = await this.crawlWebPuppeteer(url);
    const model = new ChatOpenAI({
      openAIApiKey: "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",
      temperature: 0
    });
    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });

    const dataTxt = data.map(item => item.pageContent);

    const docs = await textSplitter.createDocuments(dataTxt);

    const chain = loadSummarizationChain(model, {
      type: "map_reduce",
      returnIntermediateSteps: true,
    });
    const res = await chain.call({
      input_documents: docs,
    });

    return res;
  }
}
