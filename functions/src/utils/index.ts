const removeDuplicates = (arr: string[]) => {
  return arr.filter((item, index) => arr.indexOf(item) === index);
};

export const getExperiencesForSnapshot = (snapshot: any) => {
  const experiences: string[] = removeDuplicates(
    snapshot.docs.map((doc: any) => {
      const ride = doc.data();
      if (ride.experience) {
        return ride.experience;
      } else {
        return null;
      }
    })
  );
  return experiences;
};
