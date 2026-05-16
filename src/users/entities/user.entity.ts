import { Entity, Column, PrimaryGeneratedColumn,OneToMany } from 'typeorm';
import { Message } from 'src/message/entities/message.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: string;

  // Add this to link to messages
  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];
}