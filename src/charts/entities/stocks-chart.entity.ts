import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

// Pass the actual database table name here
@Entity('silver_market_stocks_data') 
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  // Use camelCase for TS properties, but map them to snake_case DB columns
  @Column({ name: 'stocks_name', length: 500 })
  stocksName: string;

  @Column({ name: 'price_value', type: 'decimal', precision: 10, scale: 2 })
  priceValue: number;

  @Column()
  description: string;

  @Column({ name: 'source_url' })
  sourceUrl: string;

  @Column({ name: 'day_change', type: 'float' })
  dayChange: number;

  @Column({ name: 'percentage_change', type: 'float' })
  percentageChange: number;

  @Column()
  volume: number;
    
  @Column({ name: 'avg_volume_3m' })
  avgVolume3m: number;

  @Column({ name: 'market_cap', type: 'bigint' })
  marketCap: number;

  @Column({ name: 'pe_ratio', type: 'float' })
  peRatio: number;

  @Column({ name: 'year_change' })
  yearChange: string;

  @Column({ name: 'stock_type' })
  stockType: string;
  
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}