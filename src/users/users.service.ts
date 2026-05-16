import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private userRepository: Repository<User>;
  constructor(
    @Inject('DATA_SOURCE')
    private dataSource: DataSource,
  ) {
    this.userRepository = this.dataSource.getRepository(User);
  }
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, username } = createUserDto;

    // 1. Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // 2. Hash Password (Salt rounds: 10 is standard)
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create and Save
    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      role: 'USER',
    });

    return await this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  
  
}
