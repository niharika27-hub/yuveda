import "react";

declare module "react" {
  interface HTMLAttributes<T> {
    string?: string;
    "string-copy-from"?: string;
    [key: `string-${string}`]: string | number | boolean | undefined;
  }
}

export {};
