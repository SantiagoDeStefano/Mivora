import { Router } from "express";
import { wrapRequestHandler } from "~/utils/handlers";

const usersRoute = Router()

usersRoute.post('/signup',
  wrapRequestHandler(signUpController)
)