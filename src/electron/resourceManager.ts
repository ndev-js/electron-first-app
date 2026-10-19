import osUtils from "os-utils";
import fs from "fs";
import os from "os";
const POLLING_INTERVAL = 500;

export function pollResources() {
  setInterval(async () => {
    const cpuUsage = await getCpuUsage();
    const ramUsage = getRamUsage();
    const storageData = getStorageData();
    console.log({ cpuUsage, ramUsage, storageData });
  }, POLLING_INTERVAL);
}
export function getStaticData() {
  const totalStorage = getStorageData().total;
  const cpuModal = os.cpus()[0].model;
  const totalRam = Math.floor(os.totalmem() / 1_000_000_000); // in GB
  return {
    totalStorage,
    cpuModal,
    totalRam,
  };
}
function getCpuUsage() {
  return new Promise((resolve) => {
    osUtils.cpuUsage(resolve);
  });
}

function getRamUsage() {
  return 1 - osUtils.freememPercentage();
}

function getStorageData() {
  const stats = fs.statfsSync(process.platform === "win32" ? "C:\\" : "/");
  const total = stats.bsize * stats.blocks;
  const free = stats.bsize * stats.bfree;

  return {
    total: Math.floor(total / 1_000_000_000), // in GB
    usgae: 1 - free / total, // in percentage
  };
}
