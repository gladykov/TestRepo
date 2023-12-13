import * as fs from 'fs';
import path from 'path';

console.log("I;m here")

console.log(process.argv)
const backupPath = process.argv[2]
const backupsToKeep = 3

function getSortedFiles (dir) {
    const files = fs.readdirSync(dir);

    return files
        .map(fileName => ({
            name: fileName,
            time: fs.statSync(`${dir}/${fileName}`).birthtime.getTime(),
        }))
        .sort((a, b) => b.time - a.time)
        .map(file => file.name);
};

function removeBackups(files) {
    while (files.length > backupsToKeep) {
        const fileToRemove = files[files.length-1]
        console.log("Will remove")
        console.log(path.join(backupPath, fileToRemove))
        fs.unlinkSync(path.join(backupPath, fileToRemove))
        files.pop()
    }
}

const sortedFiles = getSortedFiles(backupPath)
const confFiles = sortedFiles.filter(el => el.includes("conf"))
const jiraFiles = sortedFiles.filter(el => el.includes("jira"))

console.log(sortedFiles)
console.log(confFiles)
console.log(jiraFiles)

if (confFiles.length > backupsToKeep) {
    removeBackups(confFiles)
}

if (jiraFiles.length > backupsToKeep) {
    removeBackups(jiraFiles)
}



