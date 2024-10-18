'use client';

import { useState } from 'react';

export default function SerialComponent() {
   const [data, setData] = useState<string | null>(null);
   const [error, setError] = useState<string | null>(null);

   const connectToSerialPort = async () => {
      try {
         const selectedPort: SerialPort = await (navigator as unknown as { serial: { requestPort: () => Promise<SerialPort> } }).serial.requestPort();

         await selectedPort.open({
            baudRate: 2400,
            dataBits: 7,
            stopBits: 1,
            parity: "none"
         });

         console.log('Port opened successfully!');


         const reader = selectedPort.readable?.getReader();
         if (!reader) {
            throw new Error('The readable stream is not available.');
         }

         const decoder = new TextDecoder();

         while (true) {
            const { value, done } = await reader.read();
            if (done) {
               console.log('Stream closed');
               break;
            }
            const decodedData = decoder.decode(value);
            setData((prevData) => (prevData ? prevData + decodedData : decodedData));
            console.log('Data received:', decodedData);
         }

         reader.releaseLock();
      } catch (err: unknown) { // Keep `unknown` for the error
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
