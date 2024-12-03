import { Request, Response } from "express";
export default function responseAPI(
  res: Response,
  code: number,
  status: boolean,
  message: string,
  body: any = {}
) {
  return res.status(code).json({
    status,
    message,
    body,
  });
}
