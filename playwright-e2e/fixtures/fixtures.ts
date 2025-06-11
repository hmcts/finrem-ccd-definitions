import { mergeTests, mergeExpects } from '@playwright/test';
import { test as create } from './create-fixture';
import { test as a11yTest, expect as a11yExpect } from './axe-fixture';
import { CcdApi } from '../data-utils/CcdApi';

export const test = mergeTests(create, a11yTest);
export const expect = mergeExpects(a11yExpect);
export const ccdApi = new CcdApi();
