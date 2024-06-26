import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/config';
import { UnitResDto, UpdateUnitDto } from 'src/shared/dto';
import { PropertyService } from '../properties/property.service';

@Injectable()
export class UnitService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly propertyService: PropertyService,
  ) {}

  async getUnitOrThrow(id: string) {
    const unit = await this.prisma.unit.findUniqueOrThrow({
      where: { id },
      include: {
        unitFeatures: true,
      },
    });

    return plainToInstance(UnitResDto, unit);
  }

  async validateUnit(data: UpdateUnitDto) {
    const { propertyId, name, unitFeatures } = data;
    if (propertyId) {
      await this.propertyService.getPropertyOrThrow(propertyId);
    }
    if (unitFeatures) {
      await this.validateUnitFeatures(unitFeatures);
    }
    if (name && propertyId) {
      await this.validateUniqueUnitNameAndPropertyId(data.id, name, propertyId);
    }
  }

  private async validateUnitFeatures(features: string[]) {
    const foundFeatures = await this.prisma.unitFeature.findMany({
      where: { name: { in: features } },
    });

    if (foundFeatures.length !== features.length) {
      throw new BadRequestException(`Invalid unit features`);
    }
  }

  private async validateUniqueUnitNameAndPropertyId(
    id: string,
    name: string,
    propertyId: string,
  ) {
    const unit = await this.prisma.unit.findUnique({
      where: { name_propertyId: { name, propertyId } },
    });

    if (unit && id && unit.id !== id) {
      throw new BadRequestException(
        `Unit with name = ${name} and propertyId = ${propertyId}`,
      );
    }
  }
}
