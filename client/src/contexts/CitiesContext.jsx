import { createContext, useCallback, useEffect, useReducer } from "react";

export const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    async function getCities() {
      try {
        dispatch({ type: "loading" });
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_BASE_URL}/cities`
        );
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch (err) {
        dispatch({
          type: "rejected",
          payload: "There was an error while fetching the cities.",
        });
      }
    }

    getCities();
  }, []);

  const getCity = useCallback(
    async (id) => {
      // Don't make request if currentCity is equal to requested city.
      // Id extracted from URL is string
      if (Number(id) === currentCity.id) return;
      try {
        dispatch({ type: "loading" });
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_BASE_URL}/cities/${id}`
        );
        const data = await res.json();
        dispatch({ type: "city/loaded", payload: data });
      } catch (err) {
        dispatch({
          type: "rejected",
          payload: "There was an error while fetching the city.",
        });
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/cities`,
        {
          method: "post",
          body: JSON.stringify(newCity),
          headers: {
            "content-type": "application/json",
          },
        }
      );
      const data = await res.json();
      // Keep application state in sync with remote state.
      // It is ok to do in small applications. For large applications, we need specialized tools like react query.
      dispatch({ type: "city/created", payload: data });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "There was an error while creating the city.",
      });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "loading" });
      await fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/cities/${id}`, {
        method: "delete",
      });
      dispatch({ type: "city/deleted", payload: id });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "There was an error while deleting the city.",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

export default CitiesProvider;

function reducer(state, action) {
  switch (action.type) {
    case "loading": {
      return {
        ...state,
        isLoading: true,
      };
    }
    case "cities/loaded": {
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    }
    case "city/loaded": {
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };
    }
    case "city/created": {
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    }
    case "city/deleted": {
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    }
    case "rejected": {
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    }
    default: {
      throw new Error(`Unknown action: ${action.type}`);
    }
  }
}

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};
