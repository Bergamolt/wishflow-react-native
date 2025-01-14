const fs = require('fs-extra')
const path = require('path')
const watchman = require('fb-watchman')
const os = require('os')

// Get command line arguments
const args = process.argv.slice(2)
if (args.length < 2) {
  console.error('Usage: npm run wlp <source> <target> [--ignorePaths="path1,path2,...]"')
  process.exit(1)
}

// Parse source and target paths
const sourcePackagePath = path.resolve(args[0])
const targetNodeModulesPath = path.resolve(args[1])

// Parse ignore paths from command line arguments
let ignorePaths = ['node_modules', 'example', 'lib', '.git', 'scripts'] // default paths
const ignorePathsArg = args.find((arg) => arg.startsWith('--ignorePaths='))
if (ignorePathsArg) {
  const paths = ignorePathsArg.split('=')[1].split(',')
  ignorePaths = paths.map((p) => p.trim())
}

// Create a unique temp directory path
const tempDir = path.join(os.tmpdir(), `wishflow-react-native-temp`)

const copy = async (source, target) => {
  console.log(`Copying from ${source} to ${target}...`)
  return await fs.copy(source, target, {
    overwrite: true,
    filter: (src) => {
      const shouldCopy = ignorePaths.every((it) => !src.includes(it))
      if (!shouldCopy) {
        console.log(`Skipping: ${src}`)
      }
      return shouldCopy
    },
    dereference: true,
  })
}

// Modified copyEntirePackage function
async function copyEntirePackage() {
  try {
    console.log(`Temp directory: ${tempDir}`)
    console.log(`Source: ${sourcePackagePath}`)
    console.log(`Target: ${targetNodeModulesPath}`)

    // First, ensure temp directory exists and is empty
    await fs.emptyDir(tempDir)
    console.log('Temp directory emptied')

    // Copy to temp directory first
    console.log('Copying to temp directory...')
    await copy(sourcePackagePath, tempDir)
    console.log('Copied to temp directory')

    // Then copy from temp to target
    console.log('Copying to target directory...')
    await copy(tempDir, targetNodeModulesPath)
    console.log('Package fully copied to node_modules')
  } catch (err) {
    console.error('Error copying package:', err)
    console.error('Error details:', err.stack)
  }
}

// Watch changes using watchman
async function watchWithWatchman() {
  const client = new watchman.Client()

  const watchProject = () => {
    return new Promise((resolve, reject) => {
      client.command(['watch-project', sourcePackagePath], (error, resp) => {
        if (error) {
          reject(error)
          return
        }
        resolve(resp)
      })
    })
  }

  const subscribe = (watch, relative_path) => {
    return new Promise((resolve, reject) => {
      const sub = {
        expression: [
          'allof',
          ['type', 'f'],
          ['not', ['dirname', '.git']],
          ['not', ['anyof', ...ignorePaths.map((dir) => ['dirname', dir])]],
        ],
        fields: ['name', 'exists', 'type'],
      }

      client.command(['subscribe', watch, 'mysubscription', sub], (error, resp) => {
        if (error) {
          reject(error)
          return
        }
        resolve(resp)
      })
    })
  }

  try {
    const watchResp = await watchProject()
    console.log('Watch established:', watchResp.watch)

    await subscribe(watchResp.watch, watchResp.relative_path)

    client.on('subscription', async (resp) => {
      if (resp.subscription !== 'mysubscription' || !resp.files?.length) return

      for (const file of resp.files) {
        const sourcePath = path.join(sourcePackagePath, file.name)
        const tempPath = path.join(tempDir, file.name)
        const targetPath = path.join(targetNodeModulesPath, file.name)

        try {
          if (file.exists) {
            const sourceExists = await fs.pathExists(sourcePath)
            if (!sourceExists) continue

            // Copy to temp first
            await fs.ensureDir(path.dirname(tempPath))
            await fs.copy(sourcePath, tempPath, {
              overwrite: true,
              preserveTimestamps: true,
            })

            // Then copy to target
            await fs.ensureDir(path.dirname(targetPath))
            await fs.copy(tempPath, targetPath, {
              overwrite: true,
              preserveTimestamps: true,
            })
            console.log(`File updated: ${file.name}`)
          } else {
            await fs.remove(targetPath)
            console.log(`File removed: ${file.name}`)
          }
        } catch (error) {
          console.error(`Error processing file ${file.name}:`, error)
        }
      }
    })

    client.on('error', (error) => {
      console.error('Watchman error:', error)
      client.end()
    })
  } catch (error) {
    console.error('Error setting up watchman:', error)
    client.end()
  }
}

// Clear watchman before starting
async function clearWatchman() {
  return new Promise((resolve, reject) => {
    const client = new watchman.Client()
    client.command(['watch-del-all'], (error, resp) => {
      if (error) reject(error)
      else resolve(resp)
      client.end()
    })
  })
}

// Add cleanup function
async function cleanup() {
  try {
    await fs.remove(tempDir)
    console.log('Temporary directory cleaned up')
  } catch (error) {
    console.error('Error cleaning up temp directory:', error)
  }
}

// Modify main logic to include cleanup
;(async () => {
  try {
    console.log('Clearing watchman...')
    await clearWatchman()

    console.log('Initial package copy...')
    await copyEntirePackage()

    console.log('Watching for changes...')
    await watchWithWatchman()

    // Setup cleanup on process exit
    process.on('SIGINT', async () => {
      console.log('\nCleaning up before exit...')
      await cleanup()
      process.exit()
    })
  } catch (error) {
    console.error('Startup error:', error)
    await cleanup()
  }
})()
