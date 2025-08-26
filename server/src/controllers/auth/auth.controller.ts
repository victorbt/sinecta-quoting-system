
// import { StatusCodes } from 'http-status-codes';
import { Inject } from 'typescript-ioc';
import {
    Body,
    Controller,
    Route,
    Post,
    Header,
    SuccessResponse,
    Security,
    // Example,
    Tags
} from 'tsoa';
import { z } from 'zod';

import { IUser } from '../../domain/models';
import { User } from '../../database/entities';
// import { UsersService } from '../../services/user';

import { AuthService } from '../../services/auth/auth.service';
// import { fakeUsers } from "../../../tests/fixtures/user.fixture";

const LoginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });
//const RefreshSchema = z.object({ refreshToken: z.string().min(10) });

@Route('/api/v1/auth')
@Tags('Auth')
export class AuthController extends Controller {
    @Inject private svc: AuthService

    @Post('/signin')
    @SuccessResponse("200", "OK")
    @Tags('Signin')
    public async signin(
        @Header('authorization') header: string,
    ): Promise<{
        data: {
            accessToken: string;
            refreshToken: string;
        }
    }> {
        let [_, authString] = header.split(' ')
        let credentials = Buffer.from(authString, 'base64').toString()
        let [email, password] = credentials.split(':')
        const parsed = LoginSchema.parse({ email, password });
        return { data: await this.svc.login(parsed.email, parsed.password) }
    }

    // @Post('/create')
    // @SuccessResponse('201', 'Created')
    // @Tags('Signup')
    // @Security('jwt',['ADMIN'])
    // // @Example<{ data: IUser }>(
    // //     { data: fakeUsers(1)[0] }
    // // )
    // public async signup(
    //     @Body() user: Omit<IUser, 'id' | 'createdAt' | 'updatedAt' | 'userType'>,
    // ): Promise<{ data: Omit<User, 'password'> }> {
    //     this.setStatus(StatusCodes.CREATED);
    //     try {
    //         let u = await this._usersService.insertUser(user as User)
    //         return { data: u as Omit<User, 'password'> };
    //     }
    //     catch (e) {
    //         throw e
    //     }
    // }

    //   @Post('refresh')
    //   public async refresh(@Body() body: unknown) {
    //     const parsed = RefreshSchema.parse(body);
    //     return this.svc.refresh(parsed.refreshToken);
    //   }

}







