export interface SystemStatus {
  cpu: {
    usage: string;
  };
  mem: {
    used: string;
    usedGB: string;
    totalGB: string;
    available: string;
  };
  disk: {
    used: string;
    usedGB: string;
    totalGB: string;
    freeGB: string;
  };
  uptime: string;
  loadAverage: string[];
}

export interface DetailedStats {
  cpu: {
    usage: string;
    cores: number;
    model: string;
  };
  mem: {
    used: string;
    usedGB: string;
    totalGB: string;
    availableGB: string;
  };
  disk: {
    used: string;
    usedGB: string;
    totalGB: string;
    freeGB: string;
  };
}