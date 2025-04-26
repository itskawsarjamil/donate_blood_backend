const pick = (queryObj: Record<string, unknown>, keys: string[]) => {
  const finalObj: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(queryObj)) {
    if (keys.includes(key)) {
      if (key == 'availability') {
        if (queryObj[key] == 'true') {
          finalObj[key] = true;
        } else {
          finalObj[key] = false;
        }
      } else {
        finalObj[key] = value;
      }
    }
  }
  return finalObj;
};

export default pick;
