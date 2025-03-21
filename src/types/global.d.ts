interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    isStatus?: boolean;
    on: (event: string, callback: (...args: any[]) => void) => void;
    removeListener: (event: string, callback: (...args: any[]) => void) => void;
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    enable: () => Promise<string[]>;
    sendAsync?: (
      request: { method: string; params?: any[] },
      callback: (error: any, response: any) => void
    ) => void;
    send?: (
      request: { method: string; params?: any[] },
      callback: (error: any, response: any) => void
    ) => void;
    selectedAddress?: string;
  };
}

export {};
