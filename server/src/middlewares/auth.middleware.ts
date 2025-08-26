import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verify } from 'jsonwebtoken';
import { ApiError } from '../errors/api.error'
// import { IUser } from '../domain/models/user'
import { APIConfig } from '../application/config';

export const addUser = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization'];
  if (token) {
    let [_, jsonwebtoken] = token.split(' ')
    try {
      let data = verify(jsonwebtoken, APIConfig.JWT_SECRET);
      (req as any).user = data;
      //req.user = data as any;
    } catch (err) {
      throw new ApiError("Invalid token", StatusCodes.UNAUTHORIZED);
    }
  }
  // else if (!token) {
  //   (req as any).user = data;
  //   req.user = { name: 'Guest', role: 'SELLER' } as any;
  // }
  next();
};

export const expressAuthentication = (request: Request, securityName: string, scopes?: string[]): Promise<any> => {
  if (securityName === "jwt") {
    const token = request.headers["authorization"] as string;
    return new Promise((resolve, reject) => {
      console.log('////////////')
      console.log(token)
      if (!token) {
        reject(new ApiError("No token provided", StatusCodes.UNAUTHORIZED));
      }
      let [_, jsonwebtoken] = token.split(' ')
      verify(jsonwebtoken, APIConfig.JWT_SECRET, (err: any, decoded: any) => {
        if (err) {
          reject(new ApiError(err.message, StatusCodes.UNAUTHORIZED));
        } else {
          if (scopes) {
            let scope = scopes[0] as string
            let { role } = decoded as any
     
            if (scope && role != scope) {
              reject(new ApiError("JWT does not contain required scope.", StatusCodes.FORBIDDEN));
            }

          }

          resolve(decoded);
        }
      });
    });
  }

  return Promise.reject(new ApiError("unknowed authentication method", 400))
}