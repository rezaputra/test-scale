// global.d.ts
interface SerialPort {
   open(options: { baudRate: number, dataBits?: number, stopBits?: number, parity?: string }): Promise<void>;
   close(): Promise<void>;
   readable: ReadableStream<Uint8Array> | null;
   writable: WritableStream<Uint8Array> | null;
}

interface Navigator {
   serial: {
      requestPort: () => Promise<SerialPort>;
      getPorts: () => Promise<SerialPort[]>;
   };
}
