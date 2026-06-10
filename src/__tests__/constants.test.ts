import { describe, it, expect } from 'vitest';
import { QUICK_START_TEMPLATES, PLAYBOOK_OPTIONS } from '../../constants';

describe('QUICK_START_TEMPLATES', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(QUICK_START_TEMPLATES)).toBe(true);
    expect(QUICK_START_TEMPLATES.length).toBeGreaterThan(0);
  });

  it('every template has a non-empty name', () => {
    for (const tpl of QUICK_START_TEMPLATES) {
      expect(typeof tpl.name).toBe('string');
      expect(tpl.name.length).toBeGreaterThan(0);
    }
  });

  it('every template has a non-empty description', () => {
    for (const tpl of QUICK_START_TEMPLATES) {
      expect(typeof tpl.description).toBe('string');
      expect(tpl.description.length).toBeGreaterThan(0);
    }
  });

  it('every template has a selections object', () => {
    for (const tpl of QUICK_START_TEMPLATES) {
      expect(tpl.selections).toBeTruthy();
      expect(typeof tpl.selections).toBe('object');
    }
  });
});

describe('PLAYBOOK_OPTIONS', () => {
  it('is a non-empty object', () => {
    expect(PLAYBOOK_OPTIONS).toBeTruthy();
    expect(typeof PLAYBOOK_OPTIONS).toBe('object');
    expect(Object.keys(PLAYBOOK_OPTIONS).length).toBeGreaterThan(0);
  });

  it('every option category has a non-empty array of items', () => {
    for (const [category, items] of Object.entries(PLAYBOOK_OPTIONS)) {
      expect(Array.isArray(items), `${category} should be array`).toBe(true);
      expect((items as unknown[]).length, `${category} should be non-empty`).toBeGreaterThan(0);
    }
  });
});

