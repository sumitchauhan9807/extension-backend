import { Express, Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { Admin, Chat, User } from "../../models";
import { ResponseHandler } from "../../helpers";
import { PROFILE_TYPES } from "../../types";
import userOnboarding from "../user/onboardingRouter";

class AdminController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      let response = new ResponseHandler();
      let findUser = await Admin.findOne({
        where: { username: req.body.username },
      });
      if (!findUser)
        return response.sendErroResponse(res, {
          status: 404,
          json: { message: "invalid username" },
        });

      const valid = await bcrypt.compareSync(
        req.body.password,
        findUser.password
      );
      if (!valid)
        return response.sendErroResponse(res, {
          status: 404,
          json: { message: "invalid password" },
        });

      let token = sign(
        { id: findUser.id, role: PROFILE_TYPES.ADMIN },
        "kasjdkas$%^$%&%^&jhasdjgi8237498hjsakdhfjk2893ruidkdhfjk"
      );

      return response.sendLoginSuccessResponse(res, {
        json: {
          message: "Loggedin Successfully",
          data: findUser,
          role: PROFILE_TYPES.ADMIN,
          token: token,
        },
      });
    } catch (e: any) {
      next(e.message);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      let response = new ResponseHandler();
      const hashedPassword = await bcrypt.hashSync(req.body.password, 10);
      let user = new User();
      user.username = req.body.username;
      user.name = req.body.name;
      user.password = hashedPassword;
      user.email = req.body.email;
      await user.save();
      return response.sendSuccessResponse(res, {
        json: {
          message: "User Created Successfully",
          data: user,
        },
      });
    } catch (e: any) {
      next(e.message);
    }
  }

  async updateUserLang(req: Request, res: Response, next: NextFunction) {
    try {
      let response = new ResponseHandler();
      await User.update(req.params.id, {
        langs: req.body.lang,
      });
      return response.sendSuccessResponse(res, {
        json: {
          message: "Lang Updated Successfully",
          data: true,
        },
      });
    } catch (e: any) {
      next(e.message);
    }
  }

  async updateOperationLang(req: Request, res: Response, next: NextFunction) {
    try {
      let response = new ResponseHandler();

      if (req.body.operation == "first_operation_lang") {
        await User.update(req.params.id, {
          first_operation_lang: req.body.lang,
        });
      }

      if (req.body.operation == "second_operation_lang") {
        await User.update(req.params.id, {
          second_operation_lang: req.body.lang,
        });
      }

      return response.sendSuccessResponse(res, {
        json: {
          message: "Lang Updated Successfully",
          data: true,
        },
      });
    } catch (e: any) {
      next(e.message);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      let response = new ResponseHandler();
      await User.delete(req.params.id);
      return response.sendSuccessResponse(res, {
        json: {
          message: "User Deleted Successfully",
          data: true,
        },
      });
    } catch (e: any) {
      next(e.message);
    }
  }

  async changeUserPassword(req: Request, res: Response, next: NextFunction) {
    try {
      let response = new ResponseHandler();
      let user = await User.findOne({
        where: { id: Number(req.params.id) },
      });
      if (!user) throw Error("user not found");
      const hashedPassword = await bcrypt.hashSync(req.body.password, 10);
      await User.update(req.params.id, {
        password: hashedPassword,
      });
      return response.sendSuccessResponse(res, {
        json: {
          message: "User changed Successfully",
          data: true,
        },
      });
    } catch (e: any) {
      next(e.message);
    }
  }

  async createAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("i am hereeeeeeeeee");
      const hashedPassword = await bcrypt.hashSync("admin123", 10);
      let admin = new Admin();
      admin.username = "eric";
      admin.name = "Eric Rönnau";
      admin.password = hashedPassword;
      admin.email = "eric@gmail.com";
      await admin.save();
      res.json({
        message: "success",
        data: admin,
      });
    } catch (e) {
      next(e);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      let response = new ResponseHandler();
      let allUsers = await User.find({
        relations:['chats'],
        order: {
          createdAt: "DESC",
        },
      });
      return response.sendSuccessResponse(res, {
        json: {
          message: "success",
          data: allUsers,
        },
      });
    } catch (e) {
      next(e);
    }
  }

  async getAllChats(req: Request, res: Response, next: NextFunction) {
    try {
      let response = new ResponseHandler();
      let allChats = await Chat.find({
        order: {
          createdAt: "DESC",
        },
      });
      return response.sendSuccessResponse(res, {
        json: {
          message: "success",
          data: allChats,
        },
      });
    } catch (e) {
      next(e);
    }
  }

  async getChatById(req: Request, res: Response, next: NextFunction) {
    try {
      let response = new ResponseHandler();
      let chat = await Chat.findOne({
        where:{id:Number(req.params.id)}
      });
      return response.sendSuccessResponse(res, {
        json: {
          message: "success",
          data: chat,
        },
      });
    } catch (e) {
      next(e);
    }
  }

  async updateChat(req: Request, res: Response, next: NextFunction) {
    try {
      
      let chat = await Chat.findOne({
        where:{id:Number(req.params.id)}
      });
      if (!chat) throw Error("chat not found");

      await Chat.update(req.params.id,{
        name:req.body.name,
        prompt:req.body.prompt
      })
      
      res.json({
        message: "success",
      });
    } catch (e) {
      next(e);
    }
  }

  

  async createChat(req: Request, res: Response, next: NextFunction) {
    try {
      let chat = new Chat();
      chat.name = req.body.name
      chat.prompt = req.body.prompt
      await chat.save();
      res.json({
        message: "success",
        data: chat,
      });
    } catch (e) {
      next(e);
    }
  }

  async assignChat(req: Request, res: Response, next: NextFunction) {
    try {
      
      let findUser = await User.findOne({
        relations:['chats'],
        where :{ id:req.body.userId}
      });
      if (!findUser) throw Error("user not found");

      let findChat = await Chat.findOne({
        where :{ id:req.body.chatId}
      });
      
      if (!findChat) throw Error("chat not found");

      if(findUser.chats.length == 0){ 
        findUser.chats = [findChat]
      }else {
        findUser.chats.push(findChat)
      }

      await findUser.save()
      res.json({
        message: "success",
      });
    } catch (e) {
      next(e);
    }
  }

  async huggingfaceTest(req: Request, res: Response, next: NextFunction) {
    try {
      return true;
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
}
// token: sign({ userId: fin_user?.id }, JWT_KEY!),

let adminController = new AdminController();
export default adminController;
