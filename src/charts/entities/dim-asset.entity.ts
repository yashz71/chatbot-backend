import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { FactMarketHistory } from './fact-market-history.entity';

@Entity({ schema: 'gold', name: 'dim_asset' })
export class DimAsset {
  @PrimaryGeneratedColumn({ name: 'asset_key' })
  assetKey: number;

  @Column({ name: 'asset_name', length: 100 })
  assetName: string;

  @Column({ name: 'asset_type', length: 20 })
  assetType: string;

  @Column({ name: 'base_currency', length: 10, default: 'USD' })
  baseCurrency: string;

  // One Asset has Many Historical Prices
  @OneToMany(() => FactMarketHistory, (fact) => fact.asset)
  facts: FactMarketHistory[];
}