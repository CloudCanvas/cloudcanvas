export type S3BucketTree = {
  [key: string]: any | string[];
};

export type S3Entry = {
  Key: string;
  LastModified: Date;
  ETag: string;
  Size: number;
  StorageClass: any;
  Owner: {
    DisplayName?: string;
    ID?: string;
  };
};

function resolve(obj: any, path: any) {
  let root = (obj = [obj]);
  path = [0, ...path];
  while (path.length > 1) obj = obj[path.shift()];
  return [obj, path[0], root];
}

export const getAtPath = (obj: any, path: string[]): any | undefined => {
  let [parent, key] = resolve(obj, path);
  return parent[key];
};
const setAtPath = (obj: S3BucketTree, path: string[], value: any) => {
  let [parent, key, root] = resolve(obj, path);
  parent[key] = value;
  return root[0];
};

/**
 *
 * @param objects This is pretty dreadful hacky shit
 * @returns
 */
export const constructTree = (objects: S3Entry[]): S3BucketTree => {
  let tree: S3BucketTree = {};

  let items: string[] = objects.map((o) => o.Key!).map(trimFromStart);

  items.forEach((item) => {
    const isDirectory = item.endsWith("/");
    const itemTrimmed = trimFromStartAndEnd(item);
    const keys = itemTrimmed.split("/");
    const walked: string[] = [];

    for (const key of keys) {
      if (itemTrimmed.endsWith(key) && !isDirectory) {
        const existing = getAtPath(tree, [...walked]);

        if (existing === undefined || existing.files === undefined) {
          setAtPath(tree, [...walked], { files: [key] });
        } else {
          setAtPath(tree, [...walked, "files"], [...existing.files, key]);
        }
      } else if (itemTrimmed.endsWith(key) && isDirectory) {
        setAtPath(tree, [...walked, key], {});
      } else {
        walked.push(key);
      }
    }
  });

  return tree;
};

const trimFromStartAndEnd = (s: string) => {
  return s.replace(/^\/+|\/+$/g, "");
};

const trimFromStart = (s: string) => {
  return s.replace(/^\/+/g, "");
};
