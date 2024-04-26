import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";

export const RawHeader = createParamDecorator((data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const rawHeaders = request.rawHeaders;
    if (!rawHeaders) throw new InternalServerErrorException('Information not found');
     
    return rawHeaders;
    }
);