const {serializeStyle} = verquire('utils/style-fast-serialize');

describe('style-fast-serialize', () => {
  it('returns empty string for null/undefined', () => {
    expect(serializeStyle(null)).to.equal('');
    expect(serializeStyle(undefined)).to.equal('');
  });

  it('serializes numFmt only', () => {
    const result = serializeStyle({numFmt: '#,##0.00'});
    expect(result).to.contain('#,##0.00');
  });

  it('serializes font', () => {
    const result = serializeStyle({font: {name: 'Arial', size: 12, bold: true}});
    expect(result).to.contain('Arial');
    expect(result).to.contain('12');
  });

  it('serializes fill with pattern', () => {
    const result = serializeStyle({
      fill: {type: 'pattern', pattern: 'solid', fgColor: {argb: 'FFFF0000'}},
    });
    expect(result).to.contain('solid');
    expect(result).to.contain('FFFF0000');
  });

  it('serializes border', () => {
    const result = serializeStyle({
      border: {left: {style: 'thin', color: {argb: 'FF000000'}}},
    });
    expect(result).to.contain('thin');
    expect(result).to.contain('FF000000');
  });

  it('serializes alignment', () => {
    const result = serializeStyle({alignment: {horizontal: 'center', wrapText: true}});
    expect(result).to.contain('center');
  });

  it('serializes protection', () => {
    const result = serializeStyle({protection: {locked: true, hidden: true}});
    expect(result).to.be.a('string');
    expect(result.length).to.be.greaterThan(0);
  });

  it('produces identical output for identical styles', () => {
    const style = {
      numFmt: '0.00%',
      font: {name: 'Calibri', size: 11, bold: true, color: {argb: 'FF0000FF'}},
      fill: {type: 'pattern', pattern: 'solid', fgColor: {argb: 'FFFFFF00'}},
      border: {top: {style: 'medium', color: {argb: 'FF000000'}}},
      alignment: {horizontal: 'left', vertical: 'top'},
      protection: {locked: false},
    };
    const copy = JSON.parse(JSON.stringify(style));
    expect(serializeStyle(style)).to.equal(serializeStyle(copy));
  });

  it('produces different output for different styles', () => {
    const style1 = {font: {name: 'Arial', size: 12}};
    const style2 = {font: {name: 'Calibri', size: 11}};
    expect(serializeStyle(style1)).to.not.equal(serializeStyle(style2));
  });
});
