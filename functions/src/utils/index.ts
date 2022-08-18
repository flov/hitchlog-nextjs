const removeDuplicates = (arr: string[]) => {
  return arr.filter((item, index) => arr.indexOf(item) === index);
};

const removeNull = (arr: any[]) => {
  return arr.filter((item) => item !== null);
};

export const hasStoryForRidesSnapshot = (snapshot: any) => {
  const array = snapshot.docs.map((doc: any) => {
    const ride = doc.data();
    if (ride.story) {
      return true;
    } else {
      return false;
    }
  });
  if (array.includes(true)) {
    return true;
  }
  return false;
};

export const getExperiencesForSnapshot = (snapshot: any) => {
  const experiences: string[] = removeNull(
    removeDuplicates(
      snapshot.docs.map((doc: any) => {
        const ride = doc.data();
        if (ride.experience) {
          return ride.experience;
        } else {
          return null;
        }
      })
    )
  );
  // remove null from array
  return experiences;
};
