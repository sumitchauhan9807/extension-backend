import OpenAI from "openai";
import { GPT_SECRET } from "../constants";
export class ChatGpt {
  private openAI: any;
  constructor() {
    this.openAI = new OpenAI({
      apiKey: GPT_SECRET,
    });
  }

  async getAnswer(question: string) {
    try {
      const chatCompletionStream =
        await this.openAI.beta.chat.completions.stream(
          {
            messages: [{ role: "user", content: question }],
            model: "gpt-4",
            stream: true,
          },
          { responseType: "stream" }
        );
      return chatCompletionStream;
    } catch (e: any) {
      throw Error(e);
    }
  }

  async getAnswer2(question: object[]) {
    try {
      const chatCompletionStream =
        await this.openAI.beta.chat.completions.stream(
          {
            messages: [{ role: "user", content: question }],
            model: "gpt-4o",
            stream: true,
          },
          { responseType: "stream" }
        );
      return chatCompletionStream;
    } catch (e: any) {
      throw Error(e);
    }
  }

  async getAnswer3(question: object[]) {
    try {
      // @ts-ignore
      // console.log(question[0].text)
      // @ts-ignore
      // console.log(question[2].retryText)

      const messages = [
        {
          role: "system",
          // @ts-ignore
          content: [{ type: "text", text: question[0].text }],
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                // @ts-ignore
                url: question[1]?.image_url.url, // public HTTPS URL
              },
            },
          ],
        },
      ]
      
      messages.push({
        "role": "user",
      // @ts-ignore
        "content": "Continue this fictional chat between two people:\nUser: 'Was wenn wir uns wirklich mal sehen? 😏'\nCharacter: [Your reply here]"
      })
      // @ts-ignore
      if(question[2].history) {
      // @ts-ignore
        question[2].history.forEach(thread => {
          messages.push({
            "role": "user",
          // @ts-ignore
            "content": thread
          })
        });
      }
     
      console.log(messages)
      const response = await this.openAI.chat.completions.create({
        model: "gpt-4o",
        messages: messages
      });
      console.log(response.choices[0]);
      return response.choices[0];
    } catch (e: any) {
      throw Error(e);
    }
  }
}

// Rephrase this text concisely in casual, flirty, fluent, and colloquial ${lang} in a younger tone. The message should not use any honorific form of addressing such as Sie. Include emojis where relevant. If the text contains terms of endearment, please use only schatz in the german text. Please do not use any word relevant to 'Verbindung'. Use gender neutral messages.
export const PRE_TEXTS = {
  TRANSLATE: "Translate this into",
  getRephraseText: (lang: string, text: string) => {
    let nativeSpeakers;
    if (lang == "german") {
      nativeSpeakers = "germans";
    } else if (lang == "hindi") {
      nativeSpeakers = "indians";
    }
    return `Rephrase this text concisely into conversational, fluent, colloquial, and natural ${lang} : ${text} . The original literal meaning should be rephrased as close to the original literal meaning as possible unless keeping the literal reference will result in unnatural ${lang} text. The tone, style, and choice of expression should be the way how 30-40 years old native ${nativeSpeakers} speak, never in a style that is for teenagers. Include emoji wherever relevant but do not replace the word with emoji. Please avoid using any word relevant to 'Verbindung'. please avoid adding terms of endearment. If there is any form of endearments please rendered the terms of endearment as 'schatz'. Use emojis only at the end of the sentence.`;
  },
};
export class PreTexts {
  private operation: string;
  private lang: string;

  constructor(operation: string, lang: string = "english") {
    this.operation = operation;
    this.lang = lang;
  }
  getPreText(text: string) {
    if (this.operation == "TRANSLATE") {
      return `${PRE_TEXTS.TRANSLATE} ${this.lang} : ${text}`;
    }
    if (this.operation == "RE_PHRASE") {
      return `${PRE_TEXTS.getRephraseText(this.lang, text)}`;
    }
  }
}
