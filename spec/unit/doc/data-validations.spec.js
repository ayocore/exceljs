const DataValidations = verquire('doc/data-validations');

describe('DataValidations', () => {
  it('creates with empty model by default', () => {
    const dv = new DataValidations();
    expect(dv.model).to.deep.equal({});
  });

  it('creates with provided model', () => {
    const model = {A1: {type: 'whole', operator: 'between', formulae: [1, 10]}};
    const dv = new DataValidations(model);
    expect(dv.model).to.equal(model);
  });

  it('adds a validation', () => {
    const dv = new DataValidations();
    const validation = {type: 'list', formulae: ['"Yes,No"']};
    dv.add('B2', validation);
    expect(dv.model.B2).to.equal(validation);
  });

  it('finds a validation', () => {
    const validation = {type: 'whole', operator: 'greaterThan', formulae: [0]};
    const dv = new DataValidations({C3: validation});
    expect(dv.find('C3')).to.equal(validation);
    expect(dv.find('D4')).to.be.undefined();
  });

  it('removes a validation', () => {
    const dv = new DataValidations({A1: {type: 'list', formulae: ['"A,B"']}});
    dv.remove('A1');
    expect(dv.model.A1).to.be.undefined();
  });

  it('overwrites existing validation', () => {
    const dv = new DataValidations({A1: {type: 'list', formulae: ['"A,B"']}});
    const newValidation = {type: 'whole', operator: 'equal', formulae: [5]};
    dv.add('A1', newValidation);
    expect(dv.find('A1')).to.equal(newValidation);
  });
});
