import * as readline from 'readline';
import * as fs from 'fs';
import { exec, spawn } from 'child_process';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (question: string): Promise<string> => {
    return new Promise((resolve) => rl.question(question, resolve));
};

const updatePackageJsonVersion = (newVersion: string) => {
    const packageJsonPath = './package.json';
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.version = newVersion;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(`Updated package.json to version ${newVersion}`);
};

const commitChanges = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        const commitCommand = 'git add . && git commit -m "Update version and prepare release" && git push';
        exec(commitCommand, (error, stdout, stderr) => {
            if (error) {
                if (stderr.includes('To https://github.com/')) {
                    console.log(`stderr: ${stderr}`);
                    resolve();
                    return;
                }
                console.error(`Error committing changes: ${error.message}`);
                reject(error);
                return;
            }
            if (stderr) {
                resolve();
            }
            console.log(`stdout: ${stdout}`);
            resolve();
        });
    });
};

const createGitHubRelease = (version: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const command = `gh release create v${version} --title "v${version}" --notes "Release notes for version ${version}"`;
        exec(command, async (error, stdout, stderr) => {
            if (error) {
                console.error(`Error creating GitHub release: ${error.message}`);
                if (error.message.includes('gh auth login')) {
                    const shouldLogin = await askQuestion('GitHub authentication required. Do you want to log in? (yes/no): ');
                    if (shouldLogin.toLowerCase() === 'yes') {
                        const loginProcess = spawn('gh', ['auth', 'login'], {
                            stdio: 'inherit',
                            env: { ...process.env, GH_FORCE_TTY: '1' }
                        });
                        loginProcess.on('close', (code) => {
                            if (code !== 0) {
                                reject(new Error(`gh auth login process exited with code ${code}`));
                                return;
                            }
                            createGitHubRelease(version).then(resolve).catch(reject);
                        });
                        return;
                    } else {
                        reject(new Error('GitHub authentication required.'));
                        return;
                    }
                } else {
                    reject(error);
                    return;
                }
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                reject(new Error(stderr));
                return;
            }
            console.log(`stdout: ${stdout}`);
            resolve();
        });
    });
};

const main = async () => {
    try {
        const newVersion = await askQuestion('Enter the new version: ');
        updatePackageJsonVersion(newVersion);

        await commitChanges();

        const shouldCreateRelease = await askQuestion('Should a GitHub release be created? (yes/no): ');
        if (shouldCreateRelease.toLowerCase() === 'yes') {
            await createGitHubRelease(newVersion);
        }
    } catch (error) {
        console.error(error);
    } finally {
        rl.close();
    }
};

main().catch(error => {
    console.error(error);
    rl.close();
});