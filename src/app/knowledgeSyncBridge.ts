import { AITableService } from './AITableService';
import fs from 'fs';
import path from 'path';

/**
 * Knowledge Sync Bridge
 * Pushes core strategic documents to OmniTable (AITable) Documents datasheet.
 */
async function syncStrategicAssets() {
  const datasheetId = process.env.AITABLE_DATASHEET_DOCUMENTS || 'dstyTKDYxMPciVsWL5';
  const service = new AITableService(datasheetId);

  const filesToSync = [
    'UNIVERSAL_WISDOM_V4.md',
    'STRATEGIC_SUCCESS_ROADMAP.md',
    'SANCHUANG_DEMO_SCRIPT.md',
    'TECHNICAL_ARCHITECTURE_5T.md',
    'POC_MOU_TEMPLATE_V1.md',
    'POC_MOU_LEAD_001_TSMC_A.md',
    'POC_MOU_LEAD_003_CHINA_STEEL_C.md',
    'POC_MOU_LEAD_007_MEDIATEK_G.md',
    'PRIORITY_2_OUTREACH_DRAFTS.md'
  ];

  console.log('🚀 Starting Strategic Knowledge Sync...');

  for (const fileName of filesToSync) {
    const filePath = path.join(process.cwd(), fileName);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      try {
        await service.createRecords([{
          fields: {
            'AssetTitle': fileName,
            'Content': content,
            'Category': 'Strategic Asset',
            'Tags': 'V4.0, 5T-Trust, Sanchuang',
            'Last_Updated': new Date().toISOString()
          }
        }]);
        console.log(`✅ Synced: ${fileName}`);
      } catch (err) {
        console.error(`❌ Failed to sync ${fileName}:`, err);
      }
    }
  }
}

// Run if called directly (ESM way)
const isMain = import.meta.url.endsWith(path.basename(process.argv[1]));
if (isMain) {
  syncStrategicAssets();
}

export { syncStrategicAssets };
