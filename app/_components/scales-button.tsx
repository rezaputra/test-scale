'use client';

import { useState } from 'react';

// Extending the built-in Navigator interface to include the full 'serial' property
interface NavigatorSerial extends Navigator {
   serial: {
      requestPort: () => Promise<SerialPort>;
      getPorts: () => Promise<SerialPort[]>;
   };
}

export default function SerialComponent() {
   const [data, setData] = useState<string | null>(null);
   const [error, setError] = useState<string | null>(null);

   // Typing for SerialPort as it's not built-in
   interface MySerialPort extends SerialPort {
      open: (options: { baudRate: number; dataBits: number; stopBits: number; parity: string; autoOpen?: boolean }) => Promise<void>;
   }

   const connectToSerialPort = async () => {
      try {
         // Access the navigator object with extended serial type
         const selectedPort: MySerialPort = await (navigator as NavigatorSerial).serial.requestPort();

         // Open the serial port with specific options
         await selectedPort.open({
            baudRate: 2400,
            dataBits: 8, // Changed to 8 as this is standard for RS232
            stopBits: 1,
            parity: 'none',
         });

         console.log('Port opened successfully!');

         // Create a reader to read data from the serial port
         const reader = selectedPort.readable?.getReader();
         if (!reader) {
            throw new Error('The readable stream is not available.');
         }

         const decoder = new TextDecoder();

         // Reading data in a loop
         while (true) {
            const { value, done } = await reader.read();
            if (done) {
               console.log('Stream closed');
               break;
            }

            console.log(value)

            // Ensure the value is valid before decoding
            if (value) {
               const decodedData = decoder.decode(value);
               setData((prevData) => (prevData ? prevData + decodedData : decodedData));
               console.log('Data received:', decodedData);
            } else {
               console.warn('Received empty value from the serial port.');
            }
         }

         // Release the reader when done
         reader.releaseLock();

         // Close the serial port when done
         await selectedPort.close();
         console.log('Port closed');
      } catch (err: unknown) { // Keep `unknown` for error type
         if (err instanceof Error) {
            setError('Error connecting to serial port: ' + err.message);
            console.error('Error:', err.message);
         } else {
            setError('An unknown error occurred.');
            console.error('Error:', err);
         }
      }
   };

   return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
         <h1 className="text-3xl font-bold text-gray-800 mb-4">Serial Data from Scale</h1>
         {error && <div className="text-red-600 mb-2">Error: {error}</div>}
         <button
            onClick={connectToSerialPort}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
         >
            Connect to Serial Port
         </button>
         <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-lg">
            {data ? (
               <p className="text-gray-700">Data: {data}</p>
            ) : (
               <p className="text-gray-500">Waiting for data...</p>
            )}
         </div>
      </div>
   );
}
