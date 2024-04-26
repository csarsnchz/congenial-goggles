import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

import { User } from './entities/user.entity';
import { Auth, GetUser, RawHeader } from './decorators';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected/role-protected.decorator';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testProtectedRoute(
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeader() rawHeader: string[],
  ) {
    return {message: 'This is a protected route', user, userEmail, rawHeader};
  }


  @Get('private2')
  //@SetMetadata('roles', ['admin','super-user'])
  @RoleProtected(ValidRoles.ADMIN,ValidRoles.SUPER_USER)
  @UseGuards(AuthGuard(),UserRoleGuard)
  testProtectedRoute2(
    @GetUser() user: User,
  ) {
    return {message: 'This is a protected route', user};
  }

  @Get('private3')
  @Auth(ValidRoles.ADMIN,ValidRoles.SUPER_USER)
  testProtectedRoute3(
    @GetUser() user: User,
  ) {
    return {message: 'This is a protected route', user};
  }
}
