const testXformHelper = require('../test-xform-helper');

const RowXform = verquire('xlsx/xform/sheet/row-xform');
const SharedStringsXform = verquire('xlsx/xform/strings/shared-strings-xform');
const Enums = verquire('doc/enums');

const fakeStyles = {
  addStyleModel(style) {
    return style && JSON.stringify(style) !== '{}' ? 1 : 0;
  },
  getStyleModel(styleId) {
    return styleId ? {numFmt: '#'} : undefined;
  },
};

const fakeHyperlinkMap = {
  getHyperlink() {},
};

const expectations = [
  {
    title: 'Plain',
    create: () => new RowXform(),
    initialModel: {
      number: 1,
      min: 1,
      max: 1,
      style: {},
      cells: [{address: 'A1', type: Enums.ValueType.Number, value: 5}],
    },
    get preparedModel() {
      return this.initialModel;
    },
    xml: '<row r="1" spans="1:1" x14ac:dyDescent="0.25"><c r="A1"><v>5</v></c></row>',
    parsedModel: {
      number: 1,
      min: 1,
      max: 1,
      cells: [{address: 'A1', type: Enums.ValueType.Number, value: 5}],
    },
    reconciledModel: {
      number: 1,
      min: 1,
      max: 1,
      cells: [{address: 'A1', type: Enums.ValueType.Number, value: 5}],
      style: {},
    },
    tests: ['prepare', 'render', 'renderIn', 'parse', 'reconcile'],
    options: {
      sharedStrings: new SharedStringsXform(),
      styles: fakeStyles,
      hyperlinkMap: fakeHyperlinkMap,
    },
  },
  {
    title: 'No spans',
    create: () => new RowXform(),
    initialModel: {
      number: 1,
      style: {},
      cells: [{address: 'A1', type: Enums.ValueType.Number, value: 5}],
    },
    get preparedModel() {
      return this.initialModel;
    },
    xml: '<row r="1" x14ac:dyDescent="0.25"><c r="A1"><v>5</v></c></row>',
    parsedModel: {
      number: 1,
      cells: [{address: 'A1', type: Enums.ValueType.Number, value: 5}],
    },
    reconciledModel: {
      number: 1,
      cells: [{address: 'A1', type: Enums.ValueType.Number, value: 5}],
      style: {},
    },
    tests: ['prepare', 'render', 'renderIn', 'parse', 'reconcile'],
    options: {
      sharedStrings: new SharedStringsXform(),
      styles: fakeStyles,
      hyperlinkMap: fakeHyperlinkMap,
    },
  },
  {
    title: 'Styled',
    create: () => new RowXform(),
    initialModel: {
      number: 2,
      min: 1,
      max: 1,
      style: {numFmt: '#'},
      cells: [{address: 'A2', type: Enums.ValueType.Number, value: 5}],
    },
    preparedModel: {
      number: 2,
      min: 1,
      max: 1,
      style: {numFmt: '#'},
      cells: [{address: 'A2', type: Enums.ValueType.Number, value: 5}],
      styleId: 1,
    },
    xml: '<row r="2" spans="1:1" s="1" customFormat="1" x14ac:dyDescent="0.25"><c r="A2"><v>5</v></c></row>',
    parsedModel: {
      number: 2,
      min: 1,
      max: 1,
      cells: [{address: 'A2', type: Enums.ValueType.Number, value: 5}],
      styleId: 1,
    },
    reconciledModel: {
      number: 2,
      min: 1,
      max: 1,
      style: {numFmt: '#'},
      cells: [{address: 'A2', type: Enums.ValueType.Number, value: 5}],
    },
    tests: ['prepare', 'render', 'renderIn', 'parse', 'reconcile'],
    options: {
      sharedStrings: new SharedStringsXform(),
      styles: fakeStyles,
      hyperlinkMap: fakeHyperlinkMap,
    },
  },
  {
    title: 'Outline',
    create: () => new RowXform(),
    initialModel: {
      number: 2,
      min: 1,
      max: 1,
      style: {numFmt: '#'},
      cells: [{address: 'A2', type: Enums.ValueType.Number, value: 5}],
      outlineLevel: 1,
      collapsed: true,
    },
    preparedModel: {
      number: 2,
      min: 1,
      max: 1,
      style: {numFmt: '#'},
      cells: [{address: 'A2', type: Enums.ValueType.Number, value: 5}],
      outlineLevel: 1,
      styleId: 1,
      collapsed: true,
    },
    xml: '<row r="2" spans="1:1" s="1" customFormat="1" outlineLevel="1" collapsed="1" x14ac:dyDescent="0.25"><c r="A2"><v>5</v></c></row>',
    parsedModel: {
      number: 2,
      min: 1,
      max: 1,
      cells: [{address: 'A2', type: Enums.ValueType.Number, value: 5}],
      outlineLevel: 1,
      collapsed: true,
      styleId: 1,
    },
    reconciledModel: {
      number: 2,
      min: 1,
      max: 1,
      style: {numFmt: '#'},
      cells: [{address: 'A2', type: Enums.ValueType.Number, value: 5}],
      outlineLevel: 1,
      collapsed: true,
    },
    tests: ['prepare', 'render', 'renderIn', 'parse', 'reconcile'],
    options: {
      sharedStrings: new SharedStringsXform(),
      styles: fakeStyles,
      hyperlinkMap: fakeHyperlinkMap,
    },
  },
];

describe('RowXform', () => {
  testXformHelper(expectations);

  describe('missing r attribute', () => {
    it('synthesizes row number when r is missing', () => {
      const xform = new RowXform();
      xform.numRowsSeen = 0;

      // first row without r attribute
      xform.parseOpen({name: 'row', attributes: {spans: '1:1'}});
      expect(xform.model.number).to.equal(1);

      // simulate closing the first row
      xform.parseClose('row');

      // second row without r attribute
      xform.parseOpen({name: 'row', attributes: {spans: '1:1'}});
      expect(xform.model.number).to.equal(2);
    });

    it('synthesizes cell address when r is missing on c', () => {
      const xform = new RowXform();
      xform.numRowsSeen = 0;

      xform.parseOpen({name: 'row', attributes: {r: '1', spans: '1:2'}});
      // first cell without r
      xform.parseOpen({name: 'c', attributes: {}});
      expect(xform.parser).to.not.be.undefined();
    });

    it('uses r attribute when present', () => {
      const xform = new RowXform();
      xform.numRowsSeen = 0;

      xform.parseOpen({name: 'row', attributes: {r: '5', spans: '1:1'}});
      expect(xform.model.number).to.equal(5);
    });
  });
});
