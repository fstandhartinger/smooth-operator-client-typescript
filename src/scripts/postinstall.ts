import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import AdmZip from 'adm-zip'; // Use default import

const LOG_PREFIX = 'Smooth Operator Postinstall:';
const LOG_TIMING = true; // Control timing logs

/**
 * Gets the appropriate application data directory based on the OS.
 */
function getAppDataDir(): string {
    const platform = os.platform();
    if (platform === 'win32') {
        return process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
    } else if (platform === 'darwin') {
        return path.join(os.homedir(), 'Library', 'Application Support');
    } else { // Linux and other Unix-like systems
        return process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config');
    }
}

/**
 * Ensures the directory exists.
 * @param dirPath The directory path to ensure.
 */
async function ensureDirExists(dirPath: string): Promise<void> {
    try {
        await fs.promises.mkdir(dirPath, { recursive: true });
    } catch (err: any) {
        if (err.code !== 'EEXIST') {
            throw err; // Re-throw if it's not a "directory already exists" error
        }
    }
}

/**
 * Main postinstall logic.
 */
async function runPostinstall(): Promise<void> {
    const startTime = Date.now();
    console.log(`${LOG_PREFIX} Starting postinstall script...`);

    try {
        // 1. Determine Installation Folder
        const appDataBase = getAppDataDir();
        const installationFolder = path.join(appDataBase, 'SmoothOperator', 'AgentToolsServer');
        const installedVersionPath = path.join(installationFolder, 'installedversion.txt');
        const serverExePath = path.join(installationFolder, 'smooth-operator-server.exe'); // Assuming windows target for now

        console.log(`${LOG_PREFIX} Target installation folder: ${installationFolder}`);

        // 2. Ensure Installation Folder Exists
        await ensureDirExists(installationFolder);
        if (LOG_TIMING) console.log(`${LOG_PREFIX} Installation folder ensured after ${Date.now() - startTime}ms.`);

        // 3. Find Package Root and Resource Files
        // __dirname points to the *compiled* script location (e.g., dist/scripts)
        // Package root is likely two levels up from the compiled script directory
        const packageRoot = path.resolve(__dirname, '..', '..');
        const packagedVersionFilePath = path.join(packageRoot, 'installedversion.txt');
        const packagedZipFilePath = path.join(packageRoot, 'smooth-operator-server.zip');

        console.log(`${LOG_PREFIX} Package root detected: ${packageRoot}`);
        if (!fs.existsSync(packagedVersionFilePath)) {
            throw new Error(`Packaged version file not found at ${packagedVersionFilePath}. Build might be incomplete or files missing.`);
        }
        if (!fs.existsSync(packagedZipFilePath)) {
            throw new Error(`Packaged server zip file not found at ${packagedZipFilePath}. Build might be incomplete or files missing.`);
        }

        // 4. Get Packaged Version
        const packagedVersionContent = (await fs.promises.readFile(packagedVersionFilePath, 'utf-8')).trim();
        console.log(`${LOG_PREFIX} Packaged version: ${packagedVersionContent}`);

        // 5. Check Installed Version
        let needsExtraction = true;
        if (fs.existsSync(installedVersionPath)) {
            try {
                const installedVersionContent = (await fs.promises.readFile(installedVersionPath, 'utf-8')).trim();
                console.log(`${LOG_PREFIX} Found installed version: ${installedVersionContent}`);

                const serverExeExists = fs.existsSync(serverExePath);

                if (installedVersionContent === packagedVersionContent && serverExeExists) {
                    console.log(`${LOG_PREFIX} Installed version matches packaged version and server executable exists. Skipping extraction.`);
                    needsExtraction = false;
                } else if (installedVersionContent !== packagedVersionContent) {
                    console.log(`${LOG_PREFIX} Installed version (${installedVersionContent}) differs from packaged (${packagedVersionContent}). Upgrading.`);
                } else { // Version matches but exe missing
                    console.log(`${LOG_PREFIX} Version matches but server executable missing at ${serverExePath}. Re-extracting.`);
                }
            } catch (err) {
                console.warn(`${LOG_PREFIX} Error reading installed version file (${installedVersionPath}): ${err}. Proceeding with extraction.`);
            }
        } else {
            console.log(`${LOG_PREFIX} No existing installation found. Proceeding with extraction.`);
        }

        // 6. Extract if Needed
        if (needsExtraction) {
            if (LOG_TIMING) console.log(`${LOG_PREFIX} Starting server extraction after ${Date.now() - startTime}ms...`);

            try {
                console.log(`${LOG_PREFIX} Extracting ${packagedZipFilePath} to ${installationFolder}...`);
                const zip = new AdmZip(packagedZipFilePath);
                // Extract directly, overwriting existing files
                zip.extractAllTo(installationFolder, /*overwrite*/ true);
                console.log(`${LOG_PREFIX} Server files extracted successfully.`);

                // Write the new version file *after* successful extraction
                await fs.promises.writeFile(installedVersionPath, packagedVersionContent, 'utf-8');
                console.log(`${LOG_PREFIX} Wrote version file ${installedVersionPath}`);

            } catch (error) {
                console.error(`${LOG_PREFIX} An error occurred during extraction:`, error);
                // Attempt to clean up potentially corrupted install? Maybe not safe.
                throw new Error("Failed during server file extraction."); // Throw to indicate postinstall failure
            }
        }

        if (LOG_TIMING) console.log(`${LOG_PREFIX} Postinstall script finished successfully after ${Date.now() - startTime}ms.`);

    } catch (error) {
        console.error(`${LOG_PREFIX} Postinstall script failed:`, error);
        process.exit(1); // Exit with error code to signal failure
    }
}

// Run the script
runPostinstall();