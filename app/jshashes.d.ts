declare module 'jshashes' {
    export class SHA256 {
      constructor();
      hex(input: string): string;
      b64(input: string): string;
      raw(input: string): string;
    }
}