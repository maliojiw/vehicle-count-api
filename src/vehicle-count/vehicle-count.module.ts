import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VehicleCountsService } from './service/vehicle-count.service';
import { VehicleCountsController } from './controllers/vehicle-count.controller';
import { VehicleCount, VehicleCountSchema } from './schemas/vehicle-count.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: VehicleCount.name, schema: VehicleCountSchema }])],
  providers: [VehicleCountsService],
  controllers: [VehicleCountsController],
})
export class VehicleCountsModule {}