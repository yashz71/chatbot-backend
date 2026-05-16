import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DimAsset } from './dim-asset.entity';

@Entity({ schema: 'gold', name: 'fact_market_history' })
export class FactMarketHistory {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'fact_key' })
  factKey: string;

  @Column({ name: 'asset_key' })
  assetKey: number;

  // The Join to the Dimension table
  @ManyToOne(() => DimAsset, (asset) => asset.facts)
  @JoinColumn({ name: 'asset_key' })
  asset: DimAsset;

  @Column({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  // TypeORM returns numeric as string to preserve precision. We will parse it in the service.
  @Column({ name: 'price_value', type: 'numeric', precision: 18, scale: 4 })
  priceValue: string;

  @Column({ name: 'day_change_pct', type: 'numeric', precision: 10, scale: 4, nullable: true })
  dayChangePct: string;
}