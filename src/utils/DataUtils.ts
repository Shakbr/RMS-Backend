import { IngredientType } from '@/models/CakeIngredient';

export class DataUtils {
  static generateUniqueBarcode(barcode: string, tin: number): string {
    return barcode + '/' + tin.toString().substring(0, 4);
  }

  static convertAmountBasedOnType(amount: number, amountType: IngredientType): number {
    switch (amountType) {
      case IngredientType.ML:
        return amount / 1000; // convert ml to l
      case IngredientType.GR:
        return amount / 1000; // convert gr to kg
      case IngredientType.COUNT:
        return amount; // count is just a number
      default:
        return amount / 1000; // default to kg
    }
  }
}
