module("AES");

test("encrypt and decrypt 256-bits", function() {
  expect(2);
  ok( Aes.Ctr.encrypt("swordfish","Hello world.",256),"Li5QTbOzs7NC6HAIpI7eKSs=","Encryption ok");
  ok( Aes.Ctr.decrypt("swordfish","Li5QTbOzs7NC6HAIpI7eKSs=",256),"Hello ad.","Decryption ok");
});

