# Solana Vanity Wallet Generator

Welcome to the **Solana Vanity Wallet Generator**! This program runs locally on your console, allowing you to generate a Solana address with a desired prefix. It estimates the time required to reach 50% probability of finding the address and saves the keys to a JSON file.

## Features

- **Custom Prefix**: Generate Solana wallets with your desired prefix.
- **Time Estimation**: Get an estimate of the time needed to find your vanity address based on your machine.
- **Key Storage**: Save your generated keys securely in a JSON file.

## Requirements

- Node.js

## Installation

1. **Clone the repository**

    ```sh
    git clone https://github.com/jahhweh/solana-vanity-wallet-generator.git
    cd solana-vanity-wallet-generator
    ```

2. **Install dependencies**

    ```sh
    npm install
    ```

## Usage

1. **Run the generator script using node:**

    ```sh
    node solvan
    ```

### Steps

1. **Enter your desired prefix**

    When prompted, input the prefix you want for your Solana address. The program will start generating addresses until it finds one with the specified prefix.

2. **Estimated Time**

    The program will provide an estimated time to find the address with your desired prefix based on its complexity and your current machines speed.

3. **Key Storage**

    Once a matching address is found, the program will save the public and private keys securely into a JSON file named `solana_vanity_keys.json`.

## Example

- Here's a quick run-through of how the program works:

    ```sh
    $ node solvan
    Enter your desired address prefix: DEV
    This device will generate ~2150.00 Addresses Per Second (APS)
    Estimated time until 50% probability: 0 days, 0 hours, 0 minutes, and 45 seconds
    Logs will be sent every 100,000 addresses generated
    Do you want to proceed? (y/n): Y
    LFGGGG
    Time until 50% probability of success: 0 days, 0 hours, 0 minutes, and 20 seconds
    Count: 100000
    APS: 2213.22
    50% probability reached!
    Count: 200000
    APS: 2110.7
    Generated Address: DEV1...
    Secret Key: 2ByB...
    Keys saved to solana_vanity_keys.json
    ```

## Contributing

1. **Fork the repository**
2. **Create a new branch**

    ```sh
    git checkout -b feature/your-feature-name
    ```

3. **Make your changes and commit them**

    ```sh
    git commit -m 'Add feature: your feature name'
    ```

4. **Push to the branch**

    ```sh
    git push origin feature/your-feature-name
    ```

5. **Create a pull request**

## License

This project is licensed under the CC0-1.0 License - see the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries or feedback, feel free to reach out on twitter! @jahhweh

LFGGGG

---
💩 dont send me your shitcoins: 7MeoQwuAES3PkxN7xPM1qCjFe9WDL2ZBm4Kysdit2oiw

