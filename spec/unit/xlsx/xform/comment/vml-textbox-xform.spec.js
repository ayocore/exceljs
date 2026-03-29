const VmlTextboxXform = verquire('xlsx/xform/comment/vml-textbox-xform');
const XmlStream = verquire('utils/xml-stream');

describe('VmlTextboxXform', () => {
  it('renders with default style when no margins', () => {
    const xform = new VmlTextboxXform();
    const xmlStream = new XmlStream();
    xform.render(xmlStream, {});
    expect(xmlStream.xml).to.contain('mso-direction-alt:auto');
    expect(xmlStream.xml).to.contain('v:textbox');
    expect(xmlStream.xml).to.contain('div');
  });

  it('renders with array inset margins', () => {
    const xform = new VmlTextboxXform();
    const xmlStream = new XmlStream();
    xform.render(xmlStream, {
      note: {margins: {inset: [0.7, 0.15, 0.7, 0.15]}},
    });
    expect(xmlStream.xml).to.contain('inset="7mm,1.5mm,7mm,1.5mm"');
  });

  it('renders with string inset', () => {
    const xform = new VmlTextboxXform();
    const xmlStream = new XmlStream();
    xform.render(xmlStream, {
      note: {margins: {inset: '7mm,1.5mm,7mm,1.5mm'}},
    });
    expect(xmlStream.xml).to.contain('inset="7mm,1.5mm,7mm,1.5mm"');
  });

  it('parses inset attribute', () => {
    const xform = new VmlTextboxXform();
    xform.parseOpen({name: 'v:textbox', attributes: {inset: '7mm,1.5mm,7mm,1.5mm'}});
    expect(xform.model.inset).to.be.an('array');
    expect(xform.model.inset).to.have.lengthOf(4);
  });

  it('parses close returns false for own tag', () => {
    const xform = new VmlTextboxXform();
    xform.parseOpen({name: 'v:textbox', attributes: {}});
    expect(xform.parseClose('div')).to.be.true();
    expect(xform.parseClose('v:textbox')).to.be.false();
  });
});
