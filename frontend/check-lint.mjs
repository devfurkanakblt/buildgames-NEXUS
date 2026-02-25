import { ESLint } from "eslint";
import fs from "fs";

async function run() {
    const eslint = new ESLint();
    const results = await eslint.lintFiles(["src/app"]);
    let hasErrors = false;
    let lines = "";

    for (const result of results) {
        if (result.errorCount > 0 || result.warningCount > 0) {
            hasErrors = true;
            for (const msg of result.messages) {
                lines += `${result.filePath}:${msg.line}:${msg.column} - ${msg.ruleId}: ${msg.message}\n`;
            }
        }
    }

    fs.writeFileSync("lint_out.txt", lines);
    console.log("Done");
}

run().catch(console.error);
