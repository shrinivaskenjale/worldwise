import styles from "./CountryItem.module.css";
import Flag from "./Flag";

function CountryItem({ country }) {
  return (
    <li className={styles.countryItem}>
      <span>
        <Flag countryCode={country.countryCode} />
      </span>
      <span>{country.country}</span>
    </li>
  );
}

export default CountryItem;
