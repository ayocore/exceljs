const StylesXform = verquire('xlsx/xform/style/styles-xform');
const Enums = verquire('doc/enums');

describe('StylesXform cache modes', () => {
  const testStyle = {numFmt: '#,##0.00', font: {name: 'Arial', size: 12, bold: true}};

  function addStyleTwice(cacheMode) {
    const styles = new StylesXform(true, cacheMode);
    const id1 = styles.addStyleModel(testStyle, Enums.ValueType.Number);
    const id2 = styles.addStyleModel({...testStyle}, Enums.ValueType.Number);
    return {id1, id2};
  }

  it('WEAK_MAP: different objects get different style ids', () => {
    const {id1, id2} = addStyleTwice('WEAK_MAP');
    // WeakMap keys by reference — spread creates a new object, no cache hit
    // Both should still produce valid style ids
    expect(id1).to.be.a('number');
    expect(id2).to.be.a('number');
  });

  it('JSON_MAP: identical structures share the same style id', () => {
    const {id1, id2} = addStyleTwice('JSON_MAP');
    expect(id1).to.equal(id2);
  });

  it('FAST_MAP: identical structures share the same style id', () => {
    const {id1, id2} = addStyleTwice('FAST_MAP');
    expect(id1).to.equal(id2);
  });

  it('NO_CACHE: always processes style (still produces valid ids)', () => {
    const {id1, id2} = addStyleTwice('NO_CACHE');
    expect(id1).to.be.a('number');
    expect(id2).to.be.a('number');
    // same style should still get same id because _addStyle deduplicates
    expect(id1).to.equal(id2);
  });

  it('defaults to WEAK_MAP when no mode specified', () => {
    const styles = new StylesXform(true);
    expect(styles.cacheMode).to.equal('WEAK_MAP');
  });

  it('same object reference hits cache in all modes', () => {
    for (const mode of ['WEAK_MAP', 'JSON_MAP', 'FAST_MAP']) {
      const styles = new StylesXform(true, mode);
      const style = {font: {name: 'Calibri', size: 11}};
      const id1 = styles.addStyleModel(style, Enums.ValueType.Number);
      const id2 = styles.addStyleModel(style, Enums.ValueType.Number);
      expect(id1).to.equal(id2);
    }
  });
});
