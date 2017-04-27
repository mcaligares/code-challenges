describe('code-challenges', function () {
    it('get key', function () {
        expect(getKey('h')).toBe(4);
    });
    it('get position', function () {
        expect(getPos('h')).toBe(2);
    });
    it('get key for chart', function () {
        var obj = getKeysAndPos('h');
        expect(obj.key).toBe(4);
        expect(obj.times).toBe(2);
    });
    it('get key for space', function () {
        var obj = getKeysAndPos(' ');
        expect(obj.key).toBe(0);
        expect(obj.times).toBe(1);
    });
    it('to lang', function () {
        //expect(toLang('hi')).toBe('44 444');
    });
});
