#!/usr/bin/env node
/**
 * Resets the project to a minimal Expo Router starter.
 * Windows-safe: uses copy+remove fallback when rename fails (EXDEV/EPERM/EBUSY).
 *
 * Usage:
 *   npm run reset-project
 *   npm run reset-project -- --move
 *   npm run reset-project -- --delete
 */

import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const root = process.cwd();
const exampleDir = 'example';
const newAppDir = path.join(root, 'src', 'app');
const exampleDirPath = path.join(root, exampleDir);
const scriptsDir = path.join(root, 'scripts');

const indexContent = `import { Text, View, StyleSheet } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>Edit src/app/index.tsx to edit this screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
`;

const layoutContent = `import { Stack } from 'expo-router';

export default function RootLayout() {
  return <Stack />;
}
`;

async function moveDir(src: string, dest: string): Promise<void> {
  await fs.promises.mkdir(path.dirname(dest), { recursive: true });
  try {
    await fs.promises.rename(src, dest);
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === 'EXDEV' || code === 'EPERM' || code === 'EBUSY') {
      await fs.promises.cp(src, dest, { recursive: true });
      await fs.promises.rm(src, { recursive: true, force: true });
    } else {
      throw err;
    }
  }
}

async function removeDir(dirPath: string): Promise<void> {
  await fs.promises.rm(dirPath, { recursive: true, force: true });
}

function parseMode(): 'move' | 'delete' | 'prompt' {
  const args = process.argv.slice(2).map((a) => a.toLowerCase());
  if (args.includes('--move') || args.includes('-y')) return 'move';
  if (args.includes('--delete') || args.includes('-n')) return 'delete';
  return 'prompt';
}

function askMode(): Promise<'move' | 'delete'> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(
      'Move existing files to /example instead of deleting? (Y/n): ',
      (answer) => {
        rl.close();
        const input = answer.trim().toLowerCase() || 'y';
        if (input === 'y') resolve('move');
        else if (input === 'n') resolve('delete');
        else {
          console.log("Invalid input. Use Y or N, or run: npm run reset-project -- --move");
          process.exit(1);
        }
      },
    );
  });
}

async function archiveScriptsCopyOnly(): Promise<void> {
  if (!fs.existsSync(scriptsDir)) return;
  const dest = path.join(exampleDirPath, 'scripts');
  await fs.promises.mkdir(dest, { recursive: true });
  await fs.promises.cp(scriptsDir, dest, {
    recursive: true,
    filter: (src) => !src.endsWith(`${path.sep}reset-project.ts`),
  });
  console.log('Scripts copied to /example/scripts (reset-project.ts skipped).');
  console.log('On Windows, delete the /scripts folder manually after this command finishes.');
}

async function resetProject(mode: 'move' | 'delete'): Promise<void> {
  const srcDir = path.join(root, 'src');

  if (mode === 'move') {
    await fs.promises.mkdir(exampleDirPath, { recursive: true });
    console.log(`/${exampleDir} directory created.`);
  }

  if (fs.existsSync(srcDir)) {
    if (mode === 'move') {
      await moveDir(srcDir, path.join(exampleDirPath, 'src'));
      console.log('/src moved to /example/src.');
    } else {
      await removeDir(srcDir);
      console.log('/src deleted.');
    }
  } else {
    console.log('/src does not exist, skipping.');
  }

  if (mode === 'move') {
    await archiveScriptsCopyOnly();
  } else if (fs.existsSync(scriptsDir)) {
    console.log('/scripts was not deleted (Windows-safe). Remove /scripts manually if you want a clean slate.');
  }

  await fs.promises.mkdir(newAppDir, { recursive: true });
  console.log('\nNew /src/app directory created.');

  await fs.promises.writeFile(path.join(newAppDir, 'index.tsx'), indexContent);
  console.log('src/app/index.tsx created.');

  await fs.promises.writeFile(path.join(newAppDir, '_layout.tsx'), layoutContent);
  console.log('src/app/_layout.tsx created.');

  console.log('\nProject reset complete. Next steps:');
  console.log('1. Run npm start');
  console.log('2. Edit src/app/index.tsx');
  if (mode === 'move') {
    console.log(`3. Delete /${exampleDir} when you no longer need the backup`);
  }
}

async function main(): Promise<void> {
  let mode = parseMode();
  if (mode === 'prompt') {
    if (!process.stdin.isTTY) {
      console.error(
        'Non-interactive shell detected. Run:\n' +
          '  npm run reset-project -- --move\n' +
          '  npm run reset-project -- --delete',
      );
      process.exit(1);
    }
    mode = await askMode();
  }

  try {
    await resetProject(mode);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error during reset: ${message}`);
    process.exit(1);
  }
}

main();
