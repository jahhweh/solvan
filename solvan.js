import { Keypair } from '@solana/web3.js';
import pkg from 'bs58';
import readline from 'readline';
import chalk from 'chalk';
import fs from 'fs';
const { encode } = pkg;
const base58Charset = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const base58AlphabetSize = 58;

const logTime = 100000;

const sol_teal = chalk.rgb(26, 248, 157);
const sol_lightBlue = chalk.rgb(53, 204, 193);
const sol_blue = chalk.rgb(79, 160, 210);
const sol_darkBlue = chalk.rgb(109, 116, 228);
const sol_lightPurple = chalk.rgb(136, 81, 243);
const sol_purple = chalk.rgb(152, 70, 255);

console.log(sol_teal('\n||||||||||||||||||||||||||'));
console.log(sol_teal('||    SOLANA VANITY     ||'));
console.log(sol_lightBlue('||   WALLET GENERATOR   ||'));
console.log(sol_lightBlue('||||||||||||||||||||||||||'));
console.log(sol_blue('||      HOW TO USE      ||'));
console.log(sol_darkBlue('|| 1. INPUT PREFIX      ||'));
console.log(sol_lightPurple('|| 2. CONFIRM ESTIMATE  ||'))
console.log(sol_lightPurple('|| 3. WAIT              ||'));
console.log(sol_purple('||||||||||||||||||||||||||\n'));

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question(chalk.yellow('Enter your desired prefix: '), async (desiredPrefix) => {
    if (!isBase58(desiredPrefix)) {
        console.log(chalk.red(`Invalid prefix detected. Ensure your address excludes the characters '0', 'O', 'I', and 'l', as they are not allowed in a base58 format.`));
        rl.close();
        return;
    }

    const prefixLength = desiredPrefix.length;
    const totalCombinations = Math.pow(base58AlphabetSize, prefixLength);

    function measureKeysPerSecond() {
        let keypair;
        let publicKeyString;
        let count = 0;
        const startTime = Date.now();
        const endTime = startTime + 1000;

        while (Date.now() < endTime) {
            keypair = Keypair.generate();
            publicKeyString = keypair.publicKey.toString();
            count++;
        }

        const elapsedTime = (Date.now() - startTime) / 1000;
        return count / elapsedTime;
    }

    const keysPerSecond = measureKeysPerSecond();
    const initialEstimatedTime = calculateRemainingTime(totalCombinations, 0, keysPerSecond);
    console.log(chalk.rgb(82, 155, 212)(`Desired prefix: `) + chalk.white(`${desiredPrefix}`));
    console.log(chalk.rgb(82, 155, 212)(`This device will generate `) + chalk.green(`~${keysPerSecond.toFixed(2)}`) + chalk.rgb(82, 155, 212)(` Addresses Per Second (APS)`));
    if (initialEstimatedTime.totalDays >= 1) {
        console.log(chalk.rgb(82, 155, 212)(`Estimated time until 50% probability: `) + chalk.red(`${initialEstimatedTime.totalDays.toLocaleString()} days, ${initialEstimatedTime.totalHours} hours, ${initialEstimatedTime.totalMinutes} minutes, and ${initialEstimatedTime.totalSeconds} seconds`));
    } else if (initialEstimatedTime.totalDays < 1 && initialEstimatedTime.totalHours > 1) {
        console.log(chalk.rgb(82, 155, 212)(`Estimated time until 50% probability: `) + chalk.yellow(`${initialEstimatedTime.totalDays.toLocaleString()} days, ${initialEstimatedTime.totalHours} hours, ${initialEstimatedTime.totalMinutes} minutes, and ${initialEstimatedTime.totalSeconds} seconds`));
    } else {
        console.log(chalk.rgb(82, 155, 212)(`Estimated time until 50% probability: `) + chalk.green(`${initialEstimatedTime.totalDays.toLocaleString()} days, ${initialEstimatedTime.totalHours} hours, ${initialEstimatedTime.totalMinutes} minutes, and ${initialEstimatedTime.totalSeconds} seconds`));
    }
    console.log(chalk.rgb(82, 155, 212)(`Logs will be sent every `) + chalk.green(`${logTime.toLocaleString()}`) + chalk.rgb(82, 155, 212)(` addresses generated`));
    rl.question(chalk.yellow('Do you want to proceed? (y/n): '), async (answer) => {
        if (answer.toLowerCase() === 'y') {
            console.log(chalk.rgb(26, 248, 157)('L') + chalk.rgb(53, 204, 193)('F') + chalk.rgb(79, 160, 210)('G') + chalk.rgb(109, 116, 228)('G') + chalk.rgb(136, 81, 243)('G') + chalk.rgb(152, 70, 255)('G'));
            try {
                const vanityKeypair = await generateVanityAddress(desiredPrefix);
                const publicKey = vanityKeypair.publicKey.toString();
                const secretKey = encode(vanityKeypair.secretKey);

                console.log(chalk.blue.green('Generated Address:'), chalk.blue(publicKey));
                console.log(chalk.blue.green('Secret Key:'), chalk.blue(secretKey));

                saveKeysToFile(publicKey, secretKey);
            } catch (e) {
                console.log(chalk.red('Error generating vanity address:', e.message));
            }
        } else {
            console.log(chalk.red('Cancelled.'));
        }
        rl.close();
    });
});

function isBase58(prefix) {
    return prefix.split('').every((char) => base58Charset.includes(char));
}

function calculateRemainingTime(totalCombinations, checkedCount, keysPerSecond) {
    let remainingCombinations = (totalCombinations / 2) - checkedCount;
    if (remainingCombinations < 0) remainingCombinations = 0;

    const totalTimeInSeconds = remainingCombinations / keysPerSecond;
    const secondsInADay = 86400;
    const secondsInAnHour = 3600;
    const secondsInAMinute = 60;

    const totalDays = Math.floor(totalTimeInSeconds / secondsInADay);
    const remainingSecondsDay = totalTimeInSeconds % secondsInADay;
    const totalHours = Math.floor(remainingSecondsDay / secondsInAnHour);
    const remainingSecondsHour = remainingSecondsDay % secondsInAnHour;
    const totalMinutes = Math.floor(remainingSecondsHour / secondsInAMinute);
    const totalSeconds = Math.floor(remainingSecondsHour % secondsInAMinute);

    return {
        totalDays,
        totalHours,
        totalMinutes,
        totalSeconds,
        actualProbability: (checkedCount / totalCombinations * 100).toFixed(2)
    };
}

function saveKeysToFile(publicKey, secretKey) {
    const filePath = 'solana_vanity_keys.json';
    const keyData = {
        publicKey,
        secretKey
    };

    fs.appendFile(filePath, JSON.stringify(keyData, null, 2), 'utf8', (err) => {
        if (err) {
            console.log(chalk.red(`Error saving keys to file: ${err.message}`));
        } else {
            console.log(chalk.green(`Keys saved to ${chalk.blue(filePath)}`));
        }
    });
}

async function generateVanityAddress(desiredPrefix) {
    let keypair;
    let publicKeyString;
    let count = 0;
    const startTime = Date.now();
    do {
        keypair = Keypair.generate();
        publicKeyString = keypair.publicKey.toString();
        count++;
        if (count % logTime === 0) {
            const elapsedTime = (Date.now() - startTime) / 1000;
            const currentKeysPerSecond = count / elapsedTime;
            const estimatedRemainingTime = calculateRemainingTime(Math.pow(base58AlphabetSize, desiredPrefix.length), count, currentKeysPerSecond);
            if (estimatedRemainingTime.totalDays <= 0 && estimatedRemainingTime.totalHours <= 0 && estimatedRemainingTime.totalMinutes <= 0 && estimatedRemainingTime.totalSeconds <= 0) {
                console.log(chalk.cyan.bold('50% probability reached! Actual probability: ') + chalk.cyan(estimatedRemainingTime.actualProbability + '%'));
            } else {
                console.log(chalk.rgb(153, 69, 255)(`Time until 50% probability of success: ${estimatedRemainingTime.totalDays} days, ${estimatedRemainingTime.totalHours} hours, ${estimatedRemainingTime.totalMinutes} minutes, and ${estimatedRemainingTime.totalSeconds} seconds`));
            }
            console.log(chalk.yellow(`Count: ${count}`));
            console.log(chalk.yellow(`APS: ${currentKeysPerSecond.toFixed(2)}`));
        }
    } while (!publicKeyString.startsWith(desiredPrefix));
    return keypair;
}