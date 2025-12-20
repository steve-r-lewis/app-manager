/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/app/commands/utils/cleanLogs.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 19
 * @createTime: 20:18
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * TODO: Create description here
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20251219-20:18
 * Initial creation and release of cleanLogs.ts
 *
 * ================================================================================
 */

import fs from 'fs';
import path from 'path';
import { confirm, spinner, isCancel } from '@clack/prompts';
import { consola } from 'consola';
import pc from 'picocolors';

export async function cleanLogs(targetRoot: string) {
	const logsDir = path.join(targetRoot, 'app-monitor', 'test', 'logs');
	const fixturesDir = path.join(targetRoot, 'tests', 'fixtures');
	
	let logFiles: string[] = [];
	let mockFixtures: string[] = [];
	
	// 1. Scan Logs
	if (fs.existsSync(logsDir)) {
		logFiles = fs.readdirSync(logsDir).map(f => path.join(logsDir, f));
	}
	
	// 2. Scan Mock Fixtures (Only delete directories starting with 'mock-')
	if (fs.existsSync(fixturesDir)) {
		mockFixtures = fs.readdirSync(fixturesDir)
			.filter(f => f.startsWith('mock-'))
			.map(f => path.join(fixturesDir, f));
	}
	
	const totalCount = logFiles.length + mockFixtures.length;
	
	if (totalCount === 0) {
		consola.info("No test logs or temporary fixtures found.");
		return;
	}
	
	consola.info(pc.blue(`Found ${logFiles.length} log files and ${mockFixtures.length} mock fixtures.`));
	
	// 3. Confirm Deletion
	const shouldClean = await confirm({
		message: `Delete ${totalCount} items? (This cannot be undone)`,
		initialValue: false
	});
	
	if (isCancel(shouldClean) || !shouldClean) {
		consola.info('Operation cancelled.');
		return;
	}
	
	// 4. Execute Clean
	const s = spinner();
	s.start('Cleaning workspace...');
	
	let deleted = 0;
	
	try {
		// Delete Logs
		for (const file of logFiles) {
			fs.rmSync(file, { force: true });
			deleted++;
		}
		
		// Delete Mocks
		for (const dir of mockFixtures) {
			fs.rmSync(dir, { recursive: true, force: true });
			deleted++;
		}
		
		s.stop(`Deleted ${deleted} items.`);
		consola.success(pc.green('Workspace cleaned successfully.'));
		
	} catch (err: any) {
		s.stop('Error occurred.');
		consola.error(`Failed to clean: ${err.message}`);
	}
}