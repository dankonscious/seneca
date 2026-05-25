const { exec } = require("child_process");

// Get page argument passed via npm
const page = process.env.npm_config_page;

// Determine input/output paths
let inputPath, outputPath;

if (page) {
  inputPath = `./pages/${page}/css/tailwind.input.css`;
  outputPath = `./pages/${page}/css/tailwind.output.css`;
} else {
  inputPath = `./css/tailwind.input.css`;
  outputPath = `./css/tailwind.output.css`;
}

// Construct Tailwind command
const cmd = `npx tailwindcss -i ${inputPath} -o ${outputPath} --watch`;

console.log("Running:", cmd);

// Run Tailwind
const child = exec(cmd);

// Pipe Tailwind logs to console
child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);