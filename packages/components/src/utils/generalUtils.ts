export const toSentenceCase = (str: string) => {
  return `${str[0]}${str.substring(1, str.length).toLowerCase()}`;
};

export const diff = (o1: any, o2: any) =>
  Object.keys(o2).reduce((diff, key) => {
    if (o1[key] === o2[key]) return diff;
    return {
      ...diff,
      [key]: o2[key],
    };
  }, {});

export const id = () => Math.random() + "";
