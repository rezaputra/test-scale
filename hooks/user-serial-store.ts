import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SerialState {
   selectedPort: SerialPort | null;
   setSelectedPort: (port: SerialPort | null) => void;
}

const useSerialStore = create(
   persist<SerialState>(
      (set) => ({
         selectedPort: null,
         setSelectedPort: (port) => set({ selectedPort: port }),
      }),
      {
         name: 'serial-port-storage',
      }
   )
);

export default useSerialStore;
