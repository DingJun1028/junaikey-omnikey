import { AITableService } from './AITableService';
import fs from 'fs';
import path from 'path';

/**
 * Knowledge Sync Bridge
 * Pushes core strategic documents to OmniTable (AITable) Documents datasheet.
 */
async function syncStrategicAssets() {
  const datasheetId = process.env.AITABLE_DATASHEET_DOCUMENTS || 'dstKnowledgeBase';
  const service = new AITableService(datasheetId);

  const filesToSync = [
    'UNIVERSAL_WISDOM_V4.md',
    'STRATEGIC_SUCCESS_ROADMAP.md',
    'SANCHUANG_DEMO_SCRIPT.md'
  ];

  console.log('🚀 Starting Strategic Knowledge Sync...');

  for (const fileName of filesToSync) {
    const filePath = path.join(process.cwd(), fileName);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      try {
        await service.createRecords([{
          fields: {
            'Title': fileName,
            'Content': content,
            'Category': 'Strategic Asset',
            'Tags': ['V4.0', '5T-Trust', 'Sanchuang'],
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

// Run if called directly
if (require.main === module) {
  syncStrategicAssets();
}

export { syncStrategicAssets };
