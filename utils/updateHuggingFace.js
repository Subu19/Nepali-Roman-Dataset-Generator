const { exec } = require("child_process");
const path = require("path");

// Function to execute shell commands in a specific directory
function executeCommand(command, cwd) {
    return new Promise((resolve, reject) => {
        exec(command, { cwd }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command: ${error.message}`);
                return reject(error);
            }
            if (stderr) {
                console.error(`Command stderr: ${stderr}`);
                return reject(stderr);
            }
            console.log(`Command stdout: ${stdout}`);
            resolve(stdout);
        });
    });
}

// Path to the dataset repository folder
const datasetRepoPath = path.join(process.env.DATASET_PATH);

// Function to automate dataset versioning
async function updateDatasetHF() {
    try {
        // Pull latest changes
        await executeCommand("git pull", datasetRepoPath);

        // Add changes to Git
        await executeCommand("git add .", datasetRepoPath);

        // Commit the changes
        await executeCommand('git commit -m "Automated dataset update"', datasetRepoPath);

        // Push changes to Hugging Face
        await executeCommand("git push", datasetRepoPath);

        console.log("Dataset updated successfully!");
    } catch (error) {
        console.error("Failed to update dataset:", error.message);
    }
}

module.exports = { updateDatasetHF };
