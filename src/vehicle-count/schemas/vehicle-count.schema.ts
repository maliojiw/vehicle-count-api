import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VehicleCountDocument = VehicleCount & Document;

@Schema({ timestamps: true })  
export class VehicleCount {
  @Prop({ required: true })
  vehicleType: string;

  @Prop({ required: true })
  count: number;

  @Prop({ required: true })
  timestamp: Date;
}


export const VehicleCountSchema = SchemaFactory.createForClass(VehicleCount);