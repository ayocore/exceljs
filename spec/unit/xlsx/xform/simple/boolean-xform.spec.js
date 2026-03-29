const testXformHelper = require('../test-xform-helper');

const BooleanXform = verquire('xlsx/xform/simple/boolean-xform');

const expectations = [
  {
    title: 'true',
    create() {
      return new BooleanXform({tag: 'boolean', attr: 'val'});
    },
    preparedModel: true,
    get parsedModel() {
      return this.preparedModel;
    },
    xml: '<boolean/>',
    tests: ['render', 'renderIn', 'parse'],
  },
  {
    title: 'false',
    create() {
      return new BooleanXform({tag: 'boolean', attr: 'val'});
    },
    preparedModel: false,
    xml: '',
    tests: ['render', 'renderIn'],
  },
  {
    title: 'undefined',
    create() {
      return new BooleanXform({tag: 'boolean', attr: 'val'});
    },
    preparedModel: undefined,
    xml: '',
    tests: ['render', 'renderIn'],
  },
];

describe('BooleanXform', () => {
  testXformHelper(expectations);

  it('parses val="0" as false', () => {
    const xform = new BooleanXform({tag: 'strike', attr: 'val'});
    xform.parseOpen({name: 'strike', attributes: {val: '0'}});
    expect(xform.model).to.be.false();
  });

  it('parses val="1" as true', () => {
    const xform = new BooleanXform({tag: 'b', attr: 'val'});
    xform.parseOpen({name: 'b', attributes: {val: '1'}});
    expect(xform.model).to.be.true();
  });

  it('parses tag without val as true', () => {
    const xform = new BooleanXform({tag: 'i', attr: 'val'});
    xform.parseOpen({name: 'i', attributes: {}});
    expect(xform.model).to.be.true();
  });
});
