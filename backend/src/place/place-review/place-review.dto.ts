import { IsNumber, Max, Min, IsString } from 'class-validator';

export class PlaceReviewDto {
  @IsNumber()
  @Min(1, { message: 'Rating minimal 1' })
  @Max(5, { message: 'Rating maksimal 5' })
  star: number;

  @IsString({ message: 'Review arus ada' })
  review: string;

  @IsString({ message: 'Tempat makan diperlukan' })
  placeId: string;
}
