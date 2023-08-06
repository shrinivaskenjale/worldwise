// export function flagImage(code) {
//   if (!code) return;
//   var countryCode = Array.from(code, (codeUnit) => codeUnit.codePointAt())
//     .map((char) => String.fromCharCode(char - 127397).toLowerCase())
//     .join("");
//   return (
//     <img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt="flag" />
//   );
// }

export const flagImage = (flag) => {
  // Convert flag emoji to corresponding country code
  const countryCode = [...flag]
    .map((char) =>
      String.fromCharCode(char.codePointAt() - 127397).toLowerCase()
    )
    .join("");

  // Return an image element with the country's flag
  return (
    <img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt="flag" />
  );
};
