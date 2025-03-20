declare module "browserfs" {
  export interface ApiError extends Error {
    code: string;
    path?: string;
  }

  export enum FileType {
    FILE = 32768,
    DIRECTORY = 16384,
    SYMLINK = 40960,
  }

  export interface Stats {
    dev: number;
    ino: number;
    mode: number;
    nlink: number;
    uid: number;
    gid: number;
    rdev: number;
    size: number;
    blksize: number;
    blocks: number;
    atime: Date;
    mtime: Date;
    ctime: Date;
    birthtime: Date;
    birthtimeMs: number;
    ctimeMs: number;
    atimeMs: number;
    mtimeMs: number;
    isFile(): boolean;
    isDirectory(): boolean;
    isSymbolicLink(): boolean;
  }

  export interface FileSystemConfiguration {
    [key: string]: unknown;
  }

  export interface HTTPRequest {
    empty: () => void;
  }

  export interface IndexedDBFileSystem {
    empty?: (cb: (err: ApiError | null) => void) => void;
    getName: () => string;
  }

  export interface OverlayFS {
    getOverlayedFileSystems: () => {
      readable: unknown;
      writable: unknown;
    };
  }

  export interface InMemoryFileSystem {
    empty?: (cb: (err: ApiError | null) => void) => void;
    getName: () => string;
  }

  export interface FSModule {
    promises: {
      readFile: (
        path: string,
        options?: { encoding?: string }
      ) => Promise<Buffer | string>;
      writeFile: (
        path: string,
        data: string | Buffer,
        options?: { encoding?: string }
      ) => Promise<void>;
      mkdir: (path: string, options?: { recursive?: boolean }) => Promise<void>;
      readdir: (path: string) => Promise<string[]>;
      stat: (path: string) => Promise<Stats>;
      lstat: (path: string) => Promise<Stats>;
      unlink: (path: string) => Promise<void>;
      rmdir: (path: string) => Promise<void>;
    };
    readFileSync: (
      path: string,
      options?: { encoding?: string }
    ) => Buffer | string;
    writeFileSync: (
      path: string,
      data: string | Buffer,
      options?: { encoding?: string }
    ) => void;
    mkdirSync: (path: string, options?: { recursive?: boolean }) => void;
    readdirSync: (path: string) => string[];
    statSync: (path: string) => Stats;
    lstatSync: (path: string) => Stats;
    unlinkSync: (path: string) => void;
    rmdirSync: (path: string) => void;
    lstat: (
      path: string,
      callback: (err: Error | null, stats?: Stats) => void
    ) => void;
    readFile: (
      path: string,
      callback: (err: Error | null, data?: Buffer | string) => void
    ) => void;
    readFile: (
      path: string,
      options: { encoding?: string },
      callback: (err: Error | null, data?: Buffer | string) => void
    ) => void;
    unlink: (path: string, callback?: (err: Error | null) => void) => void;
    readdir: (
      path: string,
      callback: (err: Error | null, files?: string[]) => void
    ) => void;
    exists: (path: string, callback: (exists: boolean) => void) => void;
  }

  export interface EmscriptenFileSystem {
    [key: string]: unknown;
  }

  export interface MountableFileSystem {
    [key: string]: unknown;
    mntMap: Record<string, unknown>;
    mountList: string[];
    _getFs: (path: string) => { fs: unknown };
  }
}
