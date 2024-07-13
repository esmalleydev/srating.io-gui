export type ClientConfig = {
  host: string;
  port?: number;
  http: string;
  use_origin: boolean;
  path: string | null;
  api_key?: string | null;
  stripe_public_key: string | undefined;
};

export type ServerConfig = {
  host: string;
  port: number;
  http: string;
  secret: string | null;
};
