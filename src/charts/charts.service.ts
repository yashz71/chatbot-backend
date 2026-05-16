import { Injectable, Inject } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateChartDto } from './dto/create-chart.dto';
import { UpdateChartDto } from './dto/update-chart.dto';
import { Bond } from './entities/bonds-chart.entity';
import { Commodity } from './entities/commodity-chart.entity';
import { Currency } from './entities/currencies-chart.entity';
import { Stock } from './entities/stocks-chart.entity';
import { FactMarketHistory } from './entities/fact-market-history.entity';

@Injectable()
export class ChartsService {
  constructor(
    @Inject('DATA_SOURCE_CHARTS')
    private dataSource: DataSource,
  ) {}
  async getMarketOverview(timeframe: string = '1w') {
    // We use Promise.all to fetch from all tables concurrently for performance
    const [stocks, currencies, commodities, bonds] = await Promise.all([
      this.fetchAssetHistory('stock', timeframe),
      this.fetchAssetHistory('currency', timeframe),
      this.fetchAssetHistory('commodity', timeframe),
      this.fetchAssetHistory('bond', timeframe),
    ]);
    return { stocks, currencies, commodities, bonds };
  }
  private async fetchAssetHistory(assetType: string, timeframe: string) {
    const query = this.dataSource.getRepository(FactMarketHistory)
      .createQueryBuilder('fact')
      .innerJoinAndSelect('fact.asset', 'asset')
      .where('LOWER(asset.assetType) = LOWER(:assetType)', { assetType })
      .orderBy('fact.createdAt', 'DESC');

    // 1. Calculate the starting date based on the timeframe
    const startDate = this.getStartDate(timeframe);
    
    // 2. Apply the Date Filter (if not 'all')
    if (startDate) {
      query.andWhere('fact.createdAt >= :startDate', { startDate });
    } else {
      query.take(1000); // Safety limit for 'ALL' so you don't crash the browser
    }

    const facts = await query.getMany();

    return facts.reverse().map(fact => ({
      id: Number(fact.factKey),
      asset_name: fact.asset.assetName, 
      price_value: Number(fact.priceValue),
      created_at: fact.createdAt, 
      asset_type: fact.asset.assetType
    }));
  }

  // Helper method to calculate the date in the past
  private getStartDate(timeframe: string): Date | null {
    const date = new Date();
    switch (timeframe.toLowerCase()) {
      case '1d': date.setDate(date.getDate() - 1); break;
      case '1w': date.setDate(date.getDate() - 7); break;
      case '1m': date.setMonth(date.getMonth() - 1); break;
      case '1y': date.setFullYear(date.getFullYear() - 1); break;
      case 'all': return null;
      default: date.setDate(date.getDate() - 7); // Default to 1 week
    }
    return date;
  }

  findAll() {
    return `This action returns all charts`;
  }


 
}
