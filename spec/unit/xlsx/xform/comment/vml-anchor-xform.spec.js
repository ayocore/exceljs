const VmlAnchorXform = verquire('xlsx/xform/comment/vml-anchor-xform');
const XmlStream = verquire('utils/xml-stream');

describe('VmlAnchorXform', () => {
  it('renders with default rect from ref address', () => {
    const xform = new VmlAnchorXform();
    const xmlStream = new XmlStream();
    xform.render(xmlStream, {
      refAddress: {col: 1, row: 3},
    });
    // default: col, 6, max(row-2,0), 14, col+2, 2, max(row-2,0)+4, 16
    expect(xmlStream.xml).to.contain('x:Anchor');
    expect(xmlStream.xml).to.contain('1, 6, 1, 14, 3, 2, 5, 16');
  });

  it('renders with default rect when row is near top', () => {
    const xform = new VmlAnchorXform();
    const xmlStream = new XmlStream();
    xform.render(xmlStream, {
      refAddress: {col: 0, row: 1},
    });
    // top should be max(1-2, 0) = 0
    expect(xmlStream.xml).to.contain('0, 6, 0, 14, 2, 2, 4, 16');
  });

  it('renders with explicit anchor rect', () => {
    const xform = new VmlAnchorXform();
    const xmlStream = new XmlStream();
    xform.render(xmlStream, {
      anchor: {left: 1.5, top: 2.5, right: 4.5, bottom: 6.5},
      refAddress: {col: 1, row: 3},
    });
    // left: floor(1.5)=1, lf: floor(0.5*68)=34
    // top: floor(2.5)=2, tf: floor(0.5*18)=9
    // right: floor(4.5)=4, rf: floor(0.5*68)=34
    // bottom: floor(6.5)=6, bf: floor(0.5*18)=9
    expect(xmlStream.xml).to.contain('1, 34, 2, 9, 4, 34, 6, 9');
  });

  it('parses anchor text', () => {
    const xform = new VmlAnchorXform();
    expect(xform.parseOpen({name: 'x:Anchor'})).to.be.true();
    xform.parseText('1, 6, 1, 14, 3, 2, 5, 16');
    xform.parseClose('x:Anchor');
    expect(xform.text).to.equal('1, 6, 1, 14, 3, 2, 5, 16');
  });

  it('rejects unknown tags', () => {
    const xform = new VmlAnchorXform();
    expect(xform.parseOpen({name: 'other'})).to.be.false();
  });
});
