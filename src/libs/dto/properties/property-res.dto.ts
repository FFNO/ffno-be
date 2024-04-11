import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { Nullable } from '../common';
import { GetUnitResDto } from '../units/unit-res.dto';
import { GetMemberResDto } from '../members';

@Exclude()
export class GetPropertyResDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  type: number;

  @Expose()
  address: string;

  @Expose()
  ward: string;

  @Expose()
  district: string;

  @Expose()
  province: string;

  @Expose()
  imgUrls: string[];

  @Expose()
  details: Nullable<string>;

  @Expose()
  ownerId: Nullable<string>;

  @Expose()
  @Type(() => GetMemberResDto)
  owner: GetMemberResDto;

  @Expose()
  @Transform(({ value }) => value?.map(({ name }) => name))
  amenities: string[];

  @Expose()
  @Type(() => GetUnitResDto)
  units: GetUnitResDto[];

  @Expose()
  @Transform(
    ({ obj }) => obj.units?.filter((unit) => unit.tenants?.length).length,
  )
  occupiedCount: number;

  @Expose()
  @Transform(
    ({ obj }) => obj.units?.filter((unit) => !unit.tenants?.length).length,
  )
  vacantCount: number;
}