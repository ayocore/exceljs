# Open PRs from exceljs/exceljs

Список открытых PR из оригинального репозитория, проанализированных на релевантность для нашего форка.
Источник: https://github.com/exceljs/exceljs/pulls

> Последнее обновление: 2026-03-29

---

## ✅ ПОРТИРОВАТЬ — Баги, подтверждённые в нашем коде

### #2915 — Fix WorkbookReader: sharedString вместо реального значения (👍 3)
- **Автор:** @AnechaS | **Дата:** 2025-04-08
- **Суть:** Race condition в `workbook-reader.js` — sharedStrings не успевает распарситься до чтения ячеек.
- **Наш код:** Баг есть. Файл: `lib/stream/xlsx/workbook-reader.js` (строки 81-82, 87).
- **Фикс:** Заменить `stream.pipe(zip)` + `iterateStream(zip)` на `stream.pipe(unzip.Parse(...))` + `for await (const entry of zip)`.
- **Сложность:** Тривиально (3 строки).
- https://github.com/exceljs/exceljs/pull/2915

### #2807 — Fix pageSetUpPr ordering в sheetPr (👍 1)
- **Автор:** @strelok372 | **Дата:** 2024-08-12
- **Суть:** `outlinePr` должен рендериться ДО `pageSetUpPr` по спеке OOXML — иначе файл битый.
- **Наш код:** Баг есть. Файл: `lib/xlsx/xform/sheet/sheet-properties-xform.js` (строки 12-13, 28-29).
- **Фикс:** Поменять местами порядок в `this.map` и в `render()`.
- **Сложность:** Тривиально (2 свапа).
- https://github.com/exceljs/exceljs/pull/2807

### #2851 — Fix парсинга `<strike val="0"/>` (boolean attrs)
- **Автор:** @Jason33Wang | **Дата:** 2024-11-26
- **Суть:** `BooleanXform` игнорирует `val="0"` и всегда возвращает `true`. Ломает strike, bold, italic.
- **Наш код:** Баг есть. Файл: `lib/xlsx/xform/simple/boolean-xform.js` (строка 20).
- **Фикс:** `this.model = true` → `this.model = node.attributes.val !== "0"`.
- **Сложность:** Тривиально (1 строка).
- https://github.com/exceljs/exceljs/pull/2851

### #2803 — Fix corrupted file с conditional formatting и hyperlinks
- **Автор:** @TheAsda | **Дата:** 2024-08-01
- **Суть:** Stream writer рендерит hyperlinks ДО conditionalFormatting — нарушение порядка OOXML.
- **Наш код:** Баг есть. Файл: `lib/stream/xlsx/worksheet-writer.js` (строки 240-241).
- **Фикс:** Поменять местами `_writeHyperlinks()` и `_writeConditionalFormatting()`.
- **Сложность:** Тривиально (1 свап).
- https://github.com/exceljs/exceljs/pull/2803

### #2956 — Fix dateToExcel() для не-числовых значений
- **Автор:** @davepuchyr | **Дата:** 2025-08-12
- **Суть:** `dateToExcel()` возвращает NaN → ломает файл при сохранении.
- **Наш код:** Баг есть. Файл: `lib/utils/utils.js` (строка 60).
- **Фикс:** Добавить `if (!Number.isFinite(v)) return v;` перед вычислением.
- **Сложность:** Тривиально (1 строка).
- https://github.com/exceljs/exceljs/pull/2956

### #2737 — Не рендерить пустые rich text подстроки
- **Автор:** @Blackhol3 | **Дата:** 2024-04-07
- **Суть:** Пустые `<r><t></t></r>` ноды — Excel не может открыть файл.
- **Наш код:** Баг есть. Файл: `lib/xlsx/xform/strings/rich-text-xform.js` (после строки 37).
- **Фикс:** Добавить `if (model.text === '') return;` в начале `render()`.
- **Сложность:** Тривиально (2 строки).
- https://github.com/exceljs/exceljs/pull/2737

### #2781 — Fix: setting cell style мутирует shared object
- **Автор:** @gmahomarf | **Дата:** 2024-06-24
- **Суть:** Изменение стиля одной ячейки мутирует стили других ячеек (shared object). Fixes #2055.
- **Наш код:** Баг есть. Файл: `lib/doc/cell.js` (сеттеры стилей). `copyStyle` утилита уже есть.
- **Фикс:** Добавить `_applyStyle()` метод с клонированием через `copyStyle`, использовать во всех 6 сеттерах.
- **Сложность:** Низкая (10 строк).
- https://github.com/exceljs/exceljs/pull/2781

### #2973 — Fix парсинга dynamicFilter в таблицах
- **Автор:** @johnnyoshika | **Дата:** 2025-09-22
- **Суть:** Краш при открытии Excel файлов с dynamic filters в таблицах.
- **Наш код:** Баг есть. Файл: `lib/xlsx/xform/table/filter-column-xform.js` (строка 72).
- **Фикс:** Добавить `case 'dynamicFilter': return true;` перед `default`.
- **Сложность:** Тривиально (2 строки).
- https://github.com/exceljs/exceljs/pull/2973

### #2996 — XML special characters и null values в pivot tables
- **Автор:** @protobi-pieter | **Дата:** 2025-11-07
- **Суть:** Спецсимволы (`&`, `<`, `>`) не экранируются в именах полей pivot table. Null значения крэшат.
- **Наш код:** Баг есть. Файлы: `lib/xlsx/xform/pivot-table/cache-field.js`, `pivot-cache-records-xform.js`.
- **Фикс:** Добавить `escapeXml()` + guard для null/undefined → `<m />`.
- **Сложность:** Низкая (15 строк).
- https://github.com/exceljs/exceljs/pull/2996

### #2962 — Handle missing `r` attribute в row и cell элементах
- **Автор:** @Diluka | **Дата:** 2025-08-25
- **Суть:** Некоторые Excel-генераторы опускают атрибут `r` — парсер получает NaN. Fix #2961.
- **Наш код:** Баг есть. Файл: `lib/xlsx/xform/sheet/row-xform.js`.
- **Фикс:** Добавить `currentAddress` трекер и `setCurrentAddress()` метод с fallback логикой.
- **Сложность:** Средняя (30 строк).
- https://github.com/exceljs/exceljs/pull/2962

### #2920 — Оптимизация проверки мержей (performance)
- **Автор:** @3ximus | **Дата:** 2025-04-17
- **Суть:** O(N) проход по всем merge ranges → заменить на проверку `cell.isMerged` по ячейкам.
- **Наш код:** Баг есть. Файл: `lib/doc/worksheet.js` (строки 615-636).
- **Фикс:** Убрать `_.each(this._merges, ...)` цикл, проверять `isMerged` на каждой ячейке.
- **Сложность:** Низкая (15 строк).
- https://github.com/exceljs/exceljs/pull/2920

### #2894 — Fix parse-sax.js: сломанные UTF-8 строки
- **Автор:** @maoxian-1 | **Дата:** 2025-03-03
- **Суть:** Chunk boundary попадает в середину multi-byte UTF-8 символа → мусор. Fix #2084.
- **Наш код:** Баг есть. Файл: `lib/utils/parse-sax.js` (строка 20).
- **Фикс:** Буферизация чанков с разбиением по последнему `>` для безопасного toString.
- **Сложность:** Средняя (10 строк).
- https://github.com/exceljs/exceljs/pull/2894

### #2874 — Fix race conditions в iterate-stream
- **Автор:** @StevenGee3398 | **Дата:** 2025-01-03
- **Суть:** Race conditions в `iterate-stream.js` — потеря данных, утечки, зависания.
- **Наш код:** Баг есть. Файл: `lib/utils/iterate-stream.js`.
- **Фикс:** Переписать с `events.once()`, persistent listeners, cleanup в `finally`.
- **Сложность:** Средняя (полная замена файла).
- https://github.com/exceljs/exceljs/pull/2874

---

## ⏳ РАССМОТРЕТЬ — Полезно, но требует оценки

### #2867 — styleCacheMode: до 3x улучшение производительности
- **Автор:** @brunoargolo | **Дата:** 2024-12-19
- **Суть:** WeakMap кэш стилей не попадает при merged стилях → 4 режима кэширования (WEAK_MAP, JSON_MAP, FAST_MAP, NO_CACHE).
- **Наш код:** Проблема есть. Файлы: `styles-xform.js`, `workbook-writer.js`, `xlsx.js`, `cell.js` + новый `style-fast-serialize.js`.
- **Сложность:** Средняя (новый файл 312 строк + 4 файла). Обратно совместимо — default остаётся WEAK_MAP.
- https://github.com/exceljs/exceljs/pull/2867

### #2998 — Fix getTable().addRow() для загруженных таблиц
- **Автор:** @protobi-pieter | **Дата:** 2025-11-07
- **Суть:** 4 бага: addRow не обновляет refs/commit, loaded tables без worksheet ref, autoFilterRef считается неправильно.
- **Наш код:** Все 4 бага есть. Файлы: `lib/doc/table.js`, `lib/doc/worksheet.js`.
- **Сложность:** Средняя (несколько методов + фикс конструктора).
- https://github.com/exceljs/exceljs/pull/2998

### #2995 — Поддержка нескольких pivot tables из одного источника
- **Автор:** @protobi-pieter | **Дата:** 2025-11-07
- **Суть:** Снимает ограничение "1 pivot table на файл". Также фиксит `.splice(2)` → `.slice(2)` (мутирует данные!).
- **Наш код:** Ограничение и splice-баг есть. Файлы: `pivot-table.js`, `worksheet.js`, `pivot-table-xform.js`, `worksheet-xform.js`.
- **Сложность:** Высокая (4 файла). Минимум — портировать `splice→slice` баг-фикс.
- https://github.com/exceljs/exceljs/pull/2995

---

## ❌ ПРОПУСТИТЬ — Не касается нашего форка

### #2744 — Bump unzipper (👍 3)
- У нас уже обновлён.

### #2849 — Web-native streams (👍 1)
- Мы server-only, Web Streams API не нужен.

### #2989 — Fix transitive deps archiver (👍 1)
- Проверить наш archiver — возможно уже исправлено при обновлении зависимостей.

### #2891 — Dependencies bump
- У нас зависимости уже обновлены отдельно.

### #3020 — Поддержка HAN CELL файлов
- Нишевый формат, портировать по запросу.

### #3019 — Data bar CF defaults
- Портировать при необходимости использования data bars.

### #3011, #3003, #2930, #2912, #2783 — Docs/typos
- Документация — неактуально для форка.

### #2999, #2869, #2812 — Dependencies bump дубликаты
- Уже решено в нашем форке.

### #2847 — Unnamed PR (Shuntagami patch 1)
- Неясный контент.

### #2846 — Compat with non-office generated files
- Портировать по запросу.

### #2809 — Quote prefix feature
- Нишевая фича, портировать по запросу.

### #2800, #2791 — Stream reader fixes
- Возможно перекрываются с #2915 и #2874.

### #2779 — Debug logs
- Не нужно в продакшн-форке.

### #2752 — CSV ячейки с пробелами → 0
- Портировать если используем CSV чтение.

### #2767 — Валидация имён таблиц (👍 1)
- Nice-to-have, портировать по запросу.

### #2977, #2978 — Autofilter / validation ranges
- Портировать при необходимости.

### #2876 — Fix добавления изображений
- Портировать при работе с изображениями.

### #2924 — Anchor positioning
- Портировать при работе с изображениями.

### #2903 — Удаление изображений
- Фича, портировать по запросу.

### #2983 — ImageEditAs twoCell
- Фича, портировать по запросу.

### #2991 — getFirstWorksheet()
- Nice-to-have, портировать по запросу.

### #2997 — applyWidthHeightFormats для pivot
- Nice-to-have, портировать по запросу.

### #2885 — Метрика count для pivot
- Фича, портировать по запросу.

### #2883 — Expressions без formulae
- Портировать по запросу.

### #2002 — Stream merge cells info
- Портировать при использовании стриминга с мержами.
