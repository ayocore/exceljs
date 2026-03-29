const {expect} = require('chai');

const Excel = verquire('exceljs');

describe('Table addRow E2E', () => {
  it('adds rows to a table and reads back via buffer', async () => {
    // --- Write ---
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet('Sheet1');

    const table = ws.addTable({
      name: 'SalesTable',
      ref: 'A1',
      headerRow: true,
      totalsRow: false,
      style: {theme: 'TableStyleLight1'},
      columns: [
        {name: 'Product', filterButton: true},
        {name: 'Price', filterButton: true},
        {name: 'Quantity', filterButton: true},
      ],
      rows: [
        ['Widget A', 9.99, 100],
        ['Widget B', 14.5, 200],
      ],
    });

    // add a row via addRow
    table.addRow(['Widget C', 19.99, 50]);

    expect(table.table.rows).to.have.lengthOf(3);

    // tableRef should cover header + 3 data rows = 4 rows
    expect(table.table.tableRef).to.contain(':');

    const buffer = await wb.xlsx.writeBuffer();

    // --- Read back ---
    const wb2 = new Excel.Workbook();
    await wb2.xlsx.load(buffer);

    const ws2 = wb2.getWorksheet('Sheet1');
    // row 1: header, row 2-4: data
    expect(ws2.getRow(2).getCell(1).value).to.equal('Widget A');
    expect(ws2.getRow(4).getCell(1).value).to.equal('Widget C');
    expect(ws2.getRow(4).getCell(2).value).to.equal(19.99);
    expect(ws2.getRow(4).getCell(3).value).to.equal(50);
  });

  it('removes rows from a table and reads back', async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet('Sheet1');

    const table = ws.addTable({
      name: 'DataTable',
      ref: 'A1',
      headerRow: true,
      totalsRow: false,
      style: {theme: 'TableStyleLight1'},
      columns: [
        {name: 'Name', filterButton: true},
        {name: 'Score', filterButton: true},
      ],
      rows: [
        ['Alice', 90],
        ['Bob', 80],
        ['Charlie', 70],
      ],
    });

    table.removeRows(0, 1); // remove Alice

    expect(table.table.rows).to.have.lengthOf(2);

    const buffer = await wb.xlsx.writeBuffer();

    const wb2 = new Excel.Workbook();
    await wb2.xlsx.load(buffer);

    const ws2 = wb2.getWorksheet('Sheet1');
    expect(ws2.getRow(2).getCell(1).value).to.equal('Bob');
    expect(ws2.getRow(3).getCell(1).value).to.equal('Charlie');
  });

  it('table loaded from file gets worksheet reference', async () => {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet('Sheet1');

    ws.addTable({
      name: 'LoadTest',
      ref: 'A1',
      headerRow: true,
      totalsRow: false,
      style: {theme: 'TableStyleLight1'},
      columns: [
        {name: 'Col1', filterButton: true},
        {name: 'Col2', filterButton: true},
      ],
      rows: [
        ['a', 1],
        ['b', 2],
      ],
    });

    const buffer = await wb.xlsx.writeBuffer();

    // read back and verify table is usable
    const wb2 = new Excel.Workbook();
    await wb2.xlsx.load(buffer);

    const ws2 = wb2.getWorksheet('Sheet1');
    const tables = ws2.getTables();
    expect(tables).to.have.lengthOf(1);

    const t = ws2.getTable(tables[0].name);
    expect(t).to.not.be.undefined();
    expect(t.table).to.not.be.undefined();
    expect(t.table.name).to.equal('LoadTest');
  });
});
