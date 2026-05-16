import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('silver_market_bonds_data')
export class Bond {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'bonds_name', length: 500 })
  bondName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'source_url' })
  sourceUrl: string;

  @Column({ type: 'float' })
  yield: number;

  @Column({ name: 'day_change', type: 'float' })
  dayChange: number;

  @Column({ name: 'weekly_change', type: 'float' })
  weeklyChange: number;
    
  @Column({ name: 'monthly_change', type: 'float' })
  monthlyChange: number;

  @Column({ name: 'ytd_change', type: 'float' })
  ytdChange: number;

  @Column({ name: 'yoy_change', type: 'float' })
  yoyChange: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}