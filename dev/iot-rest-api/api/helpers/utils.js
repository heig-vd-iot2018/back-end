function assertRequiredProperties(obj, propertyNames) {
  if (obj === undefined) {
    throw new Error('Required object is undefined.');
  }

  propertyNames.forEach((p) => {
    if (obj[p] === undefined) {
      throw new Error(`Missing required property ${p}.`);
    }
  });
}

module.exports = {
  assertRequiredProperties,
};
