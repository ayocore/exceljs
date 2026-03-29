# Open PRs from exceljs/exceljs

Список открытых PR из оригинального репозитория, отсортированных по популярности.
Источник: https://github.com/exceljs/exceljs/pulls

> Последнее обновление: 2026-03-29

## Приоритетные (👍 3+)

### #2915 — Fix WorkbookReader: sharedString вместо реального значения (👍 3)
- **Автор:** @AnechaS | **Дата:** 2025-04-08
- **Суть:** При чтении через WorkbookReader значения ячеек интерпретировались как sharedString вместо фактического значения.
- **Релевантность:** Критичный баг чтения — стоит портировать.
- https://github.com/exceljs/exceljs/pull/2915

### #2744 — Bump unzipper для устранения проблемы с лицензией (👍 3)
- **Автор:** @dubzzz | **Дата:** 2024-04-15
- **Суть:** Обновление unzipper для решения проблем с лицензированием.
- **Релевантность:** У нас уже обновлён unzipper — неактуально.
- https://github.com/exceljs/exceljs/pull/2744

## Важные фиксы (👍 1)

### #2989 — Fix transitive dependencies (archiver) для Snyk (👍 1)
- **Автор:** @nickiannone-fis | **Дата:** 2025-10-28
- **Суть:** Исправление транзитивных зависимостей archiver для устранения уязвимостей в Snyk.
- https://github.com/exceljs/exceljs/pull/2989

### #2891 — Dependencies bump and code fix (👍 1)
- **Автор:** @rengare | **Дата:** 2025-02-18
- **Суть:** Обновление зависимостей и исправления кода (#2878).
- https://github.com/exceljs/exceljs/pull/2891

### #2849 — Поддержка web-native streams для read/write (👍 1)
- **Автор:** @lionel-rowe | **Дата:** 2024-11-21
- **Суть:** Добавление поддержки нативных Web Streams API для методов чтения/записи. Fixes #1228, #2753.
- **Релевантность:** Неактуально — мы server-only форк.
- https://github.com/exceljs/exceljs/pull/2849

### #2807 — Fix pageSetUpPr ordering в sheetPr (👍 1)
- **Автор:** @strelok372 | **Дата:** 2024-08-12
- **Суть:** Перемещение `pageSetUpPr` в конец `sheetPr` — иначе xlsx файл получается битым.
- **Релевантность:** Стоит портировать — баг генерации файлов.
- https://github.com/exceljs/exceljs/pull/2807

### #2767 — Валидация имён таблиц при создании (👍 1)
- **Автор:** @georgbuehler | **Дата:** 2024-05-24
- **Суть:** Валидация имени Table при создании — бросает ошибку при невалидном имени. Fixes #2675.
- https://github.com/exceljs/exceljs/pull/2767

## Баг-фиксы

### #3020 — Поддержка файлов HAN CELL Excel
- **Автор:** @protobi-pieter | **Дата:** 2026-01-27
- **Суть:** ExcelJS падает при чтении файлов, созданных HAN CELL (корейский софт). Fix #3014.
- https://github.com/exceljs/exceljs/pull/3020

### #3019 — Default values для data bar conditional formatting
- **Автор:** @protobi-pieter | **Дата:** 2026-01-27
- **Суть:** Краш при создании data bar conditional formatting с минимальными параметрами. Fix #3015.
- https://github.com/exceljs/exceljs/pull/3019

### #2998 — Fix getTable().addRow() для загруженных таблиц
- **Автор:** @protobi-pieter | **Дата:** 2025-11-07
- **Суть:** `getTable().addRow()` падает при работе с таблицами, загруженными из Excel файлов.
- **Релевантность:** Стоит портировать — частый сценарий.
- https://github.com/exceljs/exceljs/pull/2998

### #2996 — XML special characters и null values в pivot tables
- **Автор:** @protobi-pieter | **Дата:** 2025-11-07
- **Суть:** Два критичных бага в pivot tables: спецсимволы XML не экранируются, null значения ломают генерацию.
- **Релевантность:** Стоит портировать — мы используем pivot tables.
- https://github.com/exceljs/exceljs/pull/2996

### #2978 — Fix undefined column assignment autofilter
- **Автор:** @hypesystem | **Дата:** 2025-09-25
- **Суть:** Исправление undefined при назначении колонок в autofilter.
- https://github.com/exceljs/exceljs/pull/2978

### #2977 — Fix large validation ranges
- **Автор:** @hypesystem | **Дата:** 2025-09-25
- **Суть:** Clamping диапазона валидации к максимальной строке с данными.
- https://github.com/exceljs/exceljs/pull/2977

### #2973 — Fix парсинга dynamicFilter в таблицах
- **Автор:** @johnnyoshika | **Дата:** 2025-09-22
- **Суть:** Ошибка парсинга узлов `dynamicFilter` в Excel таблицах.
- https://github.com/exceljs/exceljs/pull/2973

### #2962 — Handle missing `r` attribute в row и cell элементах
- **Автор:** @Diluka | **Дата:** 2025-08-25
- **Суть:** Некоторые Excel файлы не имеют атрибута `r` в строках/ячейках — парсер падает. Fix #2961.
- **Релевантность:** Стоит портировать — повышает совместимость.
- https://github.com/exceljs/exceljs/pull/2962

### #2956 — Fix dateToExcel() для не-числовых значений
- **Автор:** @davepuchyr | **Дата:** 2025-08-12
- **Суть:** `dateToExcel()` возвращает NaN для не-числовых значений, что ломает файл при сохранении.
- https://github.com/exceljs/exceljs/pull/2956

### #2920 — Оптимизация проверки мержей для большого кол-ва ячеек
- **Автор:** @3ximus | **Дата:** 2025-04-17
- **Суть:** Неэффективная проверка merge для большого количества объединённых ячеек. Дубликат #2691.
- **Релевантность:** Стоит портировать — performance fix.
- https://github.com/exceljs/exceljs/pull/2920

### #2894 — Fix parse-sax.js: сломанные UTF-8 строки (китайский и др.)
- **Автор:** @maoxian-1 | **Дата:** 2025-03-03
- **Суть:** SAX парсер ломает китайские и другие Unicode строки. Fix #2084.
- https://github.com/exceljs/exceljs/pull/2894

### #2876 — Fix ошибки добавления изображений
- **Автор:** @wwwxy80s | **Дата:** 2025-01-08
- **Суть:** Ошибка при добавлении изображений в определённых ситуациях.
- https://github.com/exceljs/exceljs/pull/2876

### #2874 — Fix race conditions в import/export streams
- **Автор:** @StevenGee3398 | **Дата:** 2025-01-03
- **Суть:** Разные ошибки при работе со стримами — sharedStrings не резолвятся после редактирования .xlsx.
- https://github.com/exceljs/exceljs/pull/2874

### #2867 — styleCacheMode: до 3x улучшение производительности
- **Автор:** @brunoargolo | **Дата:** 2024-12-19
- **Суть:** `useStyles` сильно замедляет запись — из-за WeakMap + объектные хэши стилей. Новый `styleCacheMode` ускоряет до 3x.
- **Релевантность:** Стоит портировать — значимый performance boost.
- https://github.com/exceljs/exceljs/pull/2867

### #2851 — Fix парсинга `<strike val="0"/>`
- **Автор:** @Jason33Wang | **Дата:** 2024-11-26
- **Суть:** Boolean-атрибуты стилей (strike, bold и т.д.) неправильно читают `val="0"` как true.
- https://github.com/exceljs/exceljs/pull/2851

### #2803 — Fix corrupted file с conditional formatting и hyperlinks
- **Автор:** @TheAsda | **Дата:** 2024-08-01
- **Суть:** Stream writer создаёт битый файл при сочетании conditional formatting и hyperlinks.
- https://github.com/exceljs/exceljs/pull/2803

### #2800 — Fix worksheet-reader hidden prop
- **Автор:** @babu-ch | **Дата:** 2024-07-27
- **Суть:** Свойство `hidden` некорректно читается для скрытых листов.
- https://github.com/exceljs/exceljs/pull/2800

### #2791 — Fix xlsx stream missing worksheets
- **Автор:** @LarryKen | **Дата:** 2024-07-07
- **Суть:** При стриминге пропадают worksheets. Issue #2790.
- https://github.com/exceljs/exceljs/pull/2791

### #2781 — Fix: setting cell style clones style object
- **Автор:** @gmahomarf | **Дата:** 2024-06-24
- **Суть:** Установка стиля ячейки мутирует оригинальный объект стиля. Fixes #2055.
- https://github.com/exceljs/exceljs/pull/2781

### #2752 — Fix CSV: ячейки с пробелами конвертируются в 0
- **Автор:** @tlgman | **Дата:** 2024-04-23
- **Суть:** При CSV чтении ячейки, заполненные пробелами, превращаются в 0. Fix #2751.
- https://github.com/exceljs/exceljs/pull/2752

### #2737 — Не рендерить пустые rich text подстроки
- **Автор:** @Blackhol3 | **Дата:** 2024-04-07
- **Суть:** Excel не может открыть файл с пустыми rich text подстроками.
- https://github.com/exceljs/exceljs/pull/2737

## Фичи

### #2995 — Поддержка нескольких pivot tables из одного источника
- **Автор:** @protobi-pieter | **Дата:** 2025-11-07
- **Суть:** Раньше только одна pivot table на файл — теперь несколько из одного или разных worksheets.
- **Релевантность:** Стоит портировать — расширение pivot table функционала.
- https://github.com/exceljs/exceljs/pull/2995

### #2997 — applyWidthHeightFormats для pivot table column widths
- **Автор:** @protobi-pieter | **Дата:** 2025-11-07
- **Суть:** Опция для сохранения ширины колонок вместо дефолтных pivot table стилей.
- https://github.com/exceljs/exceljs/pull/2997

### #2991 — getFirstWorksheet() для безопасного получения первого листа
- **Автор:** @freepad | **Дата:** 2025-11-03
- **Суть:** `getWorksheet(1)` падает после удаления первого листа — новый метод возвращает первый существующий.
- https://github.com/exceljs/exceljs/pull/2991

### #2983 — ImageEditAs тип и 'twoCell' option для addImage
- **Автор:** @hshoja | **Дата:** 2025-10-08
- **Суть:** Добавление типа `ImageEditAs` и поддержка `twoCell` опции в `addImage`.
- https://github.com/exceljs/exceljs/pull/2983

### #2924 — Fix Anchor positioning с кастомными column/row sizes
- **Автор:** @stany-bns | **Дата:** 2025-04-27
- **Суть:** colWidth и rowHeight использовали неправильный scaling factor — некорректное позиционирование изображений.
- https://github.com/exceljs/exceljs/pull/2924

### #2903 — Удаление изображений из Worksheet
- **Автор:** @wwwxy80s | **Дата:** 2025-03-20
- **Суть:** Добавлена поддержка удаления изображений из листа.
- https://github.com/exceljs/exceljs/pull/2903

### #2885 — Метрика 'count' для pivot table
- **Автор:** @dsilva01 | **Дата:** 2025-02-06
- **Суть:** Добавление метрики `count` (помимо `sum`) для pivot tables.
- https://github.com/exceljs/exceljs/pull/2885

### #2883 — Expressions без formulae
- **Автор:** @AndresDSoto | **Дата:** 2025-01-29
- **Суть:** Поддержка выражений без формул.
- https://github.com/exceljs/exceljs/pull/2883

### #2809 — Quote prefix feature
- **Автор:** @ldefelici-mitobit | **Дата:** 2024-08-14
- **Суть:** Добавление 'quote prefix' стиля для ячеек — квотирование содержимого.
- https://github.com/exceljs/exceljs/pull/2809
