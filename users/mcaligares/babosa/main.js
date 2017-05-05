describe('code-challenges', function () {


    it('your awesome test', function () {
        expect(true).toBeTruthy();
    });
    it('primer', function () {
        var result = escalar(10, 2, 1);
        dump(10, 2, 1,result);
        expect(result).toBe(17);
    });
    it('segundo', function () {
        var result = escalar(20, 3, 1);
        dump(20, 3, 1,result);
        expect(result).toBe(19);
    });
    it('tercer', function () {
        var result = escalar(0,0,0);
        dump(0,0,0,result);
        expect(result).toBe(0);
    });
});
