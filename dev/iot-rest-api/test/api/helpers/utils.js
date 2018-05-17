require('should');
const utils = require('../../../api/helpers/utils');

describe('utils', () => {
  describe('assertRequiredProperties()', () => {
    it('should throw an exception when passed an empty object', (done) => {
      (() => {
        utils.assertRequiredProperties(undefined, []);
      }).should.throw('Required object is undefined.');
      done();
    });

    it('should throw an exception if a property is missing', (done) => {
      (() => {
        utils.assertRequiredProperties({}, ['a']);
      }).should.throw('Missing required property a.');
      done();
    });

    it('should throw an exception specifying the first missing property', (done) => {
      (() => {
        utils.assertRequiredProperties({ a: 'a', b: 'b' }, ['a', 'b', 'c']);
      }).should.throw('Missing required property c.');
      done();
    });

    it('should not throw an exception if there is no missing property', (done) => {
      (() => {
        utils.assertRequiredProperties({ b: 'b', a: 'a' }, ['a', 'b']);
      }).should.not.throw();
      done();
    });

    it('should not throw an exception if the array of property is empty', (done) => {
      (() => {
        utils.assertRequiredProperties({ b: 'b', a: 'a' }, []);
      }).should.not.throw();
      (() => {
        utils.assertRequiredProperties({}, []);
      }).should.not.throw();
      done();
    });
  });
});
