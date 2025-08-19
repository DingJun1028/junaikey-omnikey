// OmniCodex - 萬能智典：SDK的核心入口點與總司元
import { Agentus } from './Agentus';
import { RuneSystem } from './RuneSystem';
import { GenesisChronicle } from './Axioms';

interface OmniCodexConfig {
  apiKey: string;
}

export class OmniCodex {
  public config: OmniCodexConfig;
  public agentus: Agentus;
  public runeSystem: RuneSystem;
  public genesisChronicle: GenesisChronicle;

  constructor(config: OmniCodexConfig) {
    this.config = config;
    this.agentus = new Agentus(this.config.apiKey);
    this.runeSystem = new RuneSystem(this.config.apiKey);
    this.genesisChronicle = new GenesisChronicle();
    console.log('[萬法歸一・永恆編纂！]：萬能智典已覺醒，準備服務。');
  }

  // 核心奧義發動器
  public invokeMystery(mystery: Function, ...args: any[]): any {
    console.log(`[萬法歸一]：正在發動奧義：${mystery.name}...`);
    const result = mystery(...args);
    console.log('[永恆編纂]：奧義執行完成。');
    return result;
  }
}
