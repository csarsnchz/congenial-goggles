import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { METADATA_ROLES_KEY } from 'src/auth/decorators/role-protected/role-protected.decorator';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.get(METADATA_ROLES_KEY, context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;
    if (!user) throw new BadRequestException('User not found');
    for (let role of user.roles) {
      if (validRoles.includes(role)) return true;
    }
    throw new ForbiddenException(`User ${user.fullName} does not have the correct roles: [${validRoles}] to access this route `);
  }
}
