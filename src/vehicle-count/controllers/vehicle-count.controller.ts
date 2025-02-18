import { Controller, Get, Post, Delete, Param, Body, Query } from '@nestjs/common';
import { VehicleCountsService } from '../service/vehicle-count.service';
import { VehicleCountQuery } from '../interfaces/vehicle-count-query.interface'; 

@Controller('vehicle-counts')
export class VehicleCountsController {
  constructor(private readonly vehicleCountsService: VehicleCountsService) {}

  @Post()
  async create(
    @Body() createVehicleCountDto: { vehicleType: string; count: number; timestamp: Date },
  ) {
    return this.vehicleCountsService.create(
      createVehicleCountDto.vehicleType,
      createVehicleCountDto.count,
      createVehicleCountDto.timestamp,
    );
  }

  @Get()
  async findAll(
    @Query('vehicleType') vehicleType?: string,
    @Query('startDate') startDate?: string, 
    @Query('endDate') endDate?: string,    
  ) {
    const query: VehicleCountQuery = {
      vehicleType,
      startDate: startDate ? new Date(startDate) : undefined, 
      endDate: endDate ? new Date(endDate) : undefined,       
    };
    return this.vehicleCountsService.findAll(query);
  }

  @Get('stats')
  async getStats(
    @Query('startDate') startDate?: string, 
    @Query('endDate') endDate?: string,     
  ) {
    const query: VehicleCountQuery = {
      startDate: startDate ? new Date(startDate) : undefined, 
      endDate: endDate ? new Date(endDate) : undefined,       
    };
    return this.vehicleCountsService.getStats(query);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.vehicleCountsService.deleteById(id);
  }
}
