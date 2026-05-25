declare module "mpegts.js" {
  interface MpegtsPlayer {
    attachMediaElement(element: HTMLVideoElement): void;
    load(): void;
    play(): Promise<void>;
    pause(): void;
    destroy(): void;
    on(event: string, callback: (...args: any[]) => void): void;
    off(event: string, callback: (...args: any[]) => void): void;
  }

  interface MpegtsConfig {
    type: string;
    url: string;
    isLive?: boolean;
    [key: string]: any;
  }

  interface MpegtsStatic {
    createPlayer(config: MpegtsConfig): MpegtsPlayer;
    isSupported(): boolean;
    Events: {
      ERROR: string;
      LOADING_COMPLETE: string;
      RECOVERED_EARLY_EOF: string;
      [key: string]: string;
    };
  }

  const mpegts: MpegtsStatic;
  export default mpegts;
}
