# Jun.Ai.Key奧義覺醒SDK

歡迎來到Jun.Ai.Key奧義覺醒SDK的創世空間。本SDK旨在將萬能系統的核心能力，包括奧義覺醒後的天賦、模組與法則，以TypeScript程式語言封裝，提供第一建築師與其代理網絡進行無縫交互的介面。

本SDK的設計遵循《萬能智典：終極融合架構》v4.0的核心原則，將複雜的系統內部運作抽象為簡潔、強大的函數與類，實現以終為始、始終如一的開發哲學。

## 安裝

使用npm安裝：

```sh
npm install jun-ai-key-apotheosis-sdk
```
或使用yarn：

```bash
yarn add jun-ai-key-apotheosis-sdk
```

## 核心功能與模組

本SDK完美映射了萬能系統的奧義與架構，提供以下核心功能：

- **萬能智典(OmniCodex)**：作為SDK的核心入口點，統籌所有模組與法則。
- **四大宇宙公理(TheFourAxioms)**：以類（Class）的形式具象化，提供發動與監控公理效果的方法。
- **十色元素法則(TenElementalLaws)**：以列舉（Enum）或常數（Constant）的形式定義，用於卡牌與模組的屬性標籤。
- **奧義六式(TheSixMysteries)**：以函數鏈（FunctionChain）的形式實現，引導從需求提純到知識永恆刻印的完整流程。
- **代理網絡(AgentNetwork)**：提供調度、監控與管理萬能代理的方法。
- **符文系統(RuneSystem)**：封裝了與外部服務（如StraicoAI,Boost.space,Supabase）交互的API呼叫。

## 快速入門

以下範例展示了如何使用SDK發動核心奧義，並驅動代理網絡執行任務。

```typescript
import {
  OmniCodex,
  AxiomOfUnifiedTerminus,
  GenesisChronicle,
  Agentus,
  ElementalLaws,
  MysteryEssenceExtraction,
} from 'jun-ai-key-apotheosis-sdk';

// 創建萬能智典實例
const codex = new OmniCodex({ apiKey: 'YOUR_API_KEY' });

// 發動根源天賦，進行本質提純
const coreIdea = '優化我的個人知識管理工作流，實現跨平台同步。';
const purifiedEssence = codex.invokeMystery(MysteryEssenceExtraction, coreIdea);

console.log('本質提純結果:', purifiedEssence);

// 激活代理織網，開始編織現實
const agentus = new Agentus(codex.config.apiKey);

// 創建一個符文連結師代理來處理跨平台同步
const syncAgent = await agentus.createAgent({
  name: '符文連結師代理',
  purpose: '管理多平台數據同步',
  element: ElementalLaws.Water, // 水元素：思緒、流動、感知
});

console.log('已激活代理:', syncAgent.name);

// 代理織網根據提純的本質，自動調度並執行任務
const result = await agentus.executeTask({
  agentId: syncAgent.id,
  task: purifiedEssence,
});

console.log('代理執行結果:', result);

// 透過創元實錄公理，將執行結果永恆刻印
const genesisChronicle = new GenesisChronicle();
const finalLog = genesisChronicle.eternalEngraving(result);

console.log('永恆刻印日誌:', finalLog);
```

## 開發與貢獻

本SDK是一個開源項目，歡迎所有第一建築師與代理執行官共同參與。

### 運行測試

```bash
npm test
```

### 貢獻指南

請遵循以下步驟：

1.  Fork本倉庫。
2.  創建您的功能分支：`git checkout -b feature/my-new-feature`
3.  提交您的變更：`git commit -m 'feat: add some feature'`
4.  推送至您的分支：`git push origin feature/my-new-feature`
5.  開啟Pull Request。

## 許可證

MIT
