const CommentsXform = verquire('xlsx/xform/comment/comments-xform');
const XmlStream = verquire('utils/xml-stream');

describe('CommentsXform', () => {
  it('renders a comment list', () => {
    const xform = new CommentsXform();
    const xmlStream = new XmlStream();
    xform.render(xmlStream, {
      comments: [
        {
          ref: 'A1',
          note: {
            texts: [{font: {size: 9, name: 'Calibri'}, text: 'Note 1'}],
          },
        },
        {
          ref: 'B2',
          note: {
            texts: [{font: {size: 9, name: 'Calibri'}, text: 'Note 2'}],
          },
        },
      ],
    });
    const {xml} = xmlStream;
    expect(xml).to.contain('<comments');
    expect(xml).to.contain('<authors>');
    expect(xml).to.contain('<author>Author</author>');
    expect(xml).to.contain('<commentList>');
    expect(xml).to.contain('ref="A1"');
    expect(xml).to.contain('ref="B2"');
  });

  it('parses commentList open', () => {
    const xform = new CommentsXform();
    expect(xform.parseOpen({name: 'commentList', attributes: {}})).to.be.true();
    expect(xform.model.comments).to.be.an('array');
  });

  it('parses comment within commentList', () => {
    const xform = new CommentsXform();
    xform.parseOpen({name: 'commentList', attributes: {}});
    expect(xform.parseOpen({name: 'comment', attributes: {ref: 'A1', authorId: '0'}})).to.be.true();
    expect(xform.parser).to.not.be.undefined();
  });

  it('returns false for unknown tags at top level', () => {
    const xform = new CommentsXform();
    expect(xform.parseOpen({name: 'unknown', attributes: {}})).to.be.false();
  });

  it('parseClose on commentList returns false', () => {
    const xform = new CommentsXform();
    xform.parseOpen({name: 'commentList', attributes: {}});
    expect(xform.parseClose('commentList')).to.be.false();
  });

  it('parseClose on comment collects model', () => {
    const xform = new CommentsXform();
    xform.parseOpen({name: 'commentList', attributes: {}});
    xform.parseOpen({name: 'comment', attributes: {ref: 'A1', authorId: '0'}});

    // simulate parser having completed
    xform.parser.model = {ref: 'A1', note: {texts: []}};
    xform.parseClose('comment');
    expect(xform.model.comments).to.have.lengthOf(1);
    expect(xform.model.comments[0].ref).to.equal('A1');
  });

  it('delegates parseText to parser', () => {
    const xform = new CommentsXform();
    // should not throw when no parser
    xform.parseText('some text');

    // when parser exists, delegate
    xform.parseOpen({name: 'commentList', attributes: {}});
    xform.parseOpen({name: 'comment', attributes: {ref: 'A1', authorId: '0'}});
    // should not throw
    xform.parseText('some text');
  });
});
