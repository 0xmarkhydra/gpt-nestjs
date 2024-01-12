import { Injectable } from '@nestjs/common';
import { CreateAiBotDto } from './dto/create-ai-bot.dto';
import { UpdateAiBotDto } from './dto/update-ai-bot.dto';
import OpenAI from 'openai';
import { AgentExecutor } from 'langchain/agents';
import { StructuredTool } from 'langchain/tools';
import { OpenAIAssistantRunnable } from 'langchain/experimental/openai_assistant';

import * as z from 'zod';

// class GetBalanceTool extends StructuredTool {
//   schema = z.object({
//     telegram_id: z.string().describe('The telegram id of user'),
//     symbol: z.string().describe('The symbol of a token'),
//   });
//
//   name = 'get_balance';
//
//   description = 'Get balance of a token by symbol with telegram id';
//
//   // constructor() {
//   //   super(...arguments);
//   // }
//
//   async _call(input: any) {
//     const { telegram_id, symbol } = input;
//     console.log(telegram_id);
//     console.log(symbol);
//     const result = {
//       eth: 0.1,
//       btc: 2,
//       whales: 3000,
//     };
//     return JSON.stringify({ balance: result?.[symbol?.toLowerCase()] ?? 0 });
//   }
// }

class GetPortfolioTool extends StructuredTool {
  schema = z.object({
    telegram_id: z.string().describe('The telegram id of user'),
  });

  name = 'get_portfolio';

  description = 'Get portfolio with telegram id';

  // constructor() {
  //   super(...arguments);
  // }

  async _call(input: any) {
    const { telegram_id } = input;
    console.log(telegram_id);
    const result = {
      eth: 0.1,
      btc: 2,
      whales: 3000,
    };
    return JSON.stringify(result);
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

  // constructor() {
  //   super(...arguments);
  // }

  async _call(input: any) {
    console.log(input);
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

@Injectable()
export class AiBotService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: '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',
    });
  }

  async chat(createAiBotDto: CreateAiBotDto) {
    const tools = [new GetPortfolioTool(), new SwapTokenTool()];
    const agent = await OpenAIAssistantRunnable.createAssistant({
      clientOptions: {
        apiKey: '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',
      },
      model: 'gpt-4-1106-preview',
      instructions:
        'You are Eve AI\n' +
        '    Set greeting response is I am Eve AI, Can I help you?\n' +
        "    Don't show telegram id in the response\n" +
        '\n' +
        '    You can get the balance/portfolio and swap from token A to token B with amount. ' +
        '    When the user actions swap token, you must confirm with user about input token (address), output token (address), input amount, output amount ' +
        "    When the user wants to know about balance of a token, If you don't know balance, you return 0",
      name: 'Test Weather Assistant',
      tools,
      asAgent: true,
    });
    console.log(agent.assistantId);

    // const assistant_id = 'asst_XlHbxAXfsXn2P0hbu4DaXfmt';
    // const assistant = new OpenAIAssistantRunnable({
    //   assistant_id,
    // });
    // const agent = await assistant.getAssistant();
    const agentExecutor = AgentExecutor.fromAgentAndTools({
      agent,
      tools,
    });
    const assistantResponse = await agentExecutor.invoke({
      content: createAiBotDto.question + ' (telegram id: 7382789832)',
    });
    console.log(assistantResponse);

    return assistantResponse.output;
    // question, answer
    // const question = createAiBotDto.question;
    // const assistant = await this.openai.beta.assistants.create({
    //   name: "Demo Chat",
    //   instructions:
    //     "You are a personal math tutor. Write and run code to answer math questions.",
    //   tools: [{ type: "code_interpreter" }],
    //   model: "gpt-4-1106-preview",
    // });

    // const thread = await this.openai.beta.threads.create();

    // const message = await this.openai.beta.threads.messages.create(thread.id, {
    //   role: "user",
    //   content: "I need to solve the equation `3x + 11 = 14`. Can you help me?",
    // });
    // const run = await this.openai.beta.threads.runs.create(thread.id, {
    //   assistant_id: assistant.id,
    //   instructions: "Please address the user as Mervin Praison.",
    // });

    // return this.checkStatusAndPrintMessages(thread.id, run.id);
  }

  findAll() {
    return `This action returns all aiBot`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aiBot`;
  }

  update(id: number, updateAiBotDto: UpdateAiBotDto) {
    return `This action updates a #${id} aiBot`;
  }

  remove(id: number) {
    return `This action removes a #${id} aiBot`;
  }
}
