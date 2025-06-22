const substitutes = Object.entries({
  'Kollega': [
    `Maria`,
    `Gustav`,
    `Cici`,
    `Daniel`,
    `Annette`,
    `Ida`,
    `Nadia`,
    `Sabina`,
    `Ulrika`,
    `Emily`,
    `Mats`,
  ],
  'IT-Bibliotek': [
    `Skrivare`,
    `Biblioteksdator`,
  ],
  'Blandat': [
    `ASF`,
  ]
}).map(([replacement, matching]) => ({ replacement, matching }));

function substitutesCallback(str) {
  return substitutes.find(sub => sub.matching.includes(str))?.replacement ?? str;
}