/**
 * Minimal i18n framework (no dependencies)
 * BCM App - Business Continuity Management
 *
 * Supports Estonian (et) and English (en) languages
 */

import { et } from './et.js';
import { en } from './en.js';

// Storage key for language preference
const LANG_STORAGE_KEY = 'bcm_lang';

// Default language
const DEFAULT_LANG = 'et';

// Available translations
const translations = {
  et,
  en
};

// Track missing keys to warn only once per key
const warnedKeys = new Set();

/**
 * Get the current language setting
 * @returns {'et' | 'en'} Current language code
 */
export function getLang() {
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (stored === 'et' || stored === 'en') {
      return stored;
    }
  } catch (e) {
    // localStorage might not be available
    console.warn('i18n: localStorage not accessible', e);
  }
  return DEFAULT_LANG;
}

/**
 * Set the current language
 * @param {'et' | 'en'} lang - Language code to set
 * @returns {boolean} True if successful, false otherwise
 */
export function setLang(lang) {
  if (lang !== 'et' && lang !== 'en') {
    console.error(`i18n: Invalid language "${lang}". Must be "et" or "en".`);
    return false;
  }

  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    return true;
  } catch (e) {
    console.error('i18n: Failed to save language preference', e);
    return false;
  }
}

/**
 * Get nested object value by dot-notation path
 * @param {Object} obj - Object to traverse
 * @param {string} path - Dot-notation path (e.g., "incident.metrics.title")
 * @returns {*} Value at path, or undefined if not found
 */
function getNestedValue(obj, path) {
  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }

  return current;
}

/**
 * Replace placeholders in string with provided variables
 * @param {string} str - String with placeholders like "{count}", "{name}"
 * @param {Object} vars - Object with replacement values
 * @returns {string} String with replaced values
 */
function replacePlaceholders(str, vars) {
  if (!vars || typeof vars !== 'object') {
    return str;
  }

  return str.replace(/\{(\w+)\}/g, (match, key) => {
    if (key in vars) {
      return String(vars[key]);
    }
    return match; // Keep placeholder if variable not provided
  });
}

/**
 * Translate a key to the current language
 * @param {string} key - Translation key in dot notation (e.g., "common.save")
 * @param {Object} [vars] - Optional variables for placeholder replacement
 * @returns {string} Translated string
 *
 * @example
 * t('common.save') // Returns "Salvesta" (if lang=et) or "Save" (if lang=en)
 * t('contacts.count.found', { count: 5 }) // Returns "5 kontakti leitud"
 * t('missing.key') // Returns "missing.key" and warns once
 */
export function t(key, vars) {
  const lang = getLang();
  const translation = translations[lang];

  if (!translation) {
    console.error(`i18n: No translation data for language "${lang}"`);
    return key;
  }

  const value = getNestedValue(translation, key);

  if (value === undefined) {
    // Warn only once per missing key
    if (!warnedKeys.has(key)) {
      console.warn(`i18n: Missing translation key "${key}" for language "${lang}"`);
      warnedKeys.add(key);
    }
    return key; // Return the key itself as fallback
  }

  if (typeof value !== 'string') {
    console.error(`i18n: Translation key "${key}" is not a string (got ${typeof value})`);
    return key;
  }

  // Replace placeholders if vars provided
  if (vars) {
    return replacePlaceholders(value, vars);
  }

  return value;
}

/**
 * Get all available language codes
 * @returns {string[]} Array of available language codes
 */
export function getAvailableLanguages() {
  return Object.keys(translations);
}

/**
 * Check if a translation key exists
 * @param {string} key - Translation key to check
 * @param {string} [lang] - Optional language code (defaults to current language)
 * @returns {boolean} True if key exists
 */
export function hasKey(key, lang) {
  const targetLang = lang || getLang();
  const translation = translations[targetLang];

  if (!translation) {
    return false;
  }

  return getNestedValue(translation, key) !== undefined;
}

/**
 * Clear the missing keys warning cache
 * Useful for testing or when you want to re-enable warnings for already-seen keys
 */
export function clearWarningCache() {
  warnedKeys.clear();
}

// ===========================================================================
// DOM translation layer
// ===========================================================================

/**
 * Registry of callbacks that re-render dynamic (JS-generated) content.
 * Called by applyLang() after translateDOM() so that JS-rendered text
 * (lists, badges, status boxes) is refreshed in the new language.
 */
const rerenderHooks = new Set();

/**
 * Register a callback to be invoked whenever the language changes.
 * Use this for content that is rendered by JS (not static HTML).
 * @param {Function} fn - Re-render callback (no arguments)
 */
export function onLangChange(fn) {
  if (typeof fn === 'function') {
    rerenderHooks.add(fn);
  }
}

/**
 * Translate all elements within a root that carry i18n data-* attributes.
 *
 * Supported attributes:
 *   data-i18n="key"             -> sets textContent
 *   data-i18n-placeholder="key" -> sets placeholder attribute
 *   data-i18n-title="key"       -> sets title attribute
 *   data-i18n-aria-label="key"  -> sets aria-label attribute
 *
 * @param {ParentNode} [root=document] - Subtree to translate
 */
export function translateDOM(root = document) {
  if (!root || typeof root.querySelectorAll !== 'function') {
    return;
  }

  root.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });

  root.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
  });

  root.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
  });

  root.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
    el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria-label')));
  });

  // Keep <html lang> in sync when translating the whole document
  if (root === document && document.documentElement) {
    document.documentElement.setAttribute('lang', getLang());
  }
}

/**
 * Change the active language and refresh the whole UI.
 * 1. Persists the choice (setLang)
 * 2. Re-translates all static DOM (translateDOM)
 * 3. Runs registered re-render hooks for dynamic content
 *
 * @param {'et' | 'en'} lang - Language code
 * @returns {boolean} True if the language was applied
 */
export function applyLang(lang) {
  if (!setLang(lang)) {
    return false;
  }

  translateDOM(document);

  rerenderHooks.forEach(fn => {
    try {
      fn();
    } catch (e) {
      console.error('i18n: re-render hook failed', e);
    }
  });

  return true;
}
