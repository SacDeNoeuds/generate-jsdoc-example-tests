import { readdirSync, statSync } from 'node:fs'
import path from 'node:path'

type ReadDirectoryOptions = {
  ignorePatterns: string[]
}

/**
 * Reads a directories recursively to extract all files synchronously.
 */
export function* readDirectories(directories: string[], options: ReadDirectoryOptions) {
  for (const directory of directories) {
    yield* readDirectory(directory, options)
  }
}

function* readDirectory(directory: string, options: ReadDirectoryOptions) {
  const stats = statSync(directory)
  if (stats.isFile()) yield directory
  else {
    const entries = readdirSync(directory, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        yield* readDirectory(fullPath, options);
      } else if (options.ignorePatterns.every((pattern) => !fullPath.includes(pattern))) {
        yield fullPath;
      }
    }
  }
}