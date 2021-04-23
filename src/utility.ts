import * as os from "os";
import * as fs from "fs";

export const AppendLinesToFile = (filepath: string, lines: string[]) => {
  lines.forEach((line) => {
    fs.appendFileSync(filepath, line + os.EOL);
  });
};

export const createEmptyFile = async (filepath: string) => {
   await fs.writeFile(filepath, "", () => {});
};
