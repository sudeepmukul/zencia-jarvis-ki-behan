const si = require('systeminformation');

async function getStats() {
  const cpu = await si.currentLoad();
  const mem = await si.mem();

  return {
    cpu: cpu.currentLoad.toFixed(1),
    ram: (mem.used / mem.total * 100).toFixed(1)
  };
}

module.exports = { getStats };