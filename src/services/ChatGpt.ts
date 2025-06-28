import OpenAI from "openai";
import {GPT_SECRET} from '../constants'
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
            model: "gpt-3.5-turbo",
            stream: true,
          },
          { responseType: "stream" }
        );
      return chatCompletionStream;
    } catch (e: any) {
      throw Error(e);
    }
  }
}
// Rephrase this text concisely in casual, flirty, fluent, and colloquial ${lang} in a younger tone. The message should not use any honorific form of addressing such as Sie. Include emojis where relevant. If the text contains terms of endearment, please use only schatz in the german text. Please do not use any word relevant to 'Verbindung'. Use gender neutral messages.
export const PRE_TEXTS = {
  TRANSLATE: "Translate this into",
  getRephraseText:(lang:string,text:string)=>{
    let nativeSpeakers;
    if(lang == 'german') {
      nativeSpeakers = 'germans'
    }else if(lang == 'hindi') {
      nativeSpeakers = 'indians'
    }
    return `Rephrase this text concisely into conversational, fluent, colloquial, and natural ${lang} : ${text} . The original literal meaning should be rephrased as close to the original literal meaning as possible unless keeping the literal reference will result in unnatural ${lang} text. The tone, style, and choice of expression should be the way how 30-40 years old native ${nativeSpeakers} speak, never in a style that is for teenagers. Include emoji wherever relevant but do not replace the word with emoji. Please avoid using any word relevant to 'Verbindung'. please avoid adding terms of endearment. If there is any form of endearments please rendered the terms of endearment as 'schatz'. Use emojis only at the end of the sentence.`
  } ,
};
export class PreTexts {
  private operation: string;
  private lang: string;

  constructor(operation: string,lang:string = 'english') {
    this.operation = operation;
    this.lang = lang
  }
  getPreText(text:string) {
    if(this.operation == 'TRANSLATE') {
      return `${PRE_TEXTS.TRANSLATE} ${this.lang} : ${text}`
    }
    if(this.operation == 'RE_PHRASE') {
      return `${PRE_TEXTS.getRephraseText(this.lang,text)}`
    }
  }
}
