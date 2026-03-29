const {PassThrough} = require('stream');

const parseSax = verquire('utils/parse-sax');

describe('parse-sax', () => {
  it('parses simple XML', async () => {
    const stream = new PassThrough();
    stream.write('<root><child attr="val">text</child></root>');
    stream.end();

    const allEvents = [];
    for await (const events of parseSax(stream)) {
      allEvents.push(...events);
    }

    const openTags = allEvents.filter(e => e.eventType === 'opentag').map(e => e.value.name);
    expect(openTags).to.include('root');
    expect(openTags).to.include('child');
  });

  it('handles multi-byte UTF-8 characters split across chunks', async () => {
    // Chinese character 中 is 3 bytes: E4 B8 AD
    const xml = '<root><text>中文测试</text></root>';
    const buf = Buffer.from(xml);

    const stream = new PassThrough();
    // split in the middle of a multi-byte character
    const splitPoint = buf.indexOf(0xb8); // middle byte of 中
    stream.write(buf.subarray(0, splitPoint));
    stream.write(buf.subarray(splitPoint));
    stream.end();

    const texts = [];
    for await (const events of parseSax(stream)) {
      for (const event of events) {
        if (event.eventType === 'text') {
          texts.push(event.value);
        }
      }
    }

    expect(texts.join('')).to.equal('中文测试');
  });

  it('handles chunks with no closing bracket', async () => {
    const stream = new PassThrough();
    // send attribute value across chunks - no > in first chunk
    stream.write('<root attr="long');
    stream.write('value">content</root>');
    stream.end();

    const allEvents = [];
    for await (const events of parseSax(stream)) {
      allEvents.push(...events);
    }

    const openTag = allEvents.find(e => e.eventType === 'opentag' && e.value.name === 'root');
    expect(openTag).to.not.be.undefined();
  });
});
