module("wxfz.fortuna");

test("fortuna exists", function() {
  ok( typeof(wxfz.fortuna), "object", "Fortuna not found." );
});

test("fortuna generate a byte string", function() {
  ok( wxfz.fortuna.generate(1).length, 1, "Fortuna couldn't generate a byte." );
});

