import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VehicleCount, VehicleCountDocument } from '../schemas/vehicle-count.schema';
import { VehicleCountQuery } from '../interfaces/vehicle-count-query.interface';

@Injectable()
export class VehicleCountsService {
  constructor(
    @InjectModel(VehicleCount.name) private vehicleCountModel: Model<VehicleCountDocument>,
  ) {}

  async create(vehicleType: string, count: number, timestamp: Date): Promise<VehicleCount> {
    const existingRecord = await this.vehicleCountModel
      .findOne({ vehicleType, timestamp })
      .exec();

    if (existingRecord) {
      existingRecord.count += count;
      return existingRecord.save();
    } else {
      const newVehicleCount = new this.vehicleCountModel({ vehicleType, count, timestamp });
      return newVehicleCount.save();
    }
  }

  async findAll(queryParams: VehicleCountQuery): Promise<VehicleCount[]> {
    const query: Record<string, any> = {};

    if (queryParams.vehicleType) {
      query.vehicleType = queryParams.vehicleType;
    }
    if (queryParams.startDate || queryParams.endDate) {
      query.timestamp = {};
      if (queryParams.startDate) query.timestamp.$gte = queryParams.startDate;
      if (queryParams.endDate) query.timestamp.$lte = queryParams.endDate;
    }

    return this.vehicleCountModel.find(query).exec();
  }

  async getStats(queryParams: VehicleCountQuery): Promise<{ vehicleType: string; totalCount: number }[]> {
    const matchQuery: Record<string, any> = {};

    if (queryParams.startDate || queryParams.endDate) {
      matchQuery.timestamp = {};
      if (queryParams.startDate) matchQuery.timestamp.$gte = queryParams.startDate;
      if (queryParams.endDate) matchQuery.timestamp.$lte = queryParams.endDate;
    }

    return this.vehicleCountModel.aggregate([
      { $match: matchQuery },
      { $group: { _id: "$vehicleType", totalCount: { $sum: "$count" } } },
      { $project: { vehicleType: "$_id", totalCount: 1, _id: 0 } },
    ]);
  }

  async deleteById(id: string): Promise<void> {
    await this.vehicleCountModel.findByIdAndDelete(id).exec();
  }
}
