#!/usr/bin/env node

/**
 * Скрипт для автоматической замены хардкода на использование terms из API
 * 
 * Использование:
 * node replace-hardcoded-terms.js
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { relative, join } from 'path';

// Маппинг: хардкод → ключ в terms
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

function generateReport(directory) {
  console.log('='.repeat(80));
  console.log('ОТЧЕТ: Найденные хардкоды, которые нужно заменить на terms');
  console.log('='.repeat(80));
  console.log('');
  
  const files = getFilesRecursively(directory, ['.tsx', '.jsx']);
  let totalFindings = 0;
  
  files.forEach(filePath => {
    const content = readFileSync(filePath, 'utf8');
    const findings = [];
    
    Object.entries(TERM_MAPPINGS).forEach(([hardcoded, termKey]) => {
      // Ищем строковые литералы с этим текстом
      const patterns = [
        new RegExp(`["']${escapeRegex(hardcoded)}["']`, 'g'),
        new RegExp(`label=["']${escapeRegex(hardcoded)}["']`, 'g'),
        new RegExp(`>{hardcoded}<`, 'g'),
      ];
      
      patterns.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
          findings.push({
            hardcoded,
            termKey,
            count: matches.length
          });
        }
      });
    });
    
    if (findings.length > 0) {
      console.log(`\n📄 ${relative(process.cwd(), filePath)}`);
      findings.forEach(({ hardcoded, termKey, count }) => {
        console.log(`   "${hardcoded}" → t("${termKey}") [${count} вхождений]`);
        totalFindings += count;
      });
    }
  });
  
  console.log('');
  console.log('='.repeat(80));
  console.log(`Всего найдено: ${totalFindings} хардкодов для замены`);
  console.log('='.repeat(80));
  console.log('');
  console.log('Рекомендации:');
  console.log('1. Добавьте в каждый компонент: import { useMenu } from "@/hooks/useMenu"');
  console.log('2. Добавьте: import { createTermGetter } from "@/utils/terms"');
  console.log('3. В компоненте: const { terms } = useMenu(locale); const t = createTermGetter(terms);');
  console.log('4. Замените хардкод на вызов t("term_key", "Fallback")');
  console.log('');
}

function getFilesRecursively(dir, extensions) {
  let results = [];
  const list = readdirSync(dir);
  
  list.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!['node_modules', '.next', '.git', 'dist', 'build'].includes(file)) {
        results = results.concat(getFilesRecursively(filePath, extensions));
      }
    } else {
      if (extensions.some(ext => filePath.endsWith(ext))) {
        results.push(filePath);
      }
    }
  });
  
  return results;
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Запуск
const targetDir = process.argv[2] || './app';
generateReport(targetDir);