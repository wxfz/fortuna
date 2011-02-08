module("wxfz.aont");

test("pack-unpack", function() {
 ok(wxfz.aont.unpack(wxfz.aont.pack(""))=="","SHA256 empty string");
});

