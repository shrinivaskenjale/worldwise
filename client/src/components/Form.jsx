import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchPosition } from "../hooks/useSearchPosition";
import BackButton from "./BackButton";
import Button from "./Button";
import styles from "./Form.module.css";
import Message from "./Message";
import Spinner from "./Spinner";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../hooks/useCities";
import Flag from "./Flag";

function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [lat, lng] = useSearchPosition();
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("");
  const [error, setError] = useState("");
  const { createCity, isLoading: isFormSubmitting } = useCities();
  const navigate = useNavigate();

  // Get information of the place using co-ordinates
  useEffect(() => {
    if (!lat || !lng) return;
    async function getCityData() {
      try {
        setIsLoading(true);
        setError("");
        const BASE_URL =
          "https://api.bigdatacloud.net/data/reverse-geocode-client";
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();
        if (!data.countryCode)
          throw new Error(
            "That doesn't seem to be a city. Click somewhere else. 👆"
          );
        setCityName(data.city || data.locality || "");
        setCountry(data.countryName);
        setCountryCode(data.countryCode);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    getCityData();
  }, [lat, lng]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!cityName || !date) return;

    // Create date object
    let visitDate = new Date(date);
    // Adjust to local time zone
    visitDate.setMinutes(
      visitDate.getMinutes() + visitDate.getTimezoneOffset()
    );
    // Convert date to ISO string
    visitDate = visitDate.toISOString();

    const newCity = {
      cityName,
      country,
      countryCode,
      date: visitDate,
      notes,
      position: { lat, lng },
    };

    // await before navigating to city list
    await createCity(newCity);
    navigate("/app/cities");
  }

  if (isLoading) {
    return <Spinner />;
  }
  if (!lat || !lng) {
    return <Message message="Start by clicking somewhere on the map. 👆" />;
  }
  if (error) {
    return <Message message={error} />;
  }
  return (
    <form
      className={`${styles.form} ${isFormSubmitting ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
          style={{}}
        />
        <Flag className={styles.flag} countryCode={countryCode} />
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <input
          type="date"
          name="date"
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        />

        {/* <DatePicker
          id="date"
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat="dd/MM/yyyy"
        /> */}
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
