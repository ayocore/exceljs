const PivotCacheRecordsXform = verquire('xlsx/xform/pivot-table/pivot-cache-records-xform');
const XmlStream = verquire('utils/xml-stream');

describe('PivotCacheRecordsXform', () => {
  it('has correct tag', () => {
    const xform = new PivotCacheRecordsXform();
    expect(xform.tag).to.equal('pivotCacheRecords');
  });

  it('renders cache records with shared items', () => {
    const xform = new PivotCacheRecordsXform();
    const xmlStream = new XmlStream();

    // getSheetValues returns sparse array: index 0 is undefined, index 1 is header
    const mockSheet = {
      getSheetValues() {
        return [
          undefined, // 0
          [undefined, 'Region', 'Value'], // row 1 (header)
          [undefined, 'North', 10], // row 2
          [undefined, 'South', 20], // row 3
        ];
      },
    };

    xform.render(xmlStream, {
      sourceSheet: mockSheet,
      cacheFields: [
        {name: 'Region', sharedItems: ['North', 'South']},
        {name: 'Value', sharedItems: null},
      ],
    });

    const {xml} = xmlStream;
    expect(xml).to.contain('pivotCacheRecords');
    expect(xml).to.contain('count="2"');
    expect(xml).to.contain('<r>');
    // North is index 0 in sharedItems
    expect(xml).to.contain('<x v="0" />');
    // South is index 1 in sharedItems
    expect(xml).to.contain('<x v="1" />');
    // numeric values
    expect(xml).to.contain('<n v="10" />');
    expect(xml).to.contain('<n v="20" />');
  });

  it('renders string values for non-numeric non-shared fields', () => {
    const xform = new PivotCacheRecordsXform();
    const xmlStream = new XmlStream();

    const mockSheet = {
      getSheetValues() {
        return [undefined, [undefined, 'Label'], [undefined, 'hello']];
      },
    };

    xform.render(xmlStream, {
      sourceSheet: mockSheet,
      cacheFields: [{name: 'Label', sharedItems: null}],
    });

    const {xml} = xmlStream;
    expect(xml).to.contain('<s v="hello" />');
  });

  it('throws when value not found in shared items', () => {
    const xform = new PivotCacheRecordsXform();
    const xmlStream = new XmlStream();

    const mockSheet = {
      getSheetValues() {
        return [undefined, [undefined, 'Region'], [undefined, 'Unknown']];
      },
    };

    expect(() => {
      xform.render(xmlStream, {
        sourceSheet: mockSheet,
        cacheFields: [{name: 'Region', sharedItems: ['North', 'South']}],
      });
    }).to.throw('"Unknown" not in sharedItems');
  });
});
