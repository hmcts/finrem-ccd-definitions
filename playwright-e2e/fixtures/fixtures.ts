import { mergeTests, mergeExpects, test as base } from '@playwright/test';
import { test as create } from './create-fixture';
import { test as a11yTest, expect as a11yExpect } from './axe-fixture';
import { CcdApi } from '../data-utils/api/CcdApi';
import {CaseAssignmentApi} from '../data-utils/api/CaseAssignmentApi.ts';
import {saveApiCountsToJson} from '../data-utils/api/ApiCounter.ts';

export const trial = base.extend<{},{ forEachWorker: void}>({
  forEachWorker: [async ({}, use, testInfo) => {
    console.log(`---- Starting new worker ${testInfo.workerIndex}`);
    await use();
    console.log(`---- DONE with worker ${testInfo.workerIndex}`);
    await saveApiCountsToJson();
  }, { scope: 'worker', auto: true }]
});
export const test = mergeTests(create, a11yTest, trial);
export const expect = mergeExpects(a11yExpect);
export const ccdApi = new CcdApi();
export const caseAssignmentApi = new CaseAssignmentApi();
