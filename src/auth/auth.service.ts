import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save(user);
       return {...user,token: this.getJwtToken({email: user.email, id: user.id})}; 
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto){
    try {
      const { password, email } = loginUserDto;
      const user = await this.userRepository.findOne({ 
        where: {email},
        select: {email: true, password: true, id: true}
      });
      if (!user) {
        throw new UnauthorizedException('Invalid email');
      }
      if (!bcrypt.compareSync(password, user.password)) {
        throw new UnauthorizedException('Invalid password');
      }
      return {...user,token: this.getJwtToken({email: user.email, id: user.id})};
    } catch (error) {
      this.handleErrors(error);
    }
  
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
  
  private handleErrors(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    throw new InternalServerErrorException('Internal Server Error');
  }
}
