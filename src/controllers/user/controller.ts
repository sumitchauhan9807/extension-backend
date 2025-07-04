import { Express, Request, Response, NextFunction } from "express";
import bcrypt, { compareSync } from "bcrypt";
import { sign } from "jsonwebtoken";
import { Admin, User } from "../../models";
import { ResponseHandler } from "../../helpers";
import { PROFILE_TYPES } from "../../types";
import Tesseract from "tesseract.js";

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
    let image = req.files?.image;
    console.log(image, "req.files");
    if (!image) {
      throw Error("chat not found");
    }
    //@ts-ignore
    if (!image?.data) {
    }
    console.log(image);

    // Read an image file into a Buffer
    //@ts-ignore
    const imageBuffer = image?.data;

    // Create a Tesseract worker
    const worker = await Tesseract.createWorker("eng");

    // Recognize text from the image buffer
    const {
      data: { text },
    } = await worker.recognize(imageBuffer);

    // console.log("Recognized Text:", text);

    // Terminate the worker to release resources
    await worker.terminate();

    res.json({
      text: text,
    });
  } catch (e: any) {
    next(e.message);
  }
};

export { login, getUserChats, tess };
