import fs from "fs";
import path from "path";
import { train } from "./ai";

async function build() {
  try {
    const dist = "./docs";

    // Clean dist directory if it exists
    if (fs.existsSync(dist)) {
      fs.rmSync(dist, { recursive: true, force: true });
    }
    
    // Create fresh dist directory
    fs.mkdirSync(dist, { recursive: true });

    // train the example model
    // await train();

    // move src to dist folder
    fs.cpSync(path.join(__dirname, "src"), dist, {
      recursive: true,
    });

    // move public to dist folder
    fs.cpSync(path.join(__dirname, "public"), dist, {
      recursive: true,
    });

    console.log("Build completed successfully!");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

build();
