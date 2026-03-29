const PivotTableXform = verquire('xlsx/xform/pivot-table/pivot-table-xform');
const XmlStream = verquire('utils/xml-stream');

describe('PivotTableXform', () => {
  it('has correct tag', () => {
    const xform = new PivotTableXform();
    expect(xform.tag).to.equal('pivotTableDefinition');
  });

  it('renders a pivot table definition', () => {
    const xform = new PivotTableXform();
    const xmlStream = new XmlStream();

    xform.render(xmlStream, {
      rows: [0, 1],
      columns: [2],
      values: [3],
      metric: 'sum',
      cacheId: 1,
      cacheFields: [
        {name: 'Category', sharedItems: ['A', 'B']},
        {name: 'SubCat', sharedItems: ['X', 'Y']},
        {name: 'Region', sharedItems: ['North', 'South']},
        {name: 'Amount', sharedItems: null},
      ],
    });

    const {xml} = xmlStream;
    expect(xml).to.contain('pivotTableDefinition');
    expect(xml).to.contain('cacheId="1"');
    expect(xml).to.contain('dataCaption="Values"');
    expect(xml).to.contain('<location');
    expect(xml).to.contain('<pivotFields count="4"');
    // row fields
    expect(xml).to.contain('<rowFields count="2"');
    expect(xml).to.contain('<field x="0" />');
    expect(xml).to.contain('<field x="1" />');
    // col fields
    expect(xml).to.contain('<colFields count="1"');
    // data fields
    expect(xml).to.contain('<dataFields count="1"');
    expect(xml).to.contain('Sum of Amount');
    expect(xml).to.contain('fld="3"');
    // axis attributes in pivotFields
    expect(xml).to.contain('axis="axisRow"');
    expect(xml).to.contain('axis="axisCol"');
    expect(xml).to.contain('dataField="1"');
  });
});
