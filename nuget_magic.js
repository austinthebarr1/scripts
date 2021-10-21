#!/usr/bin/env node

"use strict";

// Packages
const fs = require("fs");
const os = require("os");
const { exec } = require("child_process");
// Gloabal Variables
const baseDir = os.homedir();
const nugetFeedPath = `${baseDir}/nuget`;
const input = process.argv.slice(2);
if (input.length < 3 || input.length > 3) {
  console.log("Please Provide correct arguments");
  console.log(
    "Example: node nuget_magic /nuget/project/directory /project/usingNuget/directory 1.5.6(version)"
  );
  console.log("Real Example: node nuget_magic /repos/NugetPackages /repos/funcApps 1.6.0")
  return;
}
var nugetFilePath = input[0];
var projectFilePath = input[1];
var nugetVersion = input[2];

var nugetProjectPath = `${
  baseDir + nugetFilePath
}/Utilities-PartnerTransaction/PartnerTransactionUtilities`;
var projectPath =  `${baseDir + projectFilePath}/PartnerInboundTransactions/PartnerInboundTransactions/`
main();
// Functions
function main() {
  checkFilePath(nugetFeedPath, buildNugetProject);
}

function checkFilePath(path, cb) {
  fs.access(path, fs.F_OK, (err) => {
    if (err) {
      console.log(`Creating Directory: ${path}`);
      fs.mkdir(path, () => {
        console.log(`Created NugetFeed Directory: ${path}`);
        cb(nugetPack);
      });
    } else {
      cb(nugetPack);
    }
  });
}

function buildNugetProject(cb) {
  exec(`dotnet build ${nugetProjectPath}`, (err) => {
    if (err) {
      console.log("node couldn't execute the build command");
      return;
    }
    cb(nugetAddToFeed);
    console.log("Project Built");
  });
}

function nugetPack(cb) {
  console.log("Project Path: ", nugetProjectPath);
  exec(
    `nuget pack ${nugetProjectPath}/PartnerTransactionUtilities.csproj`,
    (err) => {
      if (err) {
        console.log("node couldn't execute pack the command");
        return;
      }
      console.log("Nuget Packed");
      cb(nugetRemovePackage);
    }
  );
}

function nugetAddToFeed(cb) {
  exec(
    `nuget add ${nugetProjectPath}/bin/Debug/AlaskaAir.MileagePlan.PartnerTransactionUtilities.${nugetVersion}.nupkg -Source ${nugetFeedPath}
    `,
    (err) => {
      if (err) {
        console.log("node couldn't execute the the nuget add command");
        return;
      }
      console.log("Nuget Added to Feed");
      cb(nugetAddPackage);
    }
  );
}

function nugetRemovePackage(cb) {
  exec(
    `cd ${projectPath} && dotnet remove package AlaskaAir.MileagePlan.PartnerTransactionUtilities
        `,
    (err) => {
      if (err) {
        console.log(err);
        console.log("node couldn't execute the remove command");
        return;
      }
      console.log("Nuget Removed from Project");
      cb();
    }
  );
}

function nugetAddPackage() {
  exec(
    `cd ${projectPath} && dotnet add package AlaskaAir.MileagePlan.PartnerTransactionUtilities -s ${nugetFeedPath} --version ${nugetVersion}
        `,
    (err) => {
      if (err) {
        console.log("node couldn't execute the add package command");
        return;
      }

      console.log("Nuget Added to Project");
    }
  );
}
