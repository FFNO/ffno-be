import { AuthModule } from './auth/auth.module';
import { MemberModule } from './members/member.module';
import { PropertyModule } from './properties/property.module';
import { UnitModule } from './units/unit.module';
import { EquipmentModule } from './equipments/equipment.module';

export const modules = [
  AuthModule,
  MemberModule,
  PropertyModule,
  UnitModule,
  EquipmentModule,
];
