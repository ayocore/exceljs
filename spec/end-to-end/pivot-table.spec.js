const fs = require('fs');
const path = require('path');
const {expect} = require('chai');
const JSZip = require('jszip');

const Excel = verquire('exceljs');

const OUT_DIR = path.join(__dirname, '..', 'out');
const PIVOT_FILE = path.join(OUT_DIR, 'e2e-pivot.xlsx');

const TEST_DATA = [
  ['Region', 'Product', 'Category', 'Sales', 'Quantity'],
  ['North', 'Widget A', 'Cat1', 100, 10],
  ['South', 'Widget B', 'Cat2', 200, 20],
  ['North', 'Widget B', 'Cat1', 150, 15],
  ['South', 'Widget A', 'Cat2', 300, 30],
  ['East', 'Widget A', 'Cat1', 250, 25],
];

describe('Pivot Table E2E', () => {
  before(() => {
    if (!fs.existsSync(OUT_DIR)) {
      fs.mkdirSync(OUT_DIR, {recursive: true});
    }
  });

  after(() => {
    if (fs.existsSync(PIVOT_FILE)) {
      fs.unlinkSync(PIVOT_FILE);
    }
  });

  it('creates a workbook with a pivot table and reads back', async function() {
    this.timeout(10000);

    const wb = new Excel.Workbook();
    const dataSheet = wb.addWorksheet('Data');
    dataSheet.addRows(TEST_DATA);

    const pivotSheet = wb.addWorksheet('Pivot');
    pivotSheet.addPivotTable({
      sourceSheet: dataSheet,
      rows: ['Region', 'Product'],
      columns: ['Category'],
      values: ['Sales'],
      metric: 'sum',
    });

    await wb.xlsx.writeFile(PIVOT_FILE);

    // verify file structure
    const buffer = fs.readFileSync(PIVOT_FILE);
    const zip = await JSZip.loadAsync(buffer);

    expect(zip.files['xl/pivotTables/pivotTable1.xml']).to.not.be.undefined();
    expect(zip.files['xl/pivotCache/pivotCacheDefinition1.xml']).to.not.be.undefined();
    expect(zip.files['xl/pivotCache/pivotCacheRecords1.xml']).to.not.be.undefined();

    // verify pivot cache records contain correct data
    const recordsXml = await zip.files['xl/pivotCache/pivotCacheRecords1.xml'].async('string');
    expect(recordsXml).to.contain('<r>');
    expect(recordsXml).to.contain('count="5"'); // 5 data rows

    // verify source data not mutated (splice→slice fix)
    const col1Values = dataSheet.getColumn(1).values;
    expect(col1Values.length).to.be.greaterThan(1);
    expect(col1Values[1]).to.equal('Region');
  });

  it('creates multiple pivot tables from same source', async function() {
    this.timeout(10000);

    const wb = new Excel.Workbook();
    const dataSheet = wb.addWorksheet('Data');
    dataSheet.addRows(TEST_DATA);

    const pivotSheet1 = wb.addWorksheet('Pivot1');
    pivotSheet1.addPivotTable({
      sourceSheet: dataSheet,
      rows: ['Region'],
      columns: ['Category'],
      values: ['Sales'],
      metric: 'sum',
    });

    const pivotSheet2 = wb.addWorksheet('Pivot2');
    pivotSheet2.addPivotTable({
      sourceSheet: dataSheet,
      rows: ['Product'],
      columns: ['Region'],
      values: ['Quantity'],
      metric: 'sum',
    });

    const buffer = await wb.xlsx.writeBuffer();
    const zip = await JSZip.loadAsync(buffer);

    expect(zip.files['xl/pivotTables/pivotTable1.xml']).to.not.be.undefined();
    expect(zip.files['xl/pivotTables/pivotTable2.xml']).to.not.be.undefined();

    // each pivot table should have unique UID
    const pt1 = await zip.files['xl/pivotTables/pivotTable1.xml'].async('string');
    const pt2 = await zip.files['xl/pivotTables/pivotTable2.xml'].async('string');
    const uid1 = pt1.match(/xr:uid="([^"]+)"/)[1];
    const uid2 = pt2.match(/xr:uid="([^"]+)"/)[1];
    expect(uid1).to.not.equal(uid2);
  });
});
