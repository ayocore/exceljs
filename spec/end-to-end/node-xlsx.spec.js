const fs = require('fs');
const path = require('path');
const {expect} = require('chai');

const Excel = verquire('exceljs');

const OUT_DIR = path.join(__dirname, '..', 'out');
const TEST_FILE = path.join(OUT_DIR, 'e2e-node-report.xlsx');

describe('Node.js XLSX Report', () => {
  before(() => {
    if (!fs.existsSync(OUT_DIR)) {
      fs.mkdirSync(OUT_DIR, {recursive: true});
    }
  });

  after(() => {
    if (fs.existsSync(TEST_FILE)) {
      fs.unlinkSync(TEST_FILE);
    }
  });

  it('creates a styled report and reads it back', async function() {
    this.timeout(10000);

    // --- Write ---
    const wb = new Excel.Workbook();
    wb.creator = 'Aya Platform';
    wb.created = new Date(2026, 0, 1);

    const ws = wb.addWorksheet('Sales Report', {
      headerFooter: {firstHeader: 'Sales Report'},
    });

    ws.columns = [
      {header: 'ID', key: 'id', width: 8},
      {header: 'Product', key: 'product', width: 25},
      {header: 'Quantity', key: 'qty', width: 12},
      {header: 'Price', key: 'price', width: 12},
      {header: 'Total', key: 'total', width: 15},
    ];

    // Style header row
    ws.getRow(1).font = {bold: true, size: 12};
    ws.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FF4472C4'},
    };
    ws.getRow(1).font = {bold: true, color: {argb: 'FFFFFFFF'}};

    // Add data
    const data = [
      {id: 1, product: 'Widget A', qty: 100, price: 9.99, total: 999.0},
      {id: 2, product: 'Widget B', qty: 250, price: 14.5, total: 3625.0},
      {id: 3, product: 'Gadget X', qty: 50, price: 29.99, total: 1499.5},
    ];
    data.forEach(row => ws.addRow(row));

    // Format price/total as currency
    ws.getColumn('price').numFmt = '$#,##0.00';
    ws.getColumn('total').numFmt = '$#,##0.00';

    // Add a summary row
    const summaryRow = ws.addRow({
      product: 'TOTAL',
      qty: {formula: 'SUM(C2:C4)'},
      total: {formula: 'SUM(E2:E4)'},
    });
    summaryRow.font = {bold: true};

    await wb.xlsx.writeFile(TEST_FILE);
    expect(fs.existsSync(TEST_FILE)).to.equal(true);

    const stat = fs.statSync(TEST_FILE);
    expect(stat.size).to.be.greaterThan(0);

    // --- Read back ---
    const wb2 = new Excel.Workbook();
    await wb2.xlsx.readFile(TEST_FILE);

    expect(wb2.creator).to.equal('Aya Platform');
    expect(wb2.worksheets).to.have.lengthOf(1);

    const ws2 = wb2.getWorksheet('Sales Report');
    expect(ws2).to.not.be.undefined();
    expect(ws2.columns).to.have.lengthOf(5);

    // Check header
    expect(ws2.getRow(1).getCell(1).value).to.equal('ID');
    expect(ws2.getRow(1).getCell(2).value).to.equal('Product');

    // Check data (use column numbers — keys are not preserved in xlsx)
    expect(ws2.getRow(2).getCell(2).value).to.equal('Widget A');
    expect(ws2.getRow(3).getCell(3).value).to.equal(250);
    expect(ws2.getRow(4).getCell(4).value).to.equal(29.99);

    // Check summary formula (column E = 5)
    const totalCell = ws2.getRow(5).getCell(5);
    expect(totalCell.formula || totalCell.value.formula).to.equal('SUM(E2:E4)');

    // Check styling preserved
    expect(ws2.getRow(1).font.bold).to.equal(true);
    expect(ws2.getRow(5).font.bold).to.equal(true);
  });

  it('writes and reads via buffer (no file)', async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet('Sheet1');
    ws.getCell('A1').value = 'Hello';
    ws.getCell('B1').value = 42;
    ws.getCell('C1').value = new Date(2026, 2, 28);

    const buffer = await wb.xlsx.writeBuffer();
    expect(buffer).to.be.instanceOf(Buffer);
    expect(buffer.length).to.be.greaterThan(0);

    const wb2 = new Excel.Workbook();
    await wb2.xlsx.load(buffer);

    const ws2 = wb2.getWorksheet('Sheet1');
    expect(ws2.getCell('A1').value).to.equal('Hello');
    expect(ws2.getCell('B1').value).to.equal(42);
    expect(ws2.getCell('C1').value).to.be.instanceOf(Date);
  });
});
