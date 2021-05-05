import { Request, Response } from "express";
import AuthUser from "../schemas/authUser";
import bcrypt from "bcryptjs"
import { userInfo } from "node:os";
import jwt from "jsonwebtoken"

import * as dotenv from "dotenv";
dotenv.config()

const objectName = "user";

type mongoHandler = (req: Request, res: Response) => void
enum responseEnum {
    successLogin = 0,
    emailAlreadyRegistered,
    emailNotRegistered,
    passwordMismatch
}

function makeResponseObject(code: number, text: string) {
    return { code: code, text: text }
}

/** Construct return codes and error messages here */
const getErrorCodes = (errType: responseEnum) => {
    switch (errType) {
        case responseEnum.successLogin: return makeResponseObject(200, "Login Successful !")
        case responseEnum.emailAlreadyRegistered: return makeResponseObject(400, "Email already registered.")
        case responseEnum.emailNotRegistered: return makeResponseObject(404, "Email not registered.")
        case responseEnum.passwordMismatch: return makeResponseObject(400, "Password/Email is Incorrect.")
        default: return makeResponseObject(400, "Unknown Error Occured")
    }
}

// - GET - /books
export let allUsers: mongoHandler = (req, res) => {
    let users = AuthUser.find((err, books) => {
        res.send(err ? err : books);
    });
};

// - GET - /book/:id
export let getBook: mongoHandler = (req, res) => {
    AuthUser.findById(req.params.id, (err, book) => {
        res.send(err ? err : book);
    });
};

// - POST - /register -- Register User
export let registerUser: mongoHandler = async (req, res) => {
    const { name, email, password } = req.body

    const emailExists = await AuthUser.findOne({ email: email })

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (emailExists) {
        const { code, text } = getErrorCodes(responseEnum.emailAlreadyRegistered)
        return res.status(code).send(text)
    }
    else {
        try {
            const user = new AuthUser({
                name: name,
                email: email,
                password: hashedPassword
            })

            const savedUser = await user.save();
            res.send(savedUser)
        } catch (err) {
            res.status(400).send(err)
        }
    }
}

// - POST - /login
export let userLogin: mongoHandler = async (req, res) => {
    const { email, password } = req.body;
    const emailExist: any = await AuthUser.findOne({ email: email })
    if (!emailExist) {
        const { code, text } = getErrorCodes(responseEnum.emailNotRegistered)
        return res.status(code).send(text)
    } else {
        // Check the password and then grant/revoke entry
        const validPass = await bcrypt.compare(password, emailExist.password);
        if (!validPass) {
            const { code, text } = getErrorCodes(responseEnum.passwordMismatch)
            return res.status(code).send(text)
        }

        // Create and assing JWT
        const token = jwt.sign({ _id: emailExist._id }, process.env.JWT_PRIVATE_KEY)
        const { code, text } = getErrorCodes(responseEnum.successLogin)
        return res.status(code).header("Authorization", token).send({ token: token })
    }
}


// - PUT - /user
export let addBook: mongoHandler = (req, res) => {
    let book = new AuthUser(req.body);
    book.save((err) => {
        res.send(err ? err : book);
    });
};

// - DELETE - /user/remove/:id
export let removeUserByID: mongoHandler = (req, res) => {
    const { id } = req.body

    AuthUser.deleteOne({ _id: id }, (err) => {
        res.send(err ? err : `Successfully deleted ${objectName}`);
    });
};

// - DELETE - /user/:id
export let removeUserByMail: mongoHandler = (req, res) => {
    const { id } = req.body

    AuthUser.deleteOne({ _id: id }, (err) => {
        res.send(err ? err : `Successfully deleted ${objectName}`);
    });
};


// - POST - /user/:id
export let updateBook: mongoHandler = (req, res) => {
    AuthUser.findByIdAndUpdate(req.params.id, req.body, (err, book) => {
        res.send(err ? err : `Successfully updated ${objectName}`);
    });
};
