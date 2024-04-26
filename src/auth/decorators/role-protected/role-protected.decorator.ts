import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../../interfaces';

export const METADATA_ROLES_KEY = 'roles';

export const RoleProtected = (...args: ValidRoles[]) => SetMetadata(METADATA_ROLES_KEY, args);
