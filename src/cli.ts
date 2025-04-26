#!/usr/bin/env node

import { makeCommand, makeStringFlag, mergeFlag } from "catacli"
import * as glob from "glob"
import * as path from "path"
import { generate } from "./app"

const flag = mergeFlag(
  makeStringFlag("filepath", {
    usage: "src file path (only single file accepted)",
  }),
  makeStringFlag("fileMatch", {
    usage: "src file path (regexp).",
  }),
)

const command = makeCommand({
  name: "tsdoc-testify",
  description: "documentation testing generator for tsdoc",
  version: "0.0.1",
  usage: "tsdoc-testify [OPTIONS]",
  flag,
  handler: async (_, params) => {
    if (!params.filepath.value && !params.fileMatch.value) {
      console.log("`--filepath` or `--fileMatch` is required.")
    }

    if (params.fileMatch.value) {
      try {
        const files = await glob.glob(params.fileMatch.value)
        await Promise.all(files.map(async (f) => {
          const filePath = path.resolve(process.cwd(), f)
          await generate({ filePath })
        }))
      } catch (error) {
        console.error(error)
      }
    }

    if (params.filepath.value) {
      const filePath = path.resolve(process.cwd(), params.filepath.value)
      await generate({ filePath })
    }
  },
})

command(process.argv.splice(2))
