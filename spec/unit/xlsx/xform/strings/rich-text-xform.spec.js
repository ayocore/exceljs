const RichTextXform = verquire('xlsx/xform/strings/rich-text-xform');
const XmlStream = verquire('utils/xml-stream');

describe('RichTextXform', () => {
  it('renders rich text with font', () => {
    const xform = new RichTextXform();
    const xmlStream = new XmlStream();
    xform.render(xmlStream, {
      font: {bold: true, size: 11, name: 'Calibri'},
      text: 'Hello',
    });
    const {xml} = xmlStream;
    expect(xml).to.contain('<r>');
    expect(xml).to.contain('Hello');
  });

  it('does not render empty text', () => {
    const xform = new RichTextXform();
    const xmlStream = new XmlStream();
    xform.render(xmlStream, {
      font: {bold: true, size: 11, name: 'Calibri'},
      text: '',
    });
    expect(xmlStream.xml).to.equal('');
  });

  it('renders text without font', () => {
    const xform = new RichTextXform();
    const xmlStream = new XmlStream();
    xform.render(xmlStream, {text: 'plain text'});
    const {xml} = xmlStream;
    expect(xml).to.contain('<r>');
    expect(xml).to.contain('plain text');
    expect(xml).not.to.contain('<rPr>');
  });
});
