import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('silver_market_currencies_data')
export class Currency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'currencies_name', length: 500 })
  currencyName: string;

  @Column({ name: 'price_value', type: 'decimal', precision: 18, scale: 8 })
  priceValue: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'source_url' })
  sourceUrl: string;

  @Column({ name: 'day_change', type: 'float' })
  dayChange: number;

  @Column({ name: 'percentage_change', type: 'float' })
  percentageChange: number;

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