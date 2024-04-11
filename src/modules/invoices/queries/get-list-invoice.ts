import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/config';
import {
  GetInvoiceResDto,
  GetListInvoiceQueryDto,
  GetListResDto,
} from 'src/libs/dto';

export class GetListInvoiceQuery {
  constructor(
    public readonly staffId: string,
    public readonly data: GetListInvoiceQueryDto,
  ) {}
}

@QueryHandler(GetListInvoiceQuery)
export class GetListInvoiceHandler
  implements IQueryHandler<GetListInvoiceQuery>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    query: GetListInvoiceQuery,
  ): Promise<GetListResDto<GetInvoiceResDto>> {
    const {
      staffId,
      data: { take, skip, propertyId, unitId, status, memberId },
    } = query;

    const where: Prisma.InvoiceWhereInput = {
      status,
      memberId,
      unit: { id: unitId, property: { id: propertyId, ownerId: staffId } },
    };

    const [total, properties] = await this.prisma.$transaction([
      this.prisma.invoice.count({ where }),
      this.prisma.invoice.findMany({
        where,
        take,
        skip,
        include: {
          unit: { select: { name: true } },
          member: { select: { name: true } },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    return {
      total,
      data: plainToInstance(GetInvoiceResDto, properties),
    };
  }
}