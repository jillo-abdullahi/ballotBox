// Type declarations for multiformats to resolve import issues
declare module 'multiformats/cid' {
  export interface CID {
    toString(): string;
  }
  
  export const CID: {
    parse(input: string): CID;
  };
}
