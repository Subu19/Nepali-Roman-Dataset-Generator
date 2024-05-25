# Generate Roman Dataset

This project is designed to collect and manage voice clips from the public to create a comprehensive Nepali Roman text dataset. The dataset is intended for use in training speech recognition models to understand and transcribe Nepali spoken in Roman script.
### Live URL: https://speech.subasacharya.com.np/
![image](https://github.com/Subu19/Nepali-Roman-Dataset-Generator/assets/59548115/54d96f49-e469-46cf-9cf2-7e8bef351fc3)

## Features

- **Record**: Users can record and upload audio clips directly through the web interface.
- **Verify**: Users can verify the accuracy of transcriptions to ensure the dataset's quality.
- **Write**: Users can submit new sentences to be recorded.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Subu19/Nepali-Roman-Dataset-Generator.git
    ```
2. Navigate to the project directory:
    ```bash
    cd Nepali-Roman-Dataset-Generator
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```
4. Start the server:
    ```bash
    node index.js
    ```

## Configuration

Create a `config.json` file in the project root with the following content:

```json
{
    "uri": "Your mongoDB URI",
    "port": "port number"
}
```

Replace `Your mongoDB URI` with your MongoDB connection string and `port number` with the desired port number for the server.

## Usage

- **Record**: Navigate to the recording page and use the provided tools to record and upload audio clips.
- **Verify**: Review and verify transcriptions to maintain the dataset's accuracy.
- **Write**: Submit new sentences to be recorded.

This project aims to build a robust dataset for improving Nepali speech recognition in the Roman script, enabling better language technology for Nepali speakers.
