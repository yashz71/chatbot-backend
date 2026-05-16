import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('silver_market_commodity_data')
export class Commodity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'commodity_name', length: 500 })
  commodityName: string;

  @Column({ name: 'price_value', type: 'decimal', precision: 12, scale: 4 })
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

  @Column({ name: 'original_currency' })
  originalCurrency: string;

  @Column({ name: 'original_price', type: 'decimal', precision: 12, scale: 4 })
  originalPrice: number;

  @Column({ name: 'commodity_type' })
  commodityType: string;
  
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}