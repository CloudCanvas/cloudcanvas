import { AccessPair } from "@cloudcanvas/types";
import { S3Entry } from "../domain";

export type DefaultProps = {
  access: AccessPair;
};

type ObjectDetails = {
  LastModified?: Date;
  SizeInBytes?: number; // ContentLength
  ETag?: string;
  Content: string;
  VersionId?: string;
  ContentDisposition?: string;
  ContentEncoding?: string;
  MimeType?: string; // ContentType
  StorageClass?: string; // ContentType
};

export interface S3Helper {
  listBuckets: (props: DefaultProps) => Promise<string[]>;
  listAllObjects: (
    props: {
      bucket: string;
    } & DefaultProps
  ) => Promise<S3Entry[]>;
  listObjects: (
    props: {
      bucket: string;
      path: string;
    } & DefaultProps
  ) => Promise<
    {
      name: string;
      type: "file" | "directory";
    }[]
  >;
  getObjectDetails: (
    props: {
      bucket: string;
      key: string;
    } & DefaultProps
  ) => Promise<ObjectDetails>;
  download: (
    props: {
      bucket: string;
      key: string;
    } & DefaultProps
  ) => Promise<void>;
}
