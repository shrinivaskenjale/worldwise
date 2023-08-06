import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCities } from "../hooks/useCities";
import { formatDateLong } from "../utils/helpers";
import BackButton from "./BackButton";
import styles from "./City.module.css";
import Flag from "./Flag";
import Spinner from "./Spinner";

function City() {
  const { cityId } = useParams();
  const { getCity, currentCity, isLoading } = useCities();

  useEffect(() => {
    // Calling getCity with city id fetches the city and sets it in state 'currentCity'
    getCity(cityId);
  }, [cityId, getCity]);

  if (isLoading) return <Spinner />;

  const { cityName, countryCode, date, notes } = currentCity;

  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span>
            <Flag countryCode={countryCode} />
          </span>
          {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDateLong(date || null)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div>
        <BackButton />
      </div>
    </div>
  );
}

export default City;
