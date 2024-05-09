import { IsString, Max, Min, IsNumber } from 'class-validator';
export class MenuReviewDto {
  @IsNumber()
  @Min(1, { message: 'Rating minimal 1' })
  @Max(5, { message: 'Rating maksimal 5' })
  star: number;

  @IsString({ message: 'Review arus ada' })
  review: string;

  @IsString({ message: 'Tempat makan diperlukan' })
  menuId: string;
}
