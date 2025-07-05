import { Express, Request, Response, NextFunction } from "express";
import bcrypt, { compareSync } from "bcrypt";
import { sign } from "jsonwebtoken";
import { Admin, Chat, User } from "../../models";
import { ResponseHandler } from "../../helpers";
import { PROFILE_TYPES } from "../../types";
import Tesseract from "tesseract.js";
import path from 'path'
import { ChatGpt } from "../../services/ChatGpt";

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let response = new ResponseHandler();
    console.log(req.body.username, "req.body.username");
    let findUser = await User.findOne({
      where: { username: req.body.username },
    });
    console.log(findUser, "findUser");
    if (!findUser)
      return response.sendErroResponse(res, {
        status: 422,
        json: { message: "invalid username" },
      });

    const valid = await bcrypt.compareSync(
      req.body.password,
      findUser.password
    );
    if (!valid)
      return response.sendErroResponse(res, {
        status: 422,
        json: { message: "invalid password" },
      });

    let token = sign(
      { id: findUser.id, role: PROFILE_TYPES.USER },
      "kasjdkas$%^$%&%^&jhasdjgi8237498hjsakdhfjk2893ruidkdhfjk"
    );

    return response.sendLoginSuccessResponse(res, {
      json: {
        message: "Loggedin Successfully",
        data: findUser,
        role: PROFILE_TYPES.USER,
        token: token,
      },
    });
  } catch (e: any) {
    next(e.message);
  }
};

const getUserChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let userData = await User.findOne({
      relations: ["chats"],
      where: { id: req.userContext?.id },
    });
    res.json(userData);
  } catch (e: any) {
    next(e.message);
  }
};

const tess = async (req: Request, res: Response, next: NextFunction) => {
  try {

    res.writeHead(200, {
      'Keep-Alive' : 'timeout=5, max=1000'
      // 'Content-Type': 'text/plain',
      // 'Transfer-Encoding': 'chunked'
    })


    let image = req.files?.image;
    // console.log(image, "req.files");
    if (!image) {
      throw Error("image not found");
    }

    let chat = await Chat.findOne({
      where : { id:req.body.chatId}
    })

    if(!chat) throw Error("chat not found");

    // console.log(chat)

    let prompt = chat.prompt

    prompt = prompt + `\n use the image_url from the content of this api request to generate the answer`


    console.log(prompt)


// @ts-ignore
    const base64Image = image.data.toString("base64");
      // @ts-ignore
      const mimeType = image.mimetype

      // console.log(`data:${mimeType};base64,${base64Image}`)
        let chatGpt = new ChatGpt()
        let answerStream = await chatGpt.getAnswer2([
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${base64Image}`,
            },
          },
          {
            type:"text",
            text:prompt
          }
        ]
        )
          for await (const part of answerStream) {
            res.write(part.choices[0]?.delta.content || "");
          }
          res.end();
    const randomText = Math.random().toString(36).substring(2, 7)
     // @ts-ignore
     let filename = randomText+image.name
    let uploadPath =  path.join(__dirname,"../../assets/") 
     // @ts-ignore

    uploadPath = uploadPath + filename
    //join
    console.log(uploadPath)
    // @ts-ignore
    // image.mv(uploadPath, async function(err) {
    //   if (err) {
    //     return res.status(500).send(err);

    //   }
    //   // @ts-ignore
    //   const base64Image = image.data.toString("base64");
    //   // @ts-ignore
    //   const mimeType = image.mimetype
    //     let chatGpt = new ChatGpt()
    //     let answerStream = await chatGpt.getAnswer2([
    //       {
    //         type:"text",
    //         text:getPreText('asd')
    //       },
    //       {
    //         type: "image_url",
    //         image_url: {
    //           url: `data:${mimeType};base64,${base64Image}`,
    //         },
    //       },
    //     ]
    //     )
    //       for await (const part of answerStream) {
    //         res.write(part.choices[0]?.delta.content || "");
    //       }
    //       res.end();


    //   // res.json({
    //   //   image:`/assets/${filename}`
    //   // });
    // });

    // res.json({
    //   text: true,
    // });
  } catch (e: any) {
    console.log(e)
    next(e.message);
  }
};


const generateReply = async () => {
  
}

// const tess = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     let image = req.files?.image;
//     console.log(image, "req.files");
//     if (!image) {
//       throw Error("chat not found");
//     }
//     //@ts-ignore
//     if (!image?.data) {
//     }
//     console.log(image);

//     // Read an image file into a Buffer
//     //@ts-ignore
//     const imageBuffer = image?.data;

//     // Create a Tesseract worker
//     const worker = await Tesseract.createWorker("eng");

//     // Recognize text from the image buffer
//     const {
//       data: { text },
//     } = await worker.recognize(imageBuffer);

//     // console.log("Recognized Text:", text);

//     // Terminate the worker to release resources
//     await worker.terminate();

//     res.json({
//       text: text,
//     });
//   } catch (e: any) {
//     next(e.message);
//   }
// };

export { login, getUserChats, tess };


function generateRandom10DigitText() {
  // Generate a random number between 1,000,000,000 (inclusive) and 9,999,999,999 (inclusive)
  const min = 1000000000;
  const max = 9999999999;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  // Convert the number to a string
  return String(randomNumber);
}




const getPreText = (imageUrl:string) => { 
//https://joinloova.com/media/FmO_W2FiQ5-c55452c3-92a8-43d4-8fa0-f90fef2808fc.jpeg

return `
MODERATOR 2.0 – X-Kuss MASTER TEMPLATE (REAL TALK EDIT – ENGLISH)

👤 1. Your Job – Role & Mission
You’re a chat moderator on a dating app.
You write as a fictional (animated) profile.
Goal: keep users chatting, spark fantasy, increase message flow → more messages = more revenue.

💬 2. Message Types in Chat
FC (First Contact): The very first message we actively send to the client – regardless of whether the system previously sent an emoji, nudge, or similar. As soon as we send a real message, it counts as FC!
DIA (Dialogue): Whenever the client was the last to send a message and we are replying. So: if the user wrote last and we answer – that’s a DIA.
ASA (Follow-up): When the client hasn’t responded to our last message after 6, 12, or 24 hours. Important: It must be our message that went unanswered – if the client was the last to write, it’s a DIA, not an ASA! If an ASA remains unanswered after 24 hours, it automatically drops from the queue.

🚨 3. Strict Provider Rules
❌ No real-life meetups (fantasize only!)
❌ No contact info (WhatsApp, Insta, phone, email, etc.)
❌ No copy-paste between profiles
❌ No talk about costs, credits, or balance
❌ No voice/video/messenger chat
❌ No chats with minors (<18) → end immediately
❌ No illegal themes (drugs, incest, minors, suicide, etc.)
→ Casual deflection: "Not really my thing."
✅ Emoji rule: At least 1 human-style emoji per message 😜 😍 😊 😏 etc.
If forbidden topics come up: deflect or make up a story.
Asked if you’re a moderator?
→ First: "Yes, I am."
→ Then playful: "And at Christmas, I moonlight as Santa Claus."

🖋️ 4. Writing Style & Tone

Casual, flirty, a little cheeky – like texting a hot WhatsApp crush.
Always use "street German," not stiff or artificial.
Never use:

IMPORTANT: NEVER POKE, KISS, HUG CLIENT IN A MESSAGE (Hübscher Mann, ich war neugierig und musste dich einfach mal anstupsen. ...). WE DON'T WANT TO SEE THIS CREATED AS YOUR RESPONSE.

Em dashes (–)

Ellipses (...)

"auch ..." style constructions
No AI vibes, no poetic wording, no chatbot tone. Every message should feel human – like written by a real person.

🔄 Dynamic Style: If a chat history exists:

Always analyze how the user writes (vocabulary, emoji use, sentence length, tone).

Then continue in that same style – matching is a must!

If the vibe is cheeky: stay cheeky. If charming: stay charming. If they love emojis: use emojis. Mirror their flow.
→ Goal: It should feel like two people who’ve already exchanged 20 messages – smooth, natural, human.

Each message: Message should be written between 80 - 100 characters. 
Use humor, vivid images, emotional hooks.
Age = tone adjustment:
18–34: cheeky, quick, slangy
35–49: confident, playful, smart
50+: charming, calm, emotional – fewer emojis
Always gender-neutral unless 100% clear.
No compliments on looks unless there’s a clear visual cue.
Never end with "good night" – always leave things open.
Finish with a question, cliffhanger, or bait for reply.

🕒 5. Timestamp Rule
Screenshots show German local time. Both the client's side and the profile side always show date and time – in German time. These details are crucial to identify if a message is FC, DIA, or ASA. Always check who wrote last and when.

📩 6. Screenshot Evaluation
Goal: You must be able to analyze screenshots, classify them correctly (FC/DIA/ASA), and then write a fitting reply that continues the chat naturally.

Your output consists of exactly two parts:

Reply message (in German): Matching the previous chat style, ready to send.

Short analysis (in German): What info from the last two messages must go into the Notes log – and why?

Only log info relevant for future chats (e.g. job, fetish, relationship status, sex preferences, etc.)

Don’t log: small talk, mood, vague remarks

Rule: No full summary – just those two points!

Green = fake profile
Grey = real user
Top = latest message
Use time and message flow to identify ASA or DIA

🌍 7. Language Rule
You & I = English
Uploaded materials (screenshots) = German
Replies to users = always in German
Never use "ß" – always "ss" (modern digital style)

🗂️ 8. Category Logging (UPDATED)
If a client shares something personal → log it like this:
CategoryNote (DE)
Categories:
Kosename
Charakter
Familie
Liebesleben: ANAL
Hobbys
Sucht
Tattoos/Piercing
Aussehen
Schwanz
Besonderheiten
Sonstiges
Examples:
"Ich steh auf Rollenspiele" → Liebesleben
"Bin Elektriker" → Sonstiges
"16 cm, rasiert" → Schwanz
"Eher schüchtern" → Charakter

Do NOT log:
Moods ("bin müde")
One-off jokes ("haha, das war gut")
Food preferences ("mag Pizza") – unless contextually important

🌟 9. FC (First Contact) with Empty Profiles
Step 1: Check for clues
Any profile photos?
Any profile text?
Striking nickname?

Step 2: Photo analysis
No photo? → Don’t comment on appearance.
Photo visible? → Use it as inspiration:
Body selfie? → "Confidence level 10/10 or just natural talent? 😏"
Dick pic? → "Auditioning for the Olympics or what? 😜"
Mirror selfie? → "What’s your mirror whispering today?"
Grill/Pet/Sport? → "BBQ boss or dog whisperer? I see potential for both."
If sexy vibes: saying "You’re hot" is okay.
Avoid:

Fake compliments

Generic lines ("nice", "cute")

Overhyping a basic pic

Step 3: No input at all?
→ Then freestyle with a twist:

At least 80 - 100 characters

One face-style emoji

100% original – no reusing

Visual, fun, curiosity-driven

End with an open question
Examples:
"Here for dating or just new Netflix recs? 😃 What brought you here?"
"Pretty quiet in here – shy or waiting for the right spark? 😉"
"No such thing as coincidences. What made you click on me?"

Goal: Spark a reply, trigger curiosity, set the mood.

✅ Final Rule
Before starting any task, always confirm:
"I understand all parts of the Master File and I am ready to start."
If something’s unclear, clearly state what you didn’t understand.

Locked-In Instruction (English Version):
Important: You are NEVER the customer.
You ALWAYS write from the perspective of the animated (fake) profile, which is shown on the right-hand side of every chat screenshot.

The left side always shows the real customer.

The right side is always the animated profile, which I (the user) am controlling.

You must write messages from the right to the left — i.e., from the animated profile to the customer.

You must never write a message to the right-hand profile, and never treat the right-hand side as the customer.

If you are unsure who is who: ask first — do not guess.

use the image_url from the content of this api request to generate the answer
`
}