wxfz = wxfz||{};

wxfz.fortuna = {
    _ki: 0,
    initialize: function() {
        // 64-pools for simplicity.
        wxfz.fortuna._counter = 0;
        wxfz.fortuna._entropy = SHA256(""+new Date().getTime()).split("");
        wxfz.fortuna.accumulate();
        wxfz.fortuna.reseed();
        var timeout = wxfz.fortuna.generate(1).charCodeAt(0)*60;

        wxfz.fortuna._timer = setTimeout(wxfz.fortuna.accumulate,timeout);
        wxfz.fortuna._mm = 22*7;

        jQuery(document).ready(function(){
           $(document).mousemove(function(e){
              wxfz.fortuna._x = e.pageX;
              wxfz.fortuna._y = e.pageY;
              wxfz.fortuna._mm--;
              if (wxfz.fortuna._mm<0) {
                  wxfz.fortuna.accumulate();
                  wxfz.fortuna._mm = 22*7;
              }
           });
           /* Not using
           $(document).keydown(function(e){
              var ts = new Date();
              var sms = 1*(ts.getSeconds()+"."+ts.getMilliseconds());
              wxfz.fortuna._ki = Math.abs(wxfz.fortuna._ki-sms);
           });
           */
        });
    },
    entropySources: {
        time: function() {
            var ts = new Date();
            return SHA256(""+ts.getTime());
        },
        mouse: function() {
            return SHA256(!(wxfz.fortuna._x%23||wxfz.fortuna._y%13)
                ?  ""+wxfz.fortuna._x+wxfz.fortuna._y
                : ""+wxfz.fortuna._y+wxfz.fortuna._x);
        },
        /*keyboard: function() {
            return SHA256(""+wxfz._ki);
        },*/
        domSHA256: function() {
            return SHA256(""+$(document).html());
        }
    },
    _timer: false,
    accumulate: function() {
        for (var es in wxfz.fortuna.entropySources) {
            var bytes = wxfz.fortuna.entropySources[es]();
            var ent1 = Udon.zip(wxfz.fortuna._entropy, bytes);
            wxfz.fortuna._entropy = Udon.map(function(x){
                var ent = x.join("");
                if (ent.length>64) {
                    ent = SHA256(SHA256(ent));
                }
                return ent;
            },ent1);
        }
        if (wxfz.fortuna._timer) {
            clearTimeout(wxfz.fortuna._timer);
            var timeout = wxfz.fortuna.generate(1).charCodeAt(0)*6000;
            wxfz.fortuna._timer = setTimeout(wxfz.fortuna.accumulate,timeout);
        }
    },
    reseed: function() {
        var seed = "";
        for (var i = 1; i < wxfz.fortuna._entropy.length+1; i++) {
            if (wxfz.fortuna._counter%i==0) {
                seed += wxfz.fortuna._entropy[i-1];
            }
        }
        wxfz.fortuna._key = SHA256(SHA256(wxfz.fortuna._key+seed+wxfz.fortuna._counter));
    },
    generate: function(len) {
        len = len||1;
        var _key = wxfz.fortuna._key;
        var res = Base64.decode(Aes.Ctr.encrypt(_key,SHA256(""+(wxfz.fortuna._counter++)),256)).slice(8,8+len);
        wxfz.fortuna.reseed();
        return res;
    }
}
$(wxfz.fortuna.initialize);

