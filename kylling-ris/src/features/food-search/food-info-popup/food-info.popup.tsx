import appropriateUnit from "../../misc/appropriate-unit";
import styles from "./food-info-popup.module.css";
import { Dialog } from "primereact/dialog";
import { useExpandedFoodInfo } from "./use-expanded-food-info";
import FoodInfo from "../search-results/food-info";

interface FoodInfoPopupProps {
  food: FoodInfo;
  open: boolean;
  onClose: () => void;
}

export default function FoodInfoPopup({
  food,
  open,
  onClose
}: FoodInfoPopupProps) {
  const { data, loading } = useExpandedFoodInfo(food.id);

  if (data === undefined || loading) {
    return (
      <Dialog
        className={styles.foodInfoPopup}
        visible={open}
        onHide={onClose}
        draggable={false}
        dismissableMask={true}
        closable={false}
        resizable={false}
        data-testid="food-info-popup"
      >
        Loading...
      </Dialog>
    );
  }

  const nutrients = {
    Kalorier: `${data.relativeCalories} kcal`,
    Protein: `${data.relativeProtein} g`,
    Karbohydrater: `${data.relativeCarbs} g`,
    Fett: `${data.relativeFat} g`,
    "Mettet fett": `${data.relativeSaturatedFat} g`,
    Sukkerarter: `${data.relativeSugars} g`,
    Fiber: `${data.relativeFiber} g`,
    Salt: `${data.relativeSalt} g`
  };

  return (
    <Dialog
      className={styles.foodInfoPopup}
      visible={open}
      onHide={onClose}
      draggable={false}
      dismissableMask={true}
      closable={false}
      resizable={false}
      data-testid="food-info-popup"
    >
      <div className={styles.content}>
        <h1 className={styles.header} data-testid="header">
          {data.name} {appropriateUnit(data.defaultWeight, data.weightUnit)}{" "}
          {data.brand && "- " + data.brand}
        </h1>
        <div className={styles.foodDetails}>
          <div className={styles.foodImageBorder}>
            <img
              data-testid="food-image"
              src={data.image}
              alt={data.name}
              className={styles.foodImage}
            />
          </div>
          <div>
            <h4>Ingredienser:</h4>
            {data.ingredients ? (
              <p data-testid="ingredients">{data.ingredients}</p>
            ) : (
              <p data-testid="ingredients">Ingen</p>
            )}
            <h4>Allergener:</h4>
            {data.allergens.length > 0 ? (
              <p data-testid="allergens">{data.allergens.join(", ")}</p>
            ) : (
              <p data-testid="allergens">Ingen</p>
            )}
          </div>
        </div>
        <div>
          <h4>Næringsinnhold pr. 100g:</h4>
          <div className={styles.nutrients} data-testid="nutrients-table">
            {Object.entries(nutrients).map(([nutrient, value]) => (
              <div
                className={styles.nutrient}
                key={nutrient}
                data-testid={`nutrient-${nutrient}`}
              >
                <span>{nutrient}:</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
        <button
          className={styles.closeButton}
          onClick={onClose}
          data-testid="close-button"
        >
          Lukk
        </button>
      </div>
    </Dialog>
  );
}
