const CommentXform = verquire('xlsx/xform/comment/comment-xform');
const XmlStream = verquire('utils/xml-stream');

describe('CommentXform', () => {
  it('renders a comment with rich text', () => {
    const xform = new CommentXform();
    const xmlStream = new XmlStream();
    xform.render(xmlStream, {
      ref: 'B1',
      note: {
        texts: [
          {font: {bold: true, size: 9, name: 'Calibri'}, text: 'Author:'},
          {font: {size: 9, name: 'Calibri'}, text: '\nHello world'},
        ],
      },
    });
    const {xml} = xmlStream;
    expect(xml).to.contain('<comment');
    expect(xml).to.contain('ref="B1"');
    expect(xml).to.contain('authorId="0"');
    expect(xml).to.contain('<text>');
    expect(xml).to.contain('<r>');
  });

  it('renders comment with empty texts', () => {
    const xform = new CommentXform();
    const xmlStream = new XmlStream();
    xform.render(xmlStream, {
      ref: 'A1',
      note: {texts: []},
    });
    expect(xmlStream.xml).to.contain('<comment');
    expect(xmlStream.xml).to.contain('<text');
  });

  it('parses a comment element', () => {
    const xform = new CommentXform();

    expect(xform.parseOpen({name: 'comment', attributes: {ref: 'C3', authorId: '0'}})).to.be.true();
    expect(xform.model.ref).to.equal('C3');
    expect(xform.model.note.texts).to.be.an('array');

    // open rich text node
    expect(xform.parseOpen({name: 'r', attributes: {}})).to.be.true();
  });

  it('returns false for unknown tags', () => {
    const xform = new CommentXform();
    expect(xform.parseOpen({name: 'unknownTag', attributes: {}})).to.be.false();
  });

  it('parseClose returns false on comment close', () => {
    const xform = new CommentXform();
    xform.parseOpen({name: 'comment', attributes: {ref: 'A1', authorId: '0'}});
    expect(xform.parseClose('comment')).to.be.false();
  });

  it('parseClose collects rich text on r close', () => {
    const xform = new CommentXform();
    xform.parseOpen({name: 'comment', attributes: {ref: 'A1', authorId: '0'}});
    xform.parseOpen({name: 'r', attributes: {}});

    // simulate parser having a model
    xform.parser.model = {text: 'test', font: {}};
    expect(xform.parseClose('r')).to.be.true();
    expect(xform.model.note.texts).to.have.lengthOf(1);
    expect(xform.parser).to.be.undefined();
  });
});
