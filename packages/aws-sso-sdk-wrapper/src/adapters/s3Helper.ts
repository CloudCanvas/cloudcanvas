import {
  GetBucketLocationCommand,
  GetObjectCommand,
  ListBucketsCommand,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";
import { AWS } from "cloudcanvas-types";
import { constructTree, getAtPath, S3BucketTree, S3Entry } from "../domain/s3";
import { S3Helper, DefaultProps } from "../ports/s3Helper";

type Ports = {
  aws: AWS;
};

export const makeS3Helper = ({ aws }: Ports): S3Helper => {
  const dictionary: { [bucketName: string]: S3BucketTree } = {};

  const listAllObjects = async (
    props: {
      bucket: string;
    } & DefaultProps
  ): Promise<S3Entry[]> => {
    const info = await aws
      .account(props.access.accountId)
      .role(props.access.permissionSet)
      .s3.send(new GetBucketLocationCommand({ Bucket: props.bucket }));

    let marker: any | undefined = undefined;

    let results: S3Entry[] = [];

    do {
      const objects = await aws
        .account(props.access.accountId)
        .role(props.access.permissionSet)
        // @ts-ignore
        .region(info.LocationConstraint || undefined)
        .s3.send(
          new ListObjectsCommand({
            Bucket: props.bucket,
            Marker: marker,
          })
        );

      marker = objects.NextMarker;

      results.push(...((objects.Contents as S3Entry[]) || []));
    } while (!!marker);

    return results;
  };

  return {
    listBuckets: async ({ access }) => {
      const buckets = await aws
        .account(access.accountId)
        .role(access.permissionSet)
        .s3.send(new ListBucketsCommand({}));

      return (buckets.Buckets || []).map((b) => b.Name!);
    },
    listObjects: async ({ access, bucket, path }) => {
      if (!dictionary[bucket]) {
        const items = await listAllObjects({ access, bucket });
        dictionary[bucket] = constructTree(items);
      }

      const tree = dictionary[bucket]!;

      try {
        const pathObjects = getAtPath(
          tree,
          path.split("/").filter((p) => !!p)
        );
        if (pathObjects === undefined) return [];

        const folders = Object.keys(pathObjects).filter(
          (p) => !!p && p !== "files"
        );
        const files: string[] = pathObjects.files || [];

        return [
          ...folders.map((f) => ({ name: f, type: "directory" })),
          ...files.map((f) => ({ name: f, type: "file" })),
        ] as any[];
      } catch (err) {
        // TODO report  err
        return [];
      }
    },
    listAllObjects: listAllObjects,
    getObjectDetails: async ({ access, bucket, key }) => {
      return new Promise(async (resolve, reject) => {
        try {
          const detail = await aws
            .account(access.accountId)
            .role(access.permissionSet)
            .s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));

          let responseDataChunks: string[] = [];

          // @ts-ignore
          detail?.Body!.on("data", (chunk: string) =>
            responseDataChunks.push(chunk)
          );

          // @ts-ignore
          detail.Body!.once("end", () =>
            resolve({
              Content: responseDataChunks.join(""),
              LastModified: detail.LastModified
                ? new Date(detail.LastModified)
                : undefined,
              SizeInBytes: detail.ContentLength,
              ETag: detail.ETag,
              VersionId: detail.VersionId,
              ContentDisposition: detail.ContentDisposition,
              ContentEncoding: detail.ContentEncoding,
              MimeType: detail.ContentType,
              StorageClass: detail.StorageClass,
            })
          );
        } catch (err) {
          return reject(err);
        }
      });
    },

    download: async () => {
      return {} as any;
    },
  };
};
