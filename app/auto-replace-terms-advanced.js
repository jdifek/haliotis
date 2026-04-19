#!/usr/bin/env node

/**
 * Продвинутый скрипт для автоматической замены хардкода на terms
 * с умным добавлением импортов и обработкой edge cases
 * 
 * Использование:
 * node auto-replace-terms-advanced.js <directory> [--dry-run] [--verbose]
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { relative, join } from 'path';

const TERM_MAPPINGS = {
  "Book now": "book_now",
  "Book Now": "book_now",
  "Information Legal": "information_legal",
  "Meios de Pagamento": "meios_de_pagamento",
  "Parceiros": "parceiros",
  "Show more courses": "show_more_courses",
  "Show more dives": "show_more_dives",
  "More info": "more_info",
  "More Info": "more_info",
  "Show on Map": "show_on_map",
  "reviews": "reviews",
  "Make sure you are on the right place": "make_sure_you_are_on_the_right_place",
  "Contact us": "contact_us",
  "Contact Us": "contact_us",
  "NEXT": "next",
  "Next": "next",
  "PREV": "prev",
  "Prev": "prev",
  "Categories": "categories",
  "Booking Form": "booking_form",
  "PADI Advanced Open Water Diver": "padi_advanced_open_water_diver",
  "PADI Underwater Naturalist Sesimbra": "padi_underwater_naturalist_sesimbra",
  "Fishes": "fishes",
  "Difficulty": "difficulty",
  "Maximum Depth": "maximum_depth",
  "meters": "meters",
  "PADI OWD": "padi_owd",
  "Find more": "find_more",
  "Find More": "find_more",
  "Show more": "show_more",
  "Show More": "show_more",
  "Respiratory Blends": "respiratory_blends",
  "Calculate Price": "calculate_price",
  "Total price": "total_price",
  "All": "all",
  "ALL": "all",
  "All Categories": "all_categories",
  "Visit our Online Shop": "visit_our_online_shop",
};

class FileProcessor {
  constructor(filePath, dryRun = false, verbose = false) {
    this.filePath = filePath;
    this.dryRun = dryRun;
    this.verbose = verbose;
    this.content = readFileSync(filePath, 'utf8');
    this.newContent = this.content;
    this.changes = [];
    this.modified = false;
  }

  process() {
    if (!this.hasHardcodes()) {
      return null;
    }

    this.addImports();
    this.addTermsSetup();
    this.replaceHardcodes();

    if (this.modified && !this.dryRun) {
      writeFileSync(this.filePath, this.newContent, 'utf8');
    }

    return this.modified ? this.changes : null;
  }

  hasHardcodes() {
    return Object.keys(TERM_MAPPINGS).some(hardcoded => {
      const escaped = this.escapeRegex(hardcoded);
      return new RegExp(`["'\`]${escaped}["'\`]|>${escaped}<`).test(this.content);
    });
  }

  addImports() {
    const imports = [
      {
        check: /from ["']@\/hooks\/useMenu["']/,
        code: 'import { useMenu } from "@/hooks/useMenu";',
        name: 'useMenu'
      },
      {
        check: /import\s+{[^}]*useLocale[^}]*}\s+from ["']next-intl["']/,
        code: 'import { useLocale } from "next-intl";',
        name: 'useLocale'
      },
      {
        check: /from ["']@\/utils\/terms["']/,
        code: 'import { createTermGetter } from "@/utils/terms";',
        name: 'createTermGetter'
      }
    ];

    const missingImports = imports.filter(imp => !imp.check.test(this.newContent));

    if (missingImports.length === 0) return;

    // Находим последний импорт
    const importLines = this.newContent.split('\n');
    let lastImportIndex = -1;

    for (let i = 0; i < importLines.length; i++) {
      if (/^import\s+/.test(importLines[i].trim())) {
        lastImportIndex = i;
      }
    }

    if (lastImportIndex !== -1) {
      // Вставляем после последнего импорта
      const importCodes = missingImports.map(imp => imp.code);
      importLines.splice(lastImportIndex + 1, 0, ...importCodes);
      this.newContent = importLines.join('\n');
      this.modified = true;
      this.changes.push(`+ Добавлены импорты: ${missingImports.map(i => i.name).join(', ')}`);
    } else {
      // Добавляем в начало
      this.newContent = missingImports.map(imp => imp.code).join('\n') + '\n\n' + this.newContent;
      this.modified = true;
      this.changes.push(`+ Добавлены импорты в начало файла`);
    }
  }

  addTermsSetup() {
    // Проверяем, уже ли есть setup
    if (this.newContent.includes('createTermGetter(terms)') || 
        this.newContent.includes('const t = ')) {
      return;
    }

    // Ищем функциональный компонент
    const patterns = [
      // export default function Component
      /export\s+default\s+function\s+\w+\s*\([^)]*\)\s*\{/,
      // export function Component
      /export\s+function\s+\w+\s*\([^)]*\)\s*\{/,
      // const Component = () => {
      /const\s+\w+\s*=\s*\([^)]*\)\s*=>\s*\{/,
      // const Component: React.FC = () => {
      /const\s+\w+:\s*React\.FC[^=]*=\s*\([^)]*\)\s*=>\s*\{/,
    ];

    let functionMatch = null;
    for (const pattern of patterns) {
      functionMatch = this.newContent.match(pattern);
      if (functionMatch) break;
    }

    if (!functionMatch) {
      if (this.verbose) {
        this.changes.push('⚠️  Не найдена функция компонента для добавления setup');
      }
      return;
    }

    const insertPosition = this.newContent.indexOf(functionMatch[0]) + functionMatch[0].length;
    
    // Проверяем отступы
    const lines = this.newContent.split('\n');
    const functionLine = this.newContent.substring(0, insertPosition).split('\n').length - 1;
    const nextLine = lines[functionLine + 1] || '';
    const indent = nextLine.match(/^(\s*)/)?.[1] || '  ';

    const setupCode = `
${indent}const locale = useLocale();
${indent}const { terms } = useMenu(locale);
${indent}const t = createTermGetter(terms);
`;

    this.newContent = 
      this.newContent.slice(0, insertPosition) + 
      setupCode + 
      this.newContent.slice(insertPosition);

    this.modified = true;
    this.changes.push('+ Добавлена инициализация locale, terms и t()');
  }

  replaceHardcodes() {
    let replacementCount = 0;

    Object.entries(TERM_MAPPINGS).forEach(([hardcoded, termKey]) => {
      const escaped = this.escapeRegex(hardcoded);

      // 1. Обработка prop={value} и prop="value"
      // Находим все вхождения prop="Text" или prop='Text'
      const propPattern = new RegExp(
        `(\\w+)=(["'\`])(${escaped})\\2`,
        'g'
      );
      
      this.newContent = this.newContent.replace(propPattern, (match, propName, quote, text) => {
        replacementCount++;
        return `${propName}={t("${termKey}", "${hardcoded}")}`;
      });

      // 2. Обработка >Text< в JSX
      const jsxTextPattern = new RegExp(
        `>(\\s*)(${escaped})(\\s*)<`,
        'g'
      );
      
      this.newContent = this.newContent.replace(jsxTextPattern, (match, space1, text, space2) => {
        replacementCount++;
        return `>${space1}{t("${termKey}", "${hardcoded}")}{space2}<`;
      });

      // 3. Обработка standalone strings (если они ещё остались)
      const standalonePattern = new RegExp(
        `(["'\`])(${escaped})\\1`,
        'g'
      );
      
      // Избегаем замены в импортах и комментариях
      const lines = this.newContent.split('\n');
      this.newContent = lines.map(line => {
        if (line.trim().startsWith('import ') || 
            line.trim().startsWith('//') ||
            line.trim().startsWith('*')) {
          return line;
        }
        
        return line.replace(standalonePattern, (match, quote, text) => {
          replacementCount++;
          return `{t("${termKey}", "${hardcoded}")}`;
        });
      }).join('\n');
    });

    if (replacementCount > 0) {
      this.modified = true;
      this.changes.push(`✓ Заменено ${replacementCount} хардкод${replacementCount === 1 ? '' : 'ов'}`);
    }
  }

  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

function getFilesRecursively(dir, extensions) {
  let results = [];
  
  try {
    const list = readdirSync(dir);
    
    list.forEach(file => {
      const filePath = join(dir, file);
      const stat = statSync(filePath);
      
      if (stat.isDirectory()) {
        if (!['node_modules', '.next', '.git', 'dist', 'build', '.turbo'].includes(file)) {
          results = results.concat(getFilesRecursively(filePath, extensions));
        }
      } else {
        if (extensions.some(ext => filePath.endsWith(ext))) {
          results.push(filePath);
        }
      }
    });
  } catch (err) {
    console.error(`Ошибка чтения директории ${dir}:`, err.message);
  }
  
  return results;
}

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const verbose = args.includes('--verbose') || args.includes('-v');
  const directory = args.find(arg => !arg.startsWith('--')) || './app';
  
  console.log('='.repeat(80));
  console.log(`🚀 Автоматическая миграция на использование Terms из API`);
  console.log('='.repeat(80));
  console.log(`📁 Директория: ${directory}`);
  console.log(`🔧 Режим: ${dryRun ? '🔍 DRY RUN (предпросмотр)' : '✏️  ПРИМЕНЕНИЕ ИЗМЕНЕНИЙ'}`);
  if (verbose) console.log(`📢 Verbose: включен`);
  console.log('='.repeat(80));
  console.log('');
  
  const files = getFilesRecursively(directory, ['.tsx', '.jsx']);
  let modifiedCount = 0;
  const fileResults = [];
  
  files.forEach(filePath => {
    const processor = new FileProcessor(filePath, dryRun, verbose);
    const changes = processor.process();
    
    if (changes) {
      modifiedCount++;
      fileResults.push({ filePath, changes });
    }
  });
  
  // Выводим результаты
  fileResults.forEach(({ filePath, changes }) => {
    console.log(`\n📝 ${relative(process.cwd(), filePath)}`);
    changes.forEach(change => console.log(`   ${change}`));
  });
  
  console.log('');
  console.log('='.repeat(80));
  console.log(`📊 СТАТИСТИКА:`);
  console.log(`   Найдено файлов: ${files.length}`);
  console.log(`   Изменено файлов: ${modifiedCount}`);
  console.log(`   Без изменений: ${files.length - modifiedCount}`);
  console.log('='.repeat(80));
  
  if (dryRun) {
    console.log('');
    console.log('ℹ️  Это был предварительный просмотр (--dry-run)');
    console.log('');
    console.log('Чтобы применить изменения:');
    console.log(`   node auto-replace-terms-advanced.js ${directory}`);
    console.log('');
    console.log('Для подробного вывода добавьте --verbose');
  } else if (modifiedCount > 0) {
    console.log('');
    console.log('✅ Изменения успешно применены!');
    console.log('');
    console.log('📋 Следующие шаги:');
    console.log('   1. git diff                    # Проверьте изменения');
    console.log('   2. npm run dev                 # Протестируйте приложение');
    console.log('   3. Проверьте переключение языков');
    console.log('   4. git add . && git commit     # Закоммитьте если всё ОК');
  } else {
    console.log('');
    console.log('ℹ️  Не найдено файлов для изменения');
  }
  console.log('');
}

main();