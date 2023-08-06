import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCities } from "../hooks/useCities";
import Flag from "./Flag";
import { formatDateShort } from "../utils/helpers";
function CityItem({ city }) {
  const { currentCity, deleteCity } = useCities();
  const { cityName, countryCode, date, id, position } = city;

  function handleClick(e) {
    // Avoid event bubbling to prevent navigating to city using link
    e.preventDefault();
    deleteCity(id);
  }

  // List item corresponding to currentCity should have outline around it.

  return (
    <li>
      <Link
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
        className={`${styles.cityItem} ${
          id === currentCity.id ? styles["cityItem--active"] : ""
        }`}
      >
        <span className={styles.emoji}>
          <Flag countryCode={countryCode} />
        </span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>{formatDateShort(date)}</time>
        <button onClick={handleClick} className={styles.deleteBtn}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
