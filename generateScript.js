const fs = require("fs");
const path = require("path");

// Path to the JSON file
const jsonPath = path.join(__dirname, "plutus.json");

// Load the JSON content
const jsonContent = require(jsonPath);

// Create a map to store the first occurrence of each validator by middle name
const validatorMap = new Map();
for (const validator of jsonContent.validators) {
  const rawValidatorName = validator.title.split(".")[1]; // Extract middle part (e.g., 'config_datum_holder' or 'dao')
  if (!validatorMap.has(rawValidatorName)) {
    validatorMap.set(rawValidatorName, validator);
  }
}

// Prepare script entries for unique validators
const scriptEntries = Array.from(validatorMap.entries()).map(
  ([rawValidatorName, validator]) => {
    const validatorName = rawValidatorName
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(""); // Convert to SentenceCase (e.g., 'ConfigDatumHolder' or 'Dao')
    const compiledCode = validator.compiledCode;
    return `  ${validatorName}: applyDoubleCborEncoding(
    "${compiledCode}"
  )`;
  }
);

// Generate the TypeScript content
const tsContent = `import { applyDoubleCborEncoding } from "@lucid-evolution/lucid";

export const script = {
${scriptEntries.join(",\n")}
};
`;

// Write the TypeScript file
const outputPath = path.join(__dirname, "./client/src/config/script.ts");
fs.writeFileSync(outputPath, tsContent, "utf8");
console.log("script.ts generated successfully!");
