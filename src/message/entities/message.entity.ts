import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, Index } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index() // Crucial for LangGraph state lookup
  @Column()
  threadId: string;

  @Column('text')
  humanMessage: string;

  @Column('text', { nullable: true }) // Nullable because AI hasn't answered yet when status is 'pending'
  aiMessage: string;

  @Column({ default: 'pending' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.messages, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: number; // Changed to number to match your User entity
}