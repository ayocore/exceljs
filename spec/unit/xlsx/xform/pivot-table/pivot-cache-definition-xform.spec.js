const PivotCacheDefinitionXform = verquire('xlsx/xform/pivot-table/pivot-cache-definition-xform');
const XmlStream = verquire('utils/xml-stream');

describe('PivotCacheDefinitionXform', () => {
  it('has correct tag', () => {
    const xform = new PivotCacheDefinitionXform();
    expect(xform.tag).to.equal('pivotCacheDefinition');
  });

  it('renders pivot cache definition', () => {
    const xform = new PivotCacheDefinitionXform();
    const xmlStream = new XmlStream();

    const mockSheet = {
      name: 'Data',
      dimensions: {shortRange: 'A1:D10'},
    };

    xform.render(xmlStream, {
      sourceSheet: mockSheet,
      cacheFields: [
        {name: 'Region', sharedItems: ['North', 'South']},
        {name: 'Amount', sharedItems: null},
      ],
    });

    const {xml} = xmlStream;
    expect(xml).to.contain('pivotCacheDefinition');
    expect(xml).to.contain('r:id="rId1"');
    expect(xml).to.contain('refreshOnLoad="1"');
    expect(xml).to.contain('<cacheSource');
    expect(xml).to.contain('type="worksheet"');
    expect(xml).to.contain('ref="A1:D10"');
    expect(xml).to.contain('sheet="Data"');
    expect(xml).to.contain('<cacheFields count="2"');
    expect(xml).to.contain('name="Region"');
    expect(xml).to.contain('name="Amount"');
  });

  it('prepare is a no-op', () => {
    const xform = new PivotCacheDefinitionXform();
    // should not throw
    xform.prepare({});
  });
});
