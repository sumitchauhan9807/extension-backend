import  { Express,Request,Response,NextFunction } from "express";
import {ChatGpt,PreTexts} from '../../services/ChatGpt'

const translator = async (req:Request,res:Response,next:NextFunction) => {
  try {
    res.writeHead(200, {
      'Keep-Alive' : 'timeout=5, max=1000'
      // 'Content-Type': 'text/plain',
      // 'Transfer-Encoding': 'chunked'
    })
    let chatGpt = new ChatGpt()
    // @ts-ignore
    let preTexts = new PreTexts(req.body.operation,req.body.language)
    let pretext = preTexts.getPreText(req.body.text)
    if(!pretext) throw Error("Please send correct pre text")
    console.log(pretext)
    let answerStream = await chatGpt.getAnswer(pretext)
    for await (const part of answerStream) {
      res.write(part.choices[0]?.delta.content || "");
    }
    res.end();
  }catch(e:any) {
    next(e.message)
  }
}

const translator2 = (req:Request,res:Response,next:NextFunction) => {
  try {
    
  }catch(e) { 
    next(e)
  }
}

const test1 = (req:Request,res:Response) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Transfer-Encoding': 'chunked',
    'X-Content-Type-Options': 'nosniff'
  });
 
  const interval = setInterval(() => {
    const data1 = Math.random().toString(36).substring(2, 8);
    const data2 = Math.random().toString(36).substring(2, 8);
    res.write(`${data1} ${data2}`);
  }, 100);
 
  setTimeout(() => {
    clearInterval(interval);
    res.end();
  }, 10000/5);
}

const streamTest = async (req:Request,res:Response,next:NextFunction) => {
  // res.writeHead(200, {
  //   'Content-Type': 'text/plain',
  //   'Transfer-Encoding': 'chunked'
  // })
  let chatGpt = new ChatGpt()
  let answerStream = await chatGpt.getAnswer(`translate this into hindi : Rajneesh also known as Acharya Rajneesh, Bhagwan Shree Rajneesh, and later as Osho was an Indian Godman, philosopher, mystic, and founder of the Rajneesh`)
  for await (const part of answerStream) {
    // here express will stream the response
    console.log("chunkk")
    res.write(part.choices[0]?.delta.content || "");
  }
  // here express sends the closing/done/end signal for the stream consumer
  res.end();
}

const langTest = async (req:Request,res:Response,next:NextFunction) => {
  let chatGpt = new ChatGpt()

  let answerStream = await chatGpt.getAnswer(`what is the language of following text , answer in one word : ${req.body.text}`)
  console.log(answerStream)
  for await (const part of answerStream) {
    // here express will stream the response
    // console.log(part.choices[0]?.delta.content,"sending readable stream")
    res.write(part.choices[0]?.delta.content || "");
  }
  // here express sends the closing/done/end signal for the stream consumer
  console.log("streaming end")
  res.end();
  // res.send(req.body.text)
}
export  {
  translator,
  streamTest,
  test1,
  langTest
}
