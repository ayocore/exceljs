const CacheField = verquire('xlsx/xform/pivot-table/cache-field');

describe('CacheField', () => {
  describe('string type', () => {
    it('renders shared items', () => {
      const field = new CacheField({name: 'Region', sharedItems: ['North', 'South', 'East']});
      const xml = field.render();
      expect(xml).to.contain('name="Region"');
      expect(xml).to.contain('numFmtId="0"');
      expect(xml).to.contain('count="3"');
      expect(xml).to.contain('<s v="North" />');
      expect(xml).to.contain('<s v="South" />');
      expect(xml).to.contain('<s v="East" />');
    });

    it('renders single shared item', () => {
      const field = new CacheField({name: 'Status', sharedItems: ['Active']});
      const xml = field.render();
      expect(xml).to.contain('count="1"');
      expect(xml).to.contain('<s v="Active" />');
    });
  });

  describe('XML escaping', () => {
    it('escapes special characters in field name', () => {
      const field = new CacheField({name: 'Johnson & Johnson', sharedItems: null});
      const xml = field.render();
      expect(xml).to.contain('name="Johnson &amp; Johnson"');
    });

    it('escapes special characters in shared items', () => {
      const field = new CacheField({name: 'Data', sharedItems: ['<value>', 'A&B', '"quoted"']});
      const xml = field.render();
      expect(xml).to.contain('&lt;value&gt;');
      expect(xml).to.contain('A&amp;B');
      expect(xml).to.contain('&quot;quoted&quot;');
    });

    it('handles null in escapeXml', () => {
      const field = new CacheField({name: 'Test', sharedItems: null});
      expect(field.escapeXml(null)).to.equal('');
      expect(field.escapeXml(undefined)).to.equal('');
    });
  });

  describe('integer type', () => {
    it('renders without shared items', () => {
      const field = new CacheField({name: 'Amount', sharedItems: null});
      const xml = field.render();
      expect(xml).to.contain('name="Amount"');
      expect(xml).to.contain('containsString="0"');
      expect(xml).to.contain('containsNumber="1"');
      expect(xml).to.contain('containsInteger="1"');
      expect(xml).not.to.contain('<s v=');
    });
  });
});
